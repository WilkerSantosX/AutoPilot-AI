export const CARE_ITEMS = Object.freeze([
    Object.freeze({ id: "engine-oil" }),
    Object.freeze({ id: "cooling" }),
    Object.freeze({ id: "basic-review" })
]);

export const CARE_EVENT_SCHEMA_VERSION = 1;

export function isCareItemId(value) {
    return CARE_ITEMS.some(item => item.id === value);
}

export function isVehicleId(value) {
    return typeof value === "string" && value.trim().length > 0;
}

// A ação registra cuidado realizado; não declara condição mecânica ou prazo futuro.
export function createCareEvent(input, {
    id = createId(),
    now = new Date().toISOString()
} = {}) {
    const event = {
        id,
        vehicleId: input?.vehicleId,
        careItemId: input?.careItemId,
        action: input?.action,
        occurredAt: input?.occurredAt,
        recordedAt: now,
        mileage: input?.mileage ?? null,
        schemaVersion: CARE_EVENT_SCHEMA_VERSION
    };

    if (!isCareEvent(event)) {
        return { ok: false, event: null, error: "O evento de cuidado é inválido." };
    }

    return { ok: true, event, error: null };
}

export function isCareEvent(value) {
    return !!value && typeof value === "object" && !Array.isArray(value)
        && isVehicleId(value.id)
        && isVehicleId(value.vehicleId)
        && isCareItemId(value.careItemId)
        && value.action === "performed"
        && isValidDate(value.occurredAt)
        && isValidDate(value.recordedAt)
        && (value.mileage === null
            || (Number.isSafeInteger(value.mileage) && value.mileage >= 0))
        && value.schemaVersion === CARE_EVENT_SCHEMA_VERSION;
}

function isValidDate(value) {
    return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function createId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `care-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
