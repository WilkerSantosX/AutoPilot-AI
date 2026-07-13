import test from "node:test";
import assert from "node:assert/strict";

import {
    createVehicleProfile,
    isVehicleProfile
} from "./vehicleModel.js";
import {
    normalizeVehicleInput,
    validateVehicleInput
} from "./vehicleValidator.js";
import {
    loadVehicleProfile,
    saveVehicleProfile,
    VEHICLE_PROFILE_STORAGE_KEY
} from "./vehicleStorage.js";

const validInput = {
    manufacturer: "  Toyota ",
    model: " Corolla  ",
    year: "2020",
    engine: " 2.0 ",
    fuelType: " Flex ",
    mileage: "45000",
    nickname: "  "
};

test("normaliza textos, números e apelido vazio", () => {
    assert.deepEqual(normalizeVehicleInput(validInput), {
        manufacturer: "Toyota",
        model: "Corolla",
        year: 2020,
        engine: "2.0",
        fuelType: "Flex",
        mileage: 45000,
        nickname: null
    });
});

test("valida campos obrigatórios e limites numéricos", () => {
    const result = validateVehicleInput({
        manufacturer: " ",
        model: "",
        year: 1885,
        engine: "",
        fuelType: "",
        mileage: -1
    }, 2026);

    assert.equal(result.isValid, false);
    assert.deepEqual(Object.keys(result.errors).sort(), [
        "engine",
        "fuelType",
        "manufacturer",
        "mileage",
        "model",
        "year"
    ]);

    assert.equal(validateVehicleInput({ ...validInput, year: 2028 }, 2026).isValid, false);
    assert.equal(validateVehicleInput({ ...validInput, year: 2027 }, 2026).isValid, true);
    assert.equal(validateVehicleInput({ ...validInput, mileage: 1.5 }, 2026).isValid, false);
    assert.equal(validateVehicleInput({ ...validInput, mileage: 0 }, 2026).isValid, true);
});

test("cria o modelo obrigatório com schemaVersion 1", () => {
    const result = createVehicleProfile(validInput, {
        id: "vehicle-1",
        now: "2026-07-13T12:00:00.000Z",
        currentYear: 2026
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.profile, {
        id: "vehicle-1",
        manufacturer: "Toyota",
        model: "Corolla",
        year: 2020,
        engine: "2.0",
        fuelType: "Flex",
        mileage: 45000,
        nickname: null,
        createdAt: "2026-07-13T12:00:00.000Z",
        updatedAt: "2026-07-13T12:00:00.000Z",
        schemaVersion: 1
    });
    assert.equal(isVehicleProfile(result.profile, 2026), true);
});

test("persiste e recupera um único perfil", () => {
    const storage = createMemoryStorage();
    const profile = createVehicleProfile(validInput, {
        id: "vehicle-1",
        now: "2026-07-13T12:00:00.000Z",
        currentYear: 2026
    }).profile;

    assert.equal(saveVehicleProfile(profile, storage).ok, true);
    assert.deepEqual(loadVehicleProfile(storage).profile, profile);
    assert.equal(storage.entries.size, 1);
    assert.equal(storage.entries.has(VEHICLE_PROFILE_STORAGE_KEY), true);

    const replacement = { ...profile, id: "vehicle-2", nickname: "Novo" };
    assert.equal(saveVehicleProfile(replacement, storage).ok, true);
    assert.equal(loadVehicleProfile(storage).profile.id, "vehicle-2");
    assert.equal(storage.entries.size, 1);
});

test("recuperação não quebra com ausência, JSON inválido ou falha de leitura", () => {
    const emptyStorage = createMemoryStorage();
    assert.deepEqual(loadVehicleProfile(emptyStorage), {
        ok: true,
        profile: null,
        error: null
    });

    emptyStorage.setItem(VEHICLE_PROFILE_STORAGE_KEY, "{invalid");
    assert.equal(loadVehicleProfile(emptyStorage).ok, false);

    emptyStorage.setItem(
        VEHICLE_PROFILE_STORAGE_KEY,
        JSON.stringify({
            ...createVehicleProfile(validInput, {
                id: "vehicle-1",
                now: "2026-07-13T12:00:00.000Z",
                currentYear: 2026
            }).profile,
            mileage: "45000"
        })
    );
    assert.equal(loadVehicleProfile(emptyStorage).ok, false);

    const failingStorage = {
        getItem() { throw new Error("blocked"); }
    };
    assert.equal(loadVehicleProfile(failingStorage).ok, false);
});

test("trata falha de escrita sem lançar erro", () => {
    const profile = createVehicleProfile(validInput, {
        id: "vehicle-1",
        now: "2026-07-13T12:00:00.000Z",
        currentYear: 2026
    }).profile;
    const failingStorage = {
        setItem() { throw new Error("quota"); }
    };

    assert.equal(saveVehicleProfile(profile, failingStorage).ok, false);
});

function createMemoryStorage() {
    const entries = new Map();

    return {
        entries,
        getItem(key) {
            return entries.has(key) ? entries.get(key) : null;
        },
        setItem(key, value) {
            entries.set(key, value);
        }
    };
}
