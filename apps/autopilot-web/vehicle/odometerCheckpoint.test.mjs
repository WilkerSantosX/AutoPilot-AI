import test from "node:test";
import assert from "node:assert/strict";
import {
    createOdometerCheckpoint, isOdometerCheckpoint,
    getLatestOdometerCheckpoint, prepareVehicleProfileMileage
} from "./odometerModel.js";
import {
    ODOMETER_STORAGE_KEY_PREFIX, loadOdometerCheckpoints, saveOdometerCheckpoint
} from "./odometerStorage.js";
import { createVehicleProfile, isVehicleProfile } from "./vehicleModel.js";
import { loadVehicleProfile, saveVehicleProfile } from "./vehicleStorage.js";
import { createCareEvent } from "./careModel.js";
import { loadCareEvents, saveCareEvent } from "./careStorage.js";

const now = "2026-10-04T12:00:00.000Z";
const input = { vehicleId: "vehicle-1", mileage: 45000, occurredAt: "2026-10-01T12:00:00.000Z" };
const checkpoint = createOdometerCheckpoint(input, { id: "reading-1", now }).checkpoint;

test("cria leitura factual com identidade, duas datas e zero válido", () => {
    assert.deepEqual(checkpoint, { id: "reading-1", ...input, recordedAt: now, schemaVersion: 1 });
    assert.equal(createOdometerCheckpoint({ ...input, mileage: 0 }).checkpoint.mileage, 0);
    assert.equal(isOdometerCheckpoint(createOdometerCheckpoint(input).checkpoint), true);
});

test("rejeita quilometragem negativa, fracionária, não numérica e insegura", () => {
    for (const mileage of [-1, 1.5, "45000", "", null, undefined, NaN, Infinity, 2 ** 53, false]) {
        assert.equal(createOdometerCheckpoint({ ...input, mileage }).ok, false);
        assert.equal(isOdometerCheckpoint({ ...checkpoint, mileage }), false);
    }
});

test("rejeita identidades, datas, versão e estruturas inválidas", () => {
    for (const value of [null, undefined, [], {},
        ...Object.entries({ id: ["", " ", null], vehicleId: ["", null, 1],
            occurredAt: [null, "invalid"], recordedAt: [undefined, "invalid"], schemaVersion: [undefined, 2]
        }).flatMap(([field, values]) => values.map(value => ({ ...checkpoint, [field]: value })))]) {
        assert.equal(isOdometerCheckpoint(value), false);
    }
    assert.equal(createOdometerCheckpoint(null).ok, false);
    assert.equal(createOdometerCheckpoint(input, { id: "", now }).ok, false);
    assert.equal(createOdometerCheckpoint(input, { now: "invalid" }).ok, false);
});

test("histórico ausente é vazio seguro e seleção não inventa leitura", () => {
    const storage = memoryStorage();
    assert.deepEqual(loadOdometerCheckpoints("vehicle-1", storage), { ok: true, checkpoints: [], error: null });
    assert.deepEqual(getLatestOdometerCheckpoint([], "vehicle-1"), { ok: true, checkpoint: null, error: null });
    assert.equal(storage.entries.size, 0);
    assert.equal(loadOdometerCheckpoints(null, storage).ok, false);
});

test("persiste múltiplas leituras e mantém isolamento por veículo", () => {
    const storage = memoryStorage();
    const second = { ...checkpoint, id: "reading-2", mileage: 46000 };
    const other = { ...checkpoint, vehicleId: "vehicle-2", mileage: 0 };
    for (const reading of [checkpoint, second, other]) assert.equal(saveOdometerCheckpoint(reading, storage).ok, true);
    assert.deepEqual(loadOdometerCheckpoints("vehicle-1", storage).checkpoints, [checkpoint, second]);
    assert.deepEqual(loadOdometerCheckpoints("vehicle-2", storage).checkpoints, [other]);
    assert.deepEqual(loadOdometerCheckpoints("vehicle-3", storage).checkpoints, []);
});

