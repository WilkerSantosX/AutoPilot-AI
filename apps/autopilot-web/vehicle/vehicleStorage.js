import { isVehicleProfile } from "./vehicleModel.js";

export const VEHICLE_PROFILE_STORAGE_KEY = "autopilot.vehicle-profile.v1";

export function saveVehicleProfile(profile, storage) {
    if (!isVehicleProfile(profile)) {
        return {
            ok: false,
            error: "O perfil do veículo é inválido e não pôde ser salvo."
        };
    }

    try {
        storage ??= globalThis.localStorage;
        storage.setItem(
            VEHICLE_PROFILE_STORAGE_KEY,
            JSON.stringify(profile)
        );

        return { ok: true, error: null };
    } catch {
        return {
            ok: false,
            error: "Não foi possível salvar o veículo neste dispositivo. Tente novamente."
        };
    }
}

export function loadVehicleProfile(storage) {
    let serializedProfile;

    try {
        storage ??= globalThis.localStorage;
        serializedProfile = storage.getItem(VEHICLE_PROFILE_STORAGE_KEY);
    } catch {
        return {
            ok: false,
            profile: null,
            error: "Não foi possível acessar o veículo salvo neste dispositivo."
        };
    }

    if (!serializedProfile) {
        return { ok: true, profile: null, error: null };
    }

    try {
        const profile = JSON.parse(serializedProfile);

        if (!isVehicleProfile(profile)) {
            return {
                ok: false,
                profile: null,
                error: "O veículo salvo possui dados inválidos e não pôde ser carregado."
            };
        }

        return { ok: true, profile, error: null };
    } catch {
        return {
            ok: false,
            profile: null,
            error: "O veículo salvo não pôde ser interpretado. Cadastre-o novamente."
        };
    }
}
