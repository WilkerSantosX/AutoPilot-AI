import { isCareEvent, isVehicleId } from "./careModel.js";

export const CARE_STORAGE_KEY_PREFIX = "autopilot.vehicle-care.v1:";

export function loadCareEvents(vehicleId, storage) {
    if (!isVehicleId(vehicleId)) {
        return failedHistory("A identificação do veículo é inválida.");
    }

    try {
        storage ??= globalThis.localStorage;
        const serialized = storage.getItem(storageKey(vehicleId));

        if (serialized === null) {
            return { ok: true, events: [], error: null };
        }

        const history = JSON.parse(serialized);
        const ids = new Set();
        if (!history || history.schemaVersion !== 1
            || history.vehicleId !== vehicleId || !Array.isArray(history.events)
            || !history.events.every(event => {
                if (!isCareEvent(event) || event.vehicleId !== vehicleId || ids.has(event.id)) {
                    return false;
                }
                ids.add(event.id);
                return true;
            })) {
            return failedHistory("O histórico de cuidados salvo possui dados inválidos.");
        }

        return { ok: true, events: history.events, error: null };
    } catch {
        return failedHistory("Não foi possível carregar o histórico de cuidados neste dispositivo.");
    }
}

export function saveCareEvent(event, storage) {
    if (!isCareEvent(event)) {
        return { ok: false, error: "O evento de cuidado é inválido e não pôde ser salvo." };
    }

    try {
        storage ??= globalThis.localStorage;
        const history = loadCareEvents(event.vehicleId, storage);
        if (!history.ok) {
            return { ok: false, error: history.error };
        }
        if (history.events.some(saved => saved.id === event.id)) {
            return { ok: false, error: "Já existe um evento com esta identificação neste veículo." };
        }

        storage.setItem(storageKey(event.vehicleId), JSON.stringify({
            schemaVersion: 1,
            vehicleId: event.vehicleId,
            events: [...history.events, event]
        }));
        return { ok: true, error: null };
    } catch {
        return { ok: false, error: "Não foi possível salvar o cuidado neste dispositivo." };
    }
}

function storageKey(vehicleId) {
    return CARE_STORAGE_KEY_PREFIX + vehicleId;
}

function failedHistory(error) {
    return { ok: false, events: [], error };
}
