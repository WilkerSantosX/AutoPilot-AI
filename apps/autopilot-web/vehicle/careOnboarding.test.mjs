import test from "node:test";
import assert from "node:assert/strict";
import { createCareEvent } from "./careModel.js";
import { loadCareEvents, saveCareEvent } from "./careStorage.js";
import { createOdometerCheckpoint } from "./odometerModel.js";
import { loadOdometerCheckpoints, saveOdometerCheckpoint } from "./odometerStorage.js";
import { CARE_REFERENCE_STORAGE_KEY_PREFIX, loadCareReferences, saveCareReference } from "./careReferenceStorage.js";
import { loadCareOnboarding, prepareCareOnboarding, saveCareOnboarding } from "./careOnboarding.js";
import { createVehicleProfile } from "./vehicleModel.js";
import { loadVehicleProfile, saveVehicleProfile } from "./vehicleStorage.js";
import { renderCareOnboardingScreen } from "../screens/CareOnboardingScreen.js";
import { renderQuestionScreen } from "../screens/questionScreen.js";

const now = "2026-10-05T12:00:00.000Z";
const event = createCareEvent({ vehicleId: "vehicle-1", careItemId: "engine-oil", action: "performed",
    occurredAt: "2026-09-01", mileage: 80000 }, { id: "care-1", now }).event;
const reference = { vehicleId: event.vehicleId, careItemId: event.careItemId,
    careEventId: event.id, nextDueMileage: 90000, source: "user" };
const known = { vehicleId: event.vehicleId, careItemId: event.careItemId, knowledge: "known",
    occurredAt: event.occurredAt, mileage: event.mileage, nextDueMileage: 90000, currentMileage: 89000 };
function memoryStorage() {
    const entries = new Map();
    return { entries, getItem(key) { return entries.get(key) ?? null; }, setItem(key, value) { entries.set(key, value); } };
}
function context(storage, careItemId = event.careItemId) { return loadCareOnboarding(event.vehicleId, careItemId, storage); }

test("referência user persiste, recupera e não duplica nem altera referência do mesmo marco", () => {
    const storage = memoryStorage();
    assert.deepEqual(loadCareReferences(event.vehicleId, storage), { ok: true, references: [], error: null });
    assert.equal(saveCareReference(reference, storage).ok, false);
    saveCareEvent(event, storage);
    assert.equal(saveCareReference(reference, storage).ok, true);
    assert.deepEqual(loadCareReferences(event.vehicleId, storage).references, [reference]);
    const before = new Map(storage.entries);
    assert.equal(saveCareReference(reference, storage).ok, true);
    assert.equal(saveCareReference({ ...reference, nextDueMileage: 91000 }, storage).ok, false);
    assert.deepEqual(storage.entries, before);
});

test("isola referência por veículo, item e marco sem promover referência antiga a novo ciclo", () => {
    const storage = memoryStorage();
    const secondItem = { ...event, id: "care-2", careItemId: "cooling" };
    const other = { ...event, vehicleId: "vehicle-2" };
    for (const milestone of [event, secondItem, other]) {
        saveCareEvent(milestone, storage);
        assert.equal(saveCareReference({ ...reference, vehicleId: milestone.vehicleId,
            careItemId: milestone.careItemId, careEventId: milestone.id }, storage).ok, true);
    }
    assert.equal(loadCareReferences("vehicle-1", storage).references.length, 2);
    assert.deepEqual(loadCareReferences("vehicle-2", storage).references, [{ ...reference, vehicleId: "vehicle-2" }]);
    assert.deepEqual(loadCareReferences("vehicle-3", storage).references, []);
    assert.equal(context(storage, "basic-review").reference, null);
    saveCareEvent({ ...event, id: "new", occurredAt: "2026-10-01", mileage: 90000 }, storage);
    assert.equal(context(storage).reference, null);
    assert.equal(context(storage).evaluation.state, "insufficient-information");
});

test("rejeita referência inválida, vínculo errado e N<=M preservando bytes", () => {
    const storage = memoryStorage();
    saveCareEvent(event, storage);
    const before = new Map(storage.entries);
    for (const invalid of [null, {}, { ...reference, source: "manufacturer" },
        { ...reference, careItemId: "cooling" }, { ...reference, careEventId: "missing" },
        { ...reference, vehicleId: "vehicle-2" }, ...[80000, 79999, -1, 1.5, "90000", 2 ** 53]
            .map(nextDueMileage => ({ ...reference, nextDueMileage }))]) {
        assert.equal(saveCareReference(invalid, storage).ok, false);
    }
    assert.deepEqual(storage.entries, before);
});