test("duplicidade e entradas inválidas preservam os bytes do histórico", () => {
    const storage = memoryStorage();
    assert.equal(saveOdometerCheckpoint(checkpoint, storage).ok, true);
    const snapshot = new Map(storage.entries);
    for (const reading of [checkpoint, null, { ...checkpoint, id: "bad", mileage: -1 }]) {
        assert.equal(saveOdometerCheckpoint(reading, storage).ok, false);
        assert.deepEqual(storage.entries, snapshot);
    }
});

test("corrupção, versão desconhecida, associação errada e duplicidade não são sobrescritas", () => {
    const storage = memoryStorage();
    const key = ODOMETER_STORAGE_KEY_PREFIX + "vehicle-1";
    const valid = { schemaVersion: 1, vehicleId: "vehicle-1", checkpoints: [checkpoint] };
    const invalid = ["", "{invalid", "null", "[]", ...[
        { ...valid, schemaVersion: 2 }, { ...valid, vehicleId: "vehicle-2" },
        { ...valid, checkpoints: {} }, { ...valid, checkpoints: [null] },
        { ...valid, checkpoints: [checkpoint, checkpoint] },
        { ...valid, checkpoints: [{ ...checkpoint, vehicleId: "vehicle-2" }] },
        { ...valid, checkpoints: [{ ...checkpoint, mileage: "0" }] }
    ].map(value => JSON.stringify(value))];
    for (const serialized of invalid) {
        storage.setItem(key, serialized);
        const loaded = loadOdometerCheckpoints("vehicle-1", storage);
        assert.equal(loaded.ok, false);
        assert.deepEqual(loaded.checkpoints, []);
        assert.equal(saveOdometerCheckpoint(checkpoint, storage).ok, false);
        assert.equal(storage.entries.get(key), serialized);
    }
});

test("falhas de leitura e quota são erros recuperáveis sem alterar dados", () => {
    const unreadable = { getItem() { throw new Error("blocked"); } };
    assert.equal(loadOdometerCheckpoints("vehicle-1", unreadable).ok, false);
    assert.equal(saveOdometerCheckpoint(checkpoint, unreadable).ok, false);
    const storage = memoryStorage();
    saveOdometerCheckpoint(checkpoint, storage);
    const snapshot = new Map(storage.entries);
    storage.setItem = () => { throw new Error("quota"); };
    assert.equal(saveOdometerCheckpoint({ ...checkpoint, id: "reading-2" }, storage).ok, false);
    assert.deepEqual(storage.entries, snapshot);
});

test("getter bloqueado do localStorage global não lança exceção", () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
        configurable: true, get() { throw new Error("blocked"); }
    });
    try {
        assert.equal(loadOdometerCheckpoints("vehicle-1").ok, false);
        assert.equal(saveOdometerCheckpoint(checkpoint).ok, false);
    } finally {
        if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
        else delete globalThis.localStorage;
    }
});

test("leitura retrospectiva registrada depois não substitui a mais recente", () => {
    const storage = memoryStorage();
    const older = { ...checkpoint, id: "older", mileage: 10000,
        occurredAt: "2026-08-01T12:00:00.000Z", recordedAt: "2026-10-05T12:00:00.000Z" };
    saveOdometerCheckpoint(checkpoint, storage);
    saveOdometerCheckpoint(older, storage);
    const history = loadOdometerCheckpoints("vehicle-1", storage).checkpoints;
    assert.deepEqual(history, [checkpoint, older]);
    assert.deepEqual(getLatestOdometerCheckpoint(history, "vehicle-1").checkpoint, checkpoint);
    assert.deepEqual(getLatestOdometerCheckpoint([...history].reverse(), "vehicle-1").checkpoint, checkpoint);
    assert.deepEqual(history, [checkpoint, older]);
});

