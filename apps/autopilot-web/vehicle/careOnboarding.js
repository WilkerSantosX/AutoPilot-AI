import { createCareEvent, isCareEvent, isCareItemId, isVehicleId } from "./careModel.js";
import { loadCareEvents, saveCareEvent } from "./careStorage.js";
import { createOdometerCheckpoint, isOdometerCheckpoint } from "./odometerModel.js";
import { loadOdometerCheckpoints, saveOdometerCheckpoint } from "./odometerStorage.js";
import { evaluateCareItem, isCareReference } from "./careStateEngine.js";
import { loadCareReferences, saveCareReference } from "./careReferenceStorage.js";

export function loadCareOnboarding(vehicleId, careItemId, storage) {
    if (!isCareItemId(careItemId)) return failed("O cuidado é inválido.");
    const care = loadCareEvents(vehicleId, storage);
    const odometer = loadOdometerCheckpoints(vehicleId, storage);
    const references = loadCareReferences(vehicleId, storage);
    if (!care.ok || !odometer.ok || !references.ok) return failed(care.error || odometer.error || references.error);
    const input = { vehicleId, careItemId, events: care.events, checkpoints: odometer.checkpoints };
    const selected = evaluateCareItem(input);
    if (!selected.ok) return failed(selected.error);
    const reference = references.references.find(saved => saved.careEventId === selected.evaluation.evidence.careEvent?.id) ?? null;
    const result = evaluateCareItem({ ...input, reference });
    return { ...result, events: care.events, checkpoints: odometer.checkpoints, references: references.references, reference };
}

export function prepareCareOnboarding(input, context, { now = new Date().toISOString() } = {}) {
    if (!context?.ok || !isVehicleId(input?.vehicleId) || !isCareItemId(input?.careItemId)
        || context.evaluation.vehicleId !== input.vehicleId || context.evaluation.careItemId !== input.careItemId) {
        return failed("Não foi possível confirmar o contexto deste cuidado.");
    }
    if (input.knowledge === "unknown") {
        return { ok: true, plan: { vehicleId: input.vehicleId, careItemId: input.careItemId,
            event: null, checkpoint: null, reference: null }, error: null };
    }
    if (input.knowledge !== "known") return failed("Escolha o que você sabe sobre este cuidado.");
    let event = input.careEventId
        ? context.events.find(saved => saved.id === input.careEventId && saved.careItemId === input.careItemId)
        : null;
    if (input.careEventId && !event) return failed("O marco salvo não foi encontrado.");
    if (!event) {
        const created = createCareEvent({ vehicleId: input.vehicleId, careItemId: input.careItemId,
            action: "performed", occurredAt: input.occurredAt, mileage: input.mileage ?? null }, { now });
        if (!created.ok) return failed("Informe a data do cuidado realizado e uma quilometragem válida, se conhecida.");
        event = created.event;
    }
    const reference = input.nextDueMileage == null ? null : { vehicleId: input.vehicleId,
        careItemId: input.careItemId, careEventId: event.id, nextDueMileage: input.nextDueMileage, source: "user" };
    if (reference && event.mileage === null) return failed("A referência precisa da quilometragem conhecida do marco.");
    let checkpoint = null;
    if (input.currentMileage != null) {
        const created = createOdometerCheckpoint({ vehicleId: input.vehicleId, mileage: input.currentMileage,
            occurredAt: now }, { now });
        if (!created.ok) return failed("Informe a quilometragem atual como inteiro não negativo.");
        checkpoint = created.checkpoint;
    }
    const evaluation = evaluateCareItem({ vehicleId: input.vehicleId, careItemId: input.careItemId,
        events: context.events.some(saved => saved.id === event.id) ? context.events : [...context.events, event],
        checkpoints: checkpoint ? [...context.checkpoints, checkpoint] : context.checkpoints, reference });
    if (!evaluation.ok) return failed("A próxima referência deve ser um inteiro maior que a quilometragem do marco.");
    if (checkpoint && event.mileage !== null && checkpoint.mileage < event.mileage) {
        return failed("A leitura atual não pode ser inferior à quilometragem deste marco.");
    }
    return { ok: true, plan: { vehicleId: input.vehicleId, careItemId: input.careItemId, event, checkpoint, reference }, error: null };
}

// Escritas separadas seguem os storages existentes. Repetir o mesmo plano não duplica fatos já salvos.
export function saveCareOnboarding(plan, storage) {
    const context = loadCareOnboarding(plan?.vehicleId, plan?.careItemId, storage);
    if (!context.ok) return context;
    if ((plan.event && (!isCareEvent(plan.event) || plan.event.vehicleId !== plan.vehicleId || plan.event.careItemId !== plan.careItemId))
        || (plan.checkpoint && (!isOdometerCheckpoint(plan.checkpoint) || plan.checkpoint.vehicleId !== plan.vehicleId))
        || (plan.reference && (!isCareReference(plan.reference) || !plan.event
            || plan.reference.careEventId !== plan.event.id || plan.event.mileage === null
            || plan.reference.nextDueMileage <= plan.event.mileage))) {
        return failed("Os fatos preparados não pertencem a este cuidado/veículo.");
    }
    const events = plan.event ? [...context.events.filter(event => event.id !== plan.event.id), plan.event] : context.events;
    const checkpoints = plan.checkpoint ? [...context.checkpoints.filter(checkpoint => checkpoint.id !== plan.checkpoint.id), plan.checkpoint] : context.checkpoints;
    const validation = evaluateCareItem({ vehicleId: plan.vehicleId, careItemId: plan.careItemId,
        events, checkpoints, reference: plan.reference });
    if (!validation.ok || (plan.reference && !plan.event)) return failed("Os dados preparados são inválidos.");
    const existingEvent = plan.event && context.events.find(event => event.id === plan.event.id);
    const existingCheckpoint = plan.checkpoint && context.checkpoints.find(checkpoint => checkpoint.id === plan.checkpoint.id);
    if (existingEvent && JSON.stringify(existingEvent) !== JSON.stringify(plan.event)) return failed("O marco já salvo foi preservado.");
    if (existingCheckpoint && JSON.stringify(existingCheckpoint) !== JSON.stringify(plan.checkpoint)) return failed("A leitura já salva foi preservada.");
    const existingReference = plan.reference && context.references.find(reference => reference.careEventId === plan.reference.careEventId);
    if (existingReference && existingReference.nextDueMileage !== plan.reference.nextDueMileage) return failed("A referência já salva foi preservada.");
    if (plan.event) {
        if (!existingEvent) {
            const saved = saveCareEvent(plan.event, storage);
            if (!saved.ok) return failed(saved.error);
        }
    }
    if (plan.checkpoint) {
        if (!existingCheckpoint) {
            const saved = saveOdometerCheckpoint(plan.checkpoint, storage);
            if (!saved.ok) return failed(saved.error);
        }
    }
    if (plan.reference) {
        const saved = saveCareReference(plan.reference, storage);
        if (!saved.ok) return failed(saved.error);
    }
    return loadCareOnboarding(plan.vehicleId, plan.careItemId, storage);
}

function failed(error) {
    return { ok: false, error };
}
