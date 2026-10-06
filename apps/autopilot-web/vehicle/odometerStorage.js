import { isOdometerCheckpoint, isOdometerHistory } from "./odometerModel.js";

export const ODOMETER_STORAGE_KEY_PREFIX = "autopilot.odometer-checkpoints.v1:";

export function loadOdometerCheckpoints(vehicleId, storage) {
    if (!isOdometerHistory([], vehicleId)) return failedHistory("A identificação do veículo é inválida.");
    try {
        storage ??= globalThis.localStorage;
        const serialized = storage.getItem(ODOMETER_STORAGE_KEY_PREFIX + vehicleId);
        if (serialized === null) return { ok: true, checkpoints: [], error: null };
        const history = JSON.parse(serialized);
        if (!history || history.schemaVersion !== 1 || history.vehicleId !== vehicleId
            || !isOdometerHistory(history.checkpoints, vehicleId)) {
            return failedHistory("O histórico de quilometragem salvo possui dados inválidos.");
        }
        return { ok: true, checkpoints: history.checkpoints, error: null };
    } catch {
        return failedHistory("Não foi possível carregar o histórico de quilometragem neste dispositivo.");
    }
}

export function saveOdometerCheckpoint(checkpoint, storage) {
    if (!isOdometerCheckpoint(checkpoint)) {
        return { ok: false, error: "A leitura de quilometragem é inválida e não pôde ser salva." };
    }
    try {
        storage ??= globalThis.localStorage;
        const history = loadOdometerCheckpoints(checkpoint.vehicleId, storage);
        if (!history.ok) return { ok: false, error: history.error };
        if (history.checkpoints.some(saved => saved.id === checkpoint.id)) {
            return { ok: false, error: "Já existe uma leitura com esta identificação neste veículo." };
        }
        storage.setItem(ODOMETER_STORAGE_KEY_PREFIX + checkpoint.vehicleId, JSON.stringify({
            schemaVersion: 1,
            vehicleId: checkpoint.vehicleId,
            checkpoints: [...history.checkpoints, checkpoint]
        }));
        return { ok: true, error: null };
    } catch {
        return { ok: false, error: "Não foi possível salvar a leitura neste dispositivo." };
    }
}

function failedHistory(error) {
    return { ok: false, checkpoints: [], error };
}
