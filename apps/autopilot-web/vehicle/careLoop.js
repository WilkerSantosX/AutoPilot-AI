import { prepareCareOnboarding, saveCareOnboarding } from "./careOnboarding.js";
import { createOdometerCheckpoint, getLatestOdometerCheckpoint } from "./odometerModel.js";

export function prepareCareLoop(input, context, { now = new Date().toISOString() } = {}) {
    if (Number.isNaN(Date.parse(input?.occurredAt)) || Date.parse(input.occurredAt) > Date.parse(now)) {
        return failed("Informe a data de um cuidado que já foi realizado.");
    }
    const prepared = prepareCareOnboarding({ vehicleId: input.vehicleId, careItemId: input.careItemId,
        knowledge: "known", occurredAt: input.occurredAt, mileage: input.mileage ?? null,
        nextDueMileage: input.nextDueMileage ?? null }, context, { now });
    if (!prepared.ok) return prepared;
    const plan = prepared.plan;
    if (plan.event.mileage !== null) {
        const latest = getLatestOdometerCheckpoint(context.checkpoints, input.vehicleId).checkpoint;
        if (latest && Date.parse(plan.event.occurredAt) >= Date.parse(latest.occurredAt)
            && plan.event.mileage < latest.mileage) return failed("A leitura desse momento não pode reduzir a última quilometragem conhecida. Confira a data e o valor.");
        const equivalent = context.checkpoints.find(checkpoint => checkpoint.mileage === plan.event.mileage
            && Date.parse(checkpoint.occurredAt) === Date.parse(plan.event.occurredAt));
        plan.checkpoint = equivalent ?? createOdometerCheckpoint({ vehicleId: input.vehicleId,
            mileage: plan.event.mileage, occurredAt: plan.event.occurredAt }, { now }).checkpoint;
    }
    return prepared;
}

export function saveCareLoop(plan, storage) {
    if (!plan?.event || (plan.event.mileage !== null && !plan.checkpoint) || (plan.checkpoint && (plan.checkpoint.mileage !== plan.event.mileage
        || Date.parse(plan.checkpoint.occurredAt) !== Date.parse(plan.event.occurredAt)))) {
        return failed("O registro do cuidado e sua leitura factual não são coerentes.");
    }
    return saveCareOnboarding(plan, storage);
}

function failed(error) { return { ok: false, error }; }
