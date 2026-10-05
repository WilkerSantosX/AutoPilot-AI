import { isCareEvent, isCareItemId, isVehicleId } from "./careModel.js";
import { isOdometerCheckpoint, getLatestOdometerCheckpoint } from "./odometerModel.js";

export const CARE_STATES = Object.freeze([
    "up-to-date", "due-soon", "attention-needed", "insufficient-information"
]);

export function isCareState(value) {
    return CARE_STATES.includes(value);
}

export const CARE_STATE_POLICY = Object.freeze({ id: "user-next-due-mileage", version: 1 });

export function isCareReference(value) {
    return !!value && typeof value === "object" && !Array.isArray(value)
        && isVehicleId(value.vehicleId) && isCareItemId(value.careItemId)
        && isVehicleId(value.careEventId) && value.source === "user"
        && Number.isSafeInteger(value.nextDueMileage) && value.nextDueMileage >= 0;
}

// A referência pertence a um marco específico; não define os próximos ciclos.
export function evaluateCareItem(input) {
    if (!input || !isVehicleId(input.vehicleId) || !isCareItemId(input.careItemId)
        || !Array.isArray(input.events) || ![...input.events].every(isCareEvent)
        || !Array.isArray(input.checkpoints) || ![...input.checkpoints].every(isOdometerCheckpoint)) {
        return failedEvaluation();
    }

    const { vehicleId, careItemId } = input;
    const vehicleEvents = input.events.filter(event => event.vehicleId === vehicleId);
    if (new Set(vehicleEvents.map(event => event.id)).size !== vehicleEvents.length) {
        return failedEvaluation();
    }
    const latestReading = getLatestOdometerCheckpoint(
        input.checkpoints.filter(checkpoint => checkpoint.vehicleId === vehicleId), vehicleId
    );
    if (!latestReading.ok) return failedEvaluation();

    const relevantEvents = vehicleEvents.filter(event => event.careItemId === careItemId);
    const latestEvent = [...relevantEvents].sort(compareEvents).at(-1) ?? null;
    const reference = input.reference ?? null;
    if (reference !== null && (!isCareReference(reference)
        || reference.vehicleId !== vehicleId || reference.careItemId !== careItemId)) {
        return failedEvaluation();
    }

    const matchingReference = reference && latestEvent && reference.careEventId === latestEvent.id;
    if (matchingReference && latestEvent.mileage !== null
        && reference.nextDueMileage <= latestEvent.mileage) return failedEvaluation();

    const missingInformation = [];
    if (!latestEvent) missingInformation.push("care-history");
    else if (latestEvent.mileage === null) missingInformation.push("milestone-mileage");
    if (!matchingReference) missingInformation.push("care-reference");
    const currentReading = latestReading.checkpoint;
    // Uma leitura anterior ao marco não posiciona o acompanhamento atual desse marco.
    if (!currentReading || (latestEvent && (Date.parse(currentReading.occurredAt) < Date.parse(latestEvent.occurredAt)
        || (latestEvent.mileage !== null && currentReading.mileage < latestEvent.mileage)))) {
        missingInformation.push("odometer-checkpoint");
    }

    let state = "insufficient-information";
    let calculation = null;
    let nextAction = missingInformation[0] === "odometer-checkpoint"
        ? { type: "update-mileage" }
        : { type: "provide-information", information: missingInformation[0] };
    if (missingInformation[0] === "care-history") nextAction.alternative = "record-performed-care";

    if (!missingInformation.length) {
        const intervalMileage = reference.nextDueMileage - latestEvent.mileage;
        // ceil(nextDue - interval/10) equivale a nextDue - floor(interval/10), sem multiplicação insegura.
        const attentionWindowMileage = Math.floor(intervalMileage / 10);
        const dueSoonThreshold = reference.nextDueMileage - attentionWindowMileage;
        calculation = { milestoneMileage: latestEvent.mileage, nextDueMileage: reference.nextDueMileage,
            currentMileage: currentReading.mileage, intervalMileage, attentionWindowMileage, dueSoonThreshold };
        state = currentReading.mileage >= reference.nextDueMileage ? "attention-needed"
            : currentReading.mileage >= dueSoonThreshold ? "due-soon" : "up-to-date";
        nextAction = state === "up-to-date" ? { type: "monitor" }
            : state === "due-soon" ? { type: "prepare-for-reference" }
                : { type: "act-on-reference", afterCare: "record-performed-care" };
    }

    return {
        ok: true,
        evaluation: {
            vehicleId,
            careItemId,
            state,
            nextAction,
            evidence: {
                careEvent: latestEvent ? { ...latestEvent } : null,
                odometerCheckpoint: latestReading.checkpoint ? { ...latestReading.checkpoint } : null,
                reference: reference ? { ...reference } : null,
                policy: { ...CARE_STATE_POLICY },
                calculation
            },
            missingInformation
        },
        error: null
    };
}

// Desempate técnico estável; recordedAt não substitui a data factual occurredAt.
function compareEvents(left, right) {
    return Date.parse(left.occurredAt) - Date.parse(right.occurredAt)
        || Date.parse(left.recordedAt) - Date.parse(right.recordedAt)
        || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
}

function failedEvaluation() {
    return { ok: false, evaluation: null, error: "Os dados da avaliação de cuidado são inválidos." };
}
