import { isVehicleProfile } from "./vehicleModel.js";

export const ODOMETER_CHECKPOINT_SCHEMA_VERSION = 1;

export function createOdometerCheckpoint(input, {
    id = createId(),
    now = new Date().toISOString()
} = {}) {
    const checkpoint = {
        id,
        vehicleId: input?.vehicleId,
        mileage: input?.mileage,
        occurredAt: input?.occurredAt,
        recordedAt: now,
        schemaVersion: ODOMETER_CHECKPOINT_SCHEMA_VERSION
    };
    if (!isOdometerCheckpoint(checkpoint)) {
        return { ok: false, checkpoint: null, error: "A leitura de quilometragem é inválida." };
    }
    return { ok: true, checkpoint, error: null };
}

export function isOdometerCheckpoint(value) {
    return !!value && typeof value === "object" && !Array.isArray(value)
        && isId(value.id) && isId(value.vehicleId)
        && Number.isSafeInteger(value.mileage) && value.mileage >= 0
        && isValidDate(value.occurredAt) && isValidDate(value.recordedAt)
        && value.schemaVersion === ODOMETER_CHECKPOINT_SCHEMA_VERSION;
}

export function isOdometerHistory(checkpoints, vehicleId) {
    if (!isId(vehicleId) || !Array.isArray(checkpoints)) return false;
    const ids = new Set();
    return checkpoints.every(checkpoint => {
        if (!isOdometerCheckpoint(checkpoint) || checkpoint.vehicleId !== vehicleId
            || ids.has(checkpoint.id)) return false;
        ids.add(checkpoint.id);
        return true;
    });
}

export function getLatestOdometerCheckpoint(checkpoints, vehicleId) {
    if (!isOdometerHistory(checkpoints, vehicleId)) {
        return { ok: false, checkpoint: null, error: "O histórico de quilometragem é inválido." };
    }
    const ordered = [...checkpoints].sort(compareCheckpoints);
    return { ok: true, checkpoint: ordered.at(-1) ?? null, error: null };
}

// A preparação é explícita: não escreve no perfil nem transforma seus metadados em data de leitura.
export function prepareVehicleProfileMileage(profile, checkpoints, {
    now = new Date().toISOString()
} = {}) {
    if (!isVehicleProfile(profile) || !isValidDate(now)
        || Date.parse(now) < Date.parse(profile.updatedAt)) {
        return { ok: false, profile: null, error: "O perfil ou a data de atualização é inválido." };
    }
    const latest = getLatestOdometerCheckpoint(checkpoints, profile.id);
    if (!latest.ok) return { ok: false, profile: null, error: latest.error };
    if (!latest.checkpoint) return { ok: true, profile: { ...profile }, error: null };
    if (latest.checkpoint.mileage < profile.mileage) {
        return { ok: false, profile: null, error: "A leitura não pode reduzir a quilometragem atual do perfil." };
    }
    return {
        ok: true,
        profile: { ...profile, mileage: latest.checkpoint.mileage, updatedAt: now },
        error: null
    };
}

function compareCheckpoints(left, right) {
    return Date.parse(left.occurredAt) - Date.parse(right.occurredAt)
        || Date.parse(left.recordedAt) - Date.parse(right.recordedAt)
        || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
}

function isId(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isValidDate(value) {
    return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function createId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `odometer-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