test("corrupção, versões, duplicidade e vínculos inválidos não são sobrescritos", () => {
    const storage = memoryStorage();
    saveCareEvent(event, storage);
    const key = CARE_REFERENCE_STORAGE_KEY_PREFIX + event.vehicleId;
    const envelope = { schemaVersion: 1, vehicleId: event.vehicleId, references: [reference] };
    for (const raw of ["{bad", "null", ...[
        { ...envelope, schemaVersion: 2 }, { ...envelope, vehicleId: "wrong" },
        { ...envelope, references: [reference, reference] }, { ...envelope, references: [null] },
        { ...envelope, references: [{ ...reference, nextDueMileage: 80000 }] },
        { ...envelope, references: [{ ...reference, careEventId: "missing" }] }
    ].map(value => JSON.stringify(value))]) {
        storage.setItem(key, raw);
        assert.equal(loadCareReferences(event.vehicleId, storage).ok, false);
        assert.equal(saveCareReference(reference, storage).ok, false);
        assert.equal(storage.entries.get(key), raw);
        assert.equal(context(storage).ok, false);
    }
});

test("acesso bloqueado e quota retornam erro explícito", () => {
    const blocked = { getItem() { throw new Error("blocked"); } };
    assert.equal(loadCareReferences(event.vehicleId, blocked).ok, false);
    assert.equal(saveCareReference(reference, blocked).ok, false);
    const storage = memoryStorage();
    saveCareEvent(event, storage);
    storage.setItem = () => { throw new Error("quota"); };
    assert.equal(saveCareReference(reference, storage).ok, false);
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("blocked"); } });
    try { assert.equal(loadCareReferences(event.vehicleId).ok, false); }
    finally {
        if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
        else delete globalThis.localStorage;
    }
});

test("não sei nos três itens permite continuar sem escrever fatos ou preferências fictícias", () => {
    const storage = memoryStorage();
    for (const careItemId of ["engine-oil", "cooling", "basic-review"]) {
        const prepared = prepareCareOnboarding({ ...known, careItemId, knowledge: "unknown" }, context(storage, careItemId), { now });
        assert.equal(prepared.ok, true);
        const result = saveCareOnboarding(prepared.plan, storage);
        assert.equal(result.ok, true);
        assert.equal(result.evaluation.state, "insufficient-information");
    }
    assert.equal(storage.entries.size, 0);
});

test("histórico conhecido e referência opcional não fabricam leitura atual", () => {
    const storage = memoryStorage();
    const prepared = prepareCareOnboarding({ ...known, mileage: null, nextDueMileage: null, currentMileage: null }, context(storage), { now });
    assert.equal(prepared.ok, true);
    const result = saveCareOnboarding(prepared.plan, storage);
    assert.equal(result.ok, true);
    assert.equal(result.evaluation.state, "insufficient-information");
    assert.equal(loadCareEvents(event.vehicleId, storage).events[0].mileage, null);
    assert.deepEqual(loadOdometerCheckpoints(event.vehicleId, storage).checkpoints, []);
    assert.deepEqual(loadCareReferences(event.vehicleId, storage).references, []);
});

test("referência sem leitura atual permanece insuficiente, com histórico suficiente ela alimenta engine", () => {
    const storage = memoryStorage();
    const prepared = prepareCareOnboarding({ ...known, currentMileage: null }, context(storage), { now });
    saveCareOnboarding(prepared.plan, storage);
    assert.equal(context(storage).evaluation.state, "insufficient-information");
    assert.deepEqual(context(storage).evaluation.nextAction, { type: "update-mileage" });
    const reading = createOdometerCheckpoint({ vehicleId: event.vehicleId, mileage: 89000, occurredAt: now }, { now }).checkpoint;
    saveOdometerCheckpoint(reading, storage);
    const restored = context(storage);
    assert.equal(restored.evaluation.state, "due-soon");
    const reuse = prepareCareOnboarding({ ...known, careEventId: prepared.plan.event.id, currentMileage: null }, restored, { now });
    assert.equal(saveCareOnboarding(reuse.plan, storage).ok, true);
    assert.equal(loadCareEvents(event.vehicleId, storage).events.length, 1);
    assert.equal(loadOdometerCheckpoints(event.vehicleId, storage).checkpoints.length, 1);
});

