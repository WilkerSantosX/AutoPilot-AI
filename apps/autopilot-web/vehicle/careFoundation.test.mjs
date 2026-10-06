import test from "node:test";
import assert from "node:assert/strict";
import { CARE_ITEMS, createCareEvent, isCareEvent, isCareItemId } from "./careModel.js";
import { CARE_STORAGE_KEY_PREFIX, loadCareEvents, saveCareEvent } from "./careStorage.js";
import { createVehicleProfile } from "./vehicleModel.js";
import { loadVehicleProfile, saveVehicleProfile } from "./vehicleStorage.js";

const input = {
    vehicleId: "vehicle-1",
    careItemId: "engine-oil",
    action: "performed",
    occurredAt: "2026-09-20T12:00:00.000Z"
};
const options = { id: "event-1", now: "2026-10-04T12:00:00.000Z" };
const event = createCareEvent(input, options).event;

test("identifica somente as três famílias iniciais", () => {
    assert.deepEqual(CARE_ITEMS.map(item => item.id), ["engine-oil", "cooling", "basic-review"]);
    for (const item of CARE_ITEMS) {
        assert.equal(isCareItemId(item.id), true);
        assert.equal(isCareEvent({ ...event, careItemId: item.id }), true);
    }
    for (const value of [null, "brakes", "", {}, " engine-oil "]) {
        assert.equal(isCareItemId(value), false);
    }
});

test("cria fato com datas distintas e mantém quilometragem desconhecida", () => {
    assert.deepEqual(event, {
        id: "event-1", ...input, recordedAt: options.now, mileage: null, schemaVersion: 1
    });
    assert.equal(createCareEvent({ ...input, mileage: 0 }, options).event.mileage, 0);
    assert.equal(createCareEvent({ ...input, mileage: 45000 }, options).event.mileage, 45000);
    assert.equal(isCareEvent(createCareEvent(input).event), true);
});

test("rejeita estruturas inválidas sem fabricar fatos", () => {
    const invalid = [null, undefined, [], {},
        ...Object.entries({
            id: ["", " ", 1], vehicleId: ["", null, 1], careItemId: ["brakes", null],
            action: ["due", "", null], occurredAt: [null, "invalid"],
            recordedAt: [null, "invalid"], mileage: [-1, 1.5, "45000", undefined, NaN, Infinity, 2 ** 53],
            schemaVersion: [undefined, 2]
        }).flatMap(([field, values]) => values.map(value => ({ ...event, [field]: value })))
    ];
    for (const value of invalid) assert.equal(isCareEvent(value), false);
    for (const value of [null, {}, { ...input, action: "due" }, { ...input, mileage: "0" }]) {
        assert.equal(createCareEvent(value, options).ok, false);
    }
    assert.equal(createCareEvent(input, { ...options, id: "" }).ok, false);
    assert.equal(createCareEvent(input, { ...options, now: "invalid" }).ok, false);
});

test("ausência de histórico retorna lista vazia segura", () => {
    const storage = memoryStorage();
    assert.deepEqual(loadCareEvents("vehicle-1", storage), { ok: true, events: [], error: null });
    assert.equal(storage.entries.size, 0);
    assert.equal(loadCareEvents("", storage).ok, false);
});

test("salva e recupera eventos em ordem de registro isolados por veículo", () => {
    const storage = memoryStorage();
    const second = { ...event, id: "event-2", careItemId: "cooling", mileage: 0 };
    const other = { ...event, vehicleId: "vehicle-2", mileage: 42000 };
    for (const fact of [event, second, other]) assert.equal(saveCareEvent(fact, storage).ok, true);
    assert.deepEqual(loadCareEvents("vehicle-1", storage).events, [event, second]);
    assert.deepEqual(loadCareEvents("vehicle-2", storage).events, [other]);
    assert.deepEqual(loadCareEvents("vehicle-3", storage).events, []);
    const snapshot = storage.entries.get(CARE_STORAGE_KEY_PREFIX + "vehicle-1");
    assert.equal(saveCareEvent(event, storage).ok, false);
    assert.equal(saveCareEvent({ ...event, id: "bad", mileage: -1 }, storage).ok, false);
    assert.equal(storage.entries.get(CARE_STORAGE_KEY_PREFIX + "vehicle-1"), snapshot);
});

test("histórico inválido ou de outra versão não é sobrescrito", () => {
    const storage = memoryStorage();
    const key = CARE_STORAGE_KEY_PREFIX + "vehicle-1";
    const valid = { schemaVersion: 1, vehicleId: "vehicle-1", events: [event] };
    const invalid = ["", "{invalid", "null", "[]",
        ...[
            { ...valid, schemaVersion: 2 }, { ...valid, vehicleId: "vehicle-2" },
            { ...valid, events: {} }, { ...valid, events: [null] },
            { ...valid, events: [{ ...event, vehicleId: "vehicle-2" }] },
            { ...valid, events: [{ ...event, mileage: "0" }] },
            { ...valid, events: [event, event] }
        ].map(value => JSON.stringify(value))
    ];
    for (const serialized of invalid) {
        storage.setItem(key, serialized);
        const loaded = loadCareEvents("vehicle-1", storage);
        assert.equal(loaded.ok, false);
        assert.deepEqual(loaded.events, []);
        assert.equal(saveCareEvent(event, storage).ok, false);
        assert.equal(storage.entries.get(key), serialized);
    }
});

test("falhas de acesso e quota retornam erro sem lançar exceção", () => {
    const unreadable = { getItem() { throw new Error("blocked"); } };
    assert.equal(loadCareEvents("vehicle-1", unreadable).ok, false);
    assert.equal(saveCareEvent(event, unreadable).ok, false);
    const unwritable = { getItem() { return null; }, setItem() { throw new Error("quota"); } };
    assert.equal(saveCareEvent(event, unwritable).ok, false);
});

test("acesso bloqueado ao localStorage global retorna erro recuperável", () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        get() { throw new Error("blocked"); }
    });
    try {
        assert.deepEqual(loadCareEvents("vehicle-1").events, []);
        assert.equal(loadCareEvents("vehicle-1").ok, false);
        assert.equal(saveCareEvent(event).ok, false);
    } finally {
        if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
        else delete globalThis.localStorage;
    }
});

test("persistência de cuidados preserva contrato e bytes do VehicleProfile", () => {
    const storage = memoryStorage();
    const profile = createVehicleProfile({
        manufacturer: "Toyota", model: "Corolla", year: 2020,
        engine: "2.0", fuelType: "Flex", mileage: 45000
    }, { id: "vehicle-1", now: options.now }).profile;
    assert.equal(saveVehicleProfile(profile, storage).ok, true);
    const before = new Map(storage.entries);
    assert.equal(saveCareEvent(event, storage).ok, true);
    for (const [key, value] of before) assert.equal(storage.entries.get(key), value);
    assert.deepEqual(loadVehicleProfile(storage).profile, profile);
    assert.equal(saveVehicleProfile({ ...profile, id: "vehicle-2" }, storage).ok, true);
    assert.deepEqual(loadCareEvents("vehicle-1", storage).events, [event]);
    assert.deepEqual(loadCareEvents("vehicle-2", storage).events, []);
});

function memoryStorage() {
    const entries = new Map();
    return {
        entries,
        getItem(key) { return entries.get(key) ?? null; },
        setItem(key, value) { entries.set(key, value); }
    };
}
