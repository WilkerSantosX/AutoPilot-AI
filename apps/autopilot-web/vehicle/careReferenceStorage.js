import { isVehicleId } from "./careModel.js";
import { isCareReference } from "./careStateEngine.js";
import { loadCareEvents } from "./careStorage.js";

export const CARE_REFERENCE_STORAGE_KEY_PREFIX = "autopilot.care-references.v1:";

export function loadCareReferences(vehicleId, storage) {
    if (!isVehicleId(vehicleId)) return failed("A identificação do veículo é inválida.");
    try {
        storage ??= globalThis.localStorage;
        const serialized = storage.getItem(CARE_REFERENCE_STORAGE_KEY_PREFIX + vehicleId);
        if (serialized === null) return { ok: true, references: [], error: null };
        const history = JSON.parse(serialized);
        const care = loadCareEvents(vehicleId, storage);
        if (!care.ok) return failed(care.error);
        const ids = new Set();
        if (!history || history.schemaVersion !== 1 || history.vehicleId !== vehicleId
            || !Array.isArray(history.references) || !history.references.every(reference => {
                if (!matchesMilestone(reference, care.events, vehicleId) || ids.has(reference.careEventId)) return false;
                ids.add(reference.careEventId);
                return true;
            })) return failed("As referências salvas possuem dados inválidos.");
        return { ok: true, references: history.references, error: null };
    } catch {
        return failed("Não foi possível carregar as referências neste dispositivo.");
    }
}

export function saveCareReference(reference, storage) {
    if (!isCareReference(reference)) return { ok: false, error: "A referência é inválida." };
    try {
        storage ??= globalThis.localStorage;
        const care = loadCareEvents(reference.vehicleId, storage);
        if (!care.ok) return { ok: false, error: care.error };
        if (!matchesMilestone(reference, care.events, reference.vehicleId)) {
            return { ok: false, error: "A próxima referência deve ser maior que a quilometragem do marco salvo." };
        }
        const history = loadCareReferences(reference.vehicleId, storage);
        if (!history.ok) return { ok: false, error: history.error };
        const existing = history.references.find(saved => saved.careEventId === reference.careEventId);
        if (existing) {
            return existing.nextDueMileage === reference.nextDueMileage
                ? { ok: true, error: null }
                : { ok: false, error: "Este marco já possui uma referência salva; ela foi preservada." };
        }
        storage.setItem(CARE_REFERENCE_STORAGE_KEY_PREFIX + reference.vehicleId, JSON.stringify({
            schemaVersion: 1, vehicleId: reference.vehicleId, references: [...history.references, reference]
        }));
        return { ok: true, error: null };
    } catch {
        return { ok: false, error: "Não foi possível salvar a referência neste dispositivo. Tente novamente." };
    }
}

function matchesMilestone(reference, events, vehicleId) {
    if (!isCareReference(reference) || reference.vehicleId !== vehicleId) return false;
    const event = events.find(saved => saved.id === reference.careEventId);
    return !!event && event.vehicleId === reference.vehicleId && event.careItemId === reference.careItemId
        && event.mileage !== null && reference.nextDueMileage > event.mileage;
}

function failed(error) {
    return { ok: false, references: [], error };
}