test("dados suficientes sobrevivem a recarregamento preservando perfil e schemas", () => {
    const storage = memoryStorage();
    const profile = createVehicleProfile({ manufacturer: "Toyota", model: "Corolla", year: 2020,
        engine: "2.0", fuelType: "Flex", mileage: 80000 }, { id: event.vehicleId, now }).profile;
    saveVehicleProfile(profile, storage);
    const beforeProfile = storage.entries.get("autopilot.vehicle-profile.v1");
    const prepared = prepareCareOnboarding(known, context(storage), { now });
    assert.equal(prepared.ok, true);
    assert.equal(saveCareOnboarding(prepared.plan, storage).evaluation.state, "due-soon");
    const restoredStorage = memoryStorage();
    for (const [key, value] of storage.entries) restoredStorage.setItem(key, value);
    const restored = context(restoredStorage);
    assert.equal(restored.evaluation.state, "due-soon");
    assert.equal(restored.reference.source, "user");
    assert.equal(restored.reference.careEventId, prepared.plan.event.id);
    assert.deepEqual(loadVehicleProfile(restoredStorage).profile, profile);
    assert.equal(restoredStorage.entries.get("autopilot.vehicle-profile.v1"), beforeProfile);
    assert.equal(restored.events[0].schemaVersion, 1);
    assert.equal(restored.checkpoints[0].schemaVersion, 1);
});

test("plano inválido é recusado antes de escrever; zero é leitura factual válida", () => {
    const storage = memoryStorage();
    for (const changes of [ { occurredAt: "" }, { mileage: -1 }, { nextDueMileage: 80000 },
        { nextDueMileage: "90000" }, { currentMileage: -1 }, { currentMileage: 70000 },
        { mileage: null }, { careEventId: "missing" }, { knowledge: "invented" } ]) {
        assert.equal(prepareCareOnboarding({ ...known, ...changes }, context(storage), { now }).ok, false);
    }
    assert.equal(storage.entries.size, 0);
    const prepared = prepareCareOnboarding({ ...known, mileage: 0, nextDueMileage: 10000, currentMileage: 0 }, context(storage), { now });
    assert.equal(saveCareOnboarding(prepared.plan, storage).evaluation.state, "up-to-date");
    assert.equal(context(storage).checkpoints[0].mileage, 0);
});

test("retry após quota parcial preserva dados e não duplica evento/checkpoint", () => {
    const storage = memoryStorage();
    const prepared = prepareCareOnboarding(known, context(storage), { now });
    const write = storage.setItem;
    storage.setItem = (key, value) => {
        if (key.startsWith(CARE_REFERENCE_STORAGE_KEY_PREFIX)) throw new Error("quota");
        write(key, value);
    };
    assert.equal(saveCareOnboarding(prepared.plan, storage).ok, false);
    assert.equal(context(storage).events.length, 1);
    assert.equal(context(storage).checkpoints.length, 1);
    storage.setItem = write;
    assert.equal(saveCareOnboarding(prepared.plan, storage).evaluation.state, "due-soon");
    assert.equal(saveCareOnboarding(prepared.plan, storage).ok, true);
    assert.equal(context(storage).events.length, 1);
    assert.equal(context(storage).checkpoints.length, 1);
    assert.equal(loadCareReferences(event.vehicleId, storage).references.length, 1);
});

test("não sei preserva fatos existentes e não troca o veículo do plano", () => {
    const storage = memoryStorage();
    saveCareEvent(event, storage);
    const before = new Map(storage.entries);
    const prepared = prepareCareOnboarding({ ...known, knowledge: "unknown" }, context(storage), { now });
    saveCareOnboarding(prepared.plan, storage);
    assert.deepEqual(storage.entries, before);
    assert.equal(prepareCareOnboarding({ ...known, vehicleId: "vehicle-2" }, context(storage), { now }).ok, false);
    assert.equal(saveCareOnboarding({ vehicleId: event.vehicleId, careItemId: event.careItemId,
        event: { ...event, vehicleId: "vehicle-2" }, checkpoint: null, reference: null }, storage).ok, false);
    assert.deepEqual(storage.entries, before);
});

test("conflito com checkpoint ou referência salvo é recusado antes de qualquer escrita nova", () => {
    const storage = memoryStorage();
    const prepared = prepareCareOnboarding(known, context(storage), { now });
    saveCareOnboarding(prepared.plan, storage);
    const before = new Map(storage.entries);
    const newEvent = { ...prepared.plan.event, id: "new-event" };
    assert.equal(saveCareOnboarding({ ...prepared.plan, event: newEvent, reference: null,
        checkpoint: { ...prepared.plan.checkpoint, mileage: 90000 } }, storage).ok, false);
    assert.equal(saveCareOnboarding({ ...prepared.plan,
        reference: { ...prepared.plan.reference, nextDueMileage: 91000 } }, storage).ok, false);
    assert.deepEqual(storage.entries, before);
});

test("entrada contextual e tela escapam perfil sem promessa mecânica", () => {
    const profile = { manufacturer: '<img src=x onerror="x">', model: "Teste &", year: 2020 };
    const html = renderCareOnboardingScreen(profile);
    assert.doesNotMatch(html, /<img/);
    assert.match(html, /&lt;img/);
    assert.match(html, /não avaliamos a condição mecânica/);
    assert.match(renderQuestionScreen(profile), /screen=care-onboarding/);
});
