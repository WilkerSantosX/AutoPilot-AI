import { isCareEvent, isCareItemId, isVehicleId } from "./careModel.js";
import { isOdometerCheckpoint, getLatestOdometerCheckpoint } from "./odometerModel.js";

export const CARE_STATES = Object.freeze([
    "up-to-date", "due-soon", "attention-needed", "insufficient-information"
]);

export function isCareState(value) {
    return CARE_STATES.includes(value);
}

// Sem política aprovada, um cuidado realizado não prova que o acompanhamento está em dia.
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

    return {
        ok: true,
        evaluation: {
            vehicleId,
            careItemId,
            state: "insufficient-information",
            nextAction: latestEvent
                ? { type: "provide-information", information: "care-policy" }
                : { type: "provide-information", information: "care-history",
                    alternative: "record-performed-care" },
            evidence: {
                careEvent: latestEvent ? { ...latestEvent } : null,
                odometerCheckpoint: latestReading.checkpoint ? { ...latestReading.checkpoint } : null,
                policy: null,
                calculation: null
            },
            missingInformation: latestEvent ? ["care-policy"] : ["care-history", "care-policy"]
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
