import { validateVehicleInput } from "./vehicleValidator.js";

export const VEHICLE_PROFILE_SCHEMA_VERSION = 1;

export function createVehicleProfile(input, {
    id = createId(),
    now = new Date().toISOString(),
    currentYear
} = {}) {
    const validation = validateVehicleInput(input, currentYear);

    if (!validation.isValid) {
        return {
            ok: false,
            errors: validation.errors,
            profile: null
        };
    }

    return {
        ok: true,
        errors: {},
        profile: {
            id,
            ...validation.value,
            createdAt: now,
            updatedAt: now,
            schemaVersion: VEHICLE_PROFILE_SCHEMA_VERSION
        }
    };
}

export function isVehicleProfile(value, currentYear = new Date().getFullYear()) {
    if (!value || typeof value !== "object") {
        return false;
    }

    const validation = validateVehicleInput(value, currentYear);
    const normalized = validation.value;

    return validation.isValid
        && typeof value.id === "string"
        && value.id.trim().length > 0
        && value.manufacturer === normalized.manufacturer
        && value.model === normalized.model
        && value.year === normalized.year
        && value.engine === normalized.engine
        && value.fuelType === normalized.fuelType
        && value.mileage === normalized.mileage
        && value.nickname === normalized.nickname
        && isValidDate(value.createdAt)
        && isValidDate(value.updatedAt)
        && value.schemaVersion === VEHICLE_PROFILE_SCHEMA_VERSION;
}

function createId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `vehicle-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isValidDate(value) {
    return typeof value === "string" && !Number.isNaN(Date.parse(value));
}