test("empates temporais usam registro e depois ID com resultado independente da inserção", () => {
    const laterRecord = { ...checkpoint, id: "a", recordedAt: "2026-10-05T12:00:00.000Z" };
    const sameDates = { ...laterRecord, id: "z", mileage: 45500 };
    for (const history of [[checkpoint, laterRecord, sameDates], [sameDates, checkpoint, laterRecord]]) {
        assert.deepEqual(getLatestOdometerCheckpoint(history, "vehicle-1").checkpoint, sameDates);
    }
    assert.equal(getLatestOdometerCheckpoint([checkpoint], "vehicle-2").ok, false);
    assert.equal(getLatestOdometerCheckpoint([checkpoint, checkpoint], "vehicle-1").ok, false);
    assert.equal(getLatestOdometerCheckpoint(null, "vehicle-1").ok, false);
});

test("prepara e persiste atualização compatível sem destruir perfil, checkpoints ou Care Events", () => {
    const storage = memoryStorage();
    const profile = makeProfile(0);
    const care = createCareEvent({ vehicleId: profile.id, careItemId: "engine-oil",
        action: "performed", occurredAt: input.occurredAt }, { id: "care-1", now }).event;
    saveVehicleProfile(profile, storage);
    saveCareEvent(care, storage);
    const existing = new Map(storage.entries);
    saveOdometerCheckpoint(checkpoint, storage);
    for (const [key, value] of existing) assert.equal(storage.entries.get(key), value);
    const history = loadOdometerCheckpoints(profile.id, storage).checkpoints;
    const prepared = prepareVehicleProfileMileage(profile, history, { now: "2026-10-06T12:00:00.000Z" });
    assert.equal(prepared.ok, true);
    assert.equal(isVehicleProfile(prepared.profile), true);
    assert.deepEqual(prepared.profile, { ...profile, mileage: 45000, updatedAt: "2026-10-06T12:00:00.000Z" });
    assert.equal(profile.mileage, 0);
    assert.equal(loadVehicleProfile(storage).profile.mileage, 0);
    const historySnapshot = new Map(storage.entries);
    assert.equal(saveVehicleProfile(prepared.profile, storage).ok, true);
    assert.equal(loadVehicleProfile(storage).profile.mileage, 45000);
    assert.deepEqual(loadCareEvents(profile.id, storage).events, [care]);
    assert.deepEqual(loadOdometerCheckpoints(profile.id, storage).checkpoints, [checkpoint]);
    for (const [key, value] of historySnapshot) {
        if (key !== "autopilot.vehicle-profile.v1") assert.equal(storage.entries.get(key), value);
    }
});

test("preparação preserva ausência, zero e histórico retrospectivo sem reduzir mileage", () => {
    const profile = makeProfile(45000);
    assert.deepEqual(prepareVehicleProfileMileage(profile, [], { now }).profile, profile);
    const lower = { ...checkpoint, id: "older", mileage: 10000, occurredAt: "2026-08-01T12:00:00.000Z" };
    assert.equal(prepareVehicleProfileMileage(profile, [lower], { now }).ok, false);
    assert.equal(profile.mileage, 45000);
    assert.equal(prepareVehicleProfileMileage(profile, [lower, checkpoint], { now }).profile.mileage, 45000);
    assert.equal(prepareVehicleProfileMileage(makeProfile(0), [{ ...checkpoint, mileage: 0 }], { now }).profile.mileage, 0);
    assert.equal(prepareVehicleProfileMileage(null, [checkpoint], { now }).ok, false);
    assert.equal(prepareVehicleProfileMileage(profile, [{ ...checkpoint, vehicleId: "vehicle-2" }], { now }).ok, false);
    assert.equal(prepareVehicleProfileMileage(profile, [checkpoint], { now: "invalid" }).ok, false);
    assert.equal(prepareVehicleProfileMileage(profile, [checkpoint], { now: "2020-01-01" }).ok, false);
});

function makeProfile(mileage) {
    return createVehicleProfile({ manufacturer: "Toyota", model: "Corolla", year: 2020,
        engine: "2.0", fuelType: "Flex", mileage }, { id: "vehicle-1", now }).profile;
}

function memoryStorage() {
    const entries = new Map();
    return { entries, getItem(key) { return entries.get(key) ?? null; },
        setItem(key, value) { entries.set(key, value); } };
}
