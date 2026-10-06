import test from "node:test";
import assert from "node:assert/strict";
import { loadCareOnboarding } from "./careOnboarding.js";
import { prepareCareLoop, saveCareLoop } from "./careLoop.js";
import { loadCareCockpit } from "./careCockpit.js";
import { createOdometerCheckpoint } from "./odometerModel.js";
import { saveOdometerCheckpoint } from "./odometerStorage.js";
import { createVehicleProfile } from "./vehicleModel.js";
import { saveVehicleProfile } from "./vehicleStorage.js";
import { renderCareLoopScreen, bindCareLoopScreenEvents } from "../screens/CareLoopScreen.js";

const now = "2026-10-05T12:00:00Z";
const base = { vehicleId: "car", careItemId: "engine-oil", occurredAt: "2026-09-01", mileage: 80000, nextDueMileage: 90000 };
function storage() { const values = new Map(); return { values, getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value) }; }
function prepare(store, input = base) { return prepareCareLoop(input, loadCareOnboarding(input.vehicleId, input.careItemId, store), { now }); }
function initial(store) { const plan = prepare(store).plan; assert.equal(saveCareLoop(plan, store).ok, true); return plan; }
function checkpoint(store, mileage = 90000, occurredAt = "2026-10-01") {
    assert.equal(saveOdometerCheckpoint(createOdometerCheckpoint({ vehicleId: "car", mileage, occurredAt }, { now }).checkpoint, store).ok, true);
}

test("novo marco/reference corretos preservam fatos antigos e recalculam pelo engine", () => {
    const store = storage(); const old = initial(store); checkpoint(store);
    assert.equal(loadCareOnboarding("car", "engine-oil", store).evaluation.state, "attention-needed");
    const plan = prepare(store, { ...base, occurredAt: "2026-10-02", mileage: 91000, nextDueMileage: 101000 }).plan;
    assert.notEqual(plan.event.id, old.event.id); assert.equal(plan.event.action, "performed");
    assert.equal(plan.reference.careEventId, plan.event.id); assert.equal(plan.reference.source, "user");
    const saved = saveCareLoop(plan, store);
    assert.equal(saved.ok, true); assert.equal(saved.evaluation.state, "up-to-date");
    assert.equal(saved.evaluation.evidence.careEvent.id, plan.event.id);
    assert.deepEqual(saved.events.find(event => event.id === old.event.id), old.event);
    assert.deepEqual(saved.references.find(ref => ref.careEventId === old.event.id), old.reference);
    assert.equal(saved.evaluation.evidence.reference.nextDueMileage, 101000);
    assert.equal(saved.evaluation.nextAction.type, "monitor");
});

test("sem nova referência não herda referência nem intervalo e permanece honesto", () => {
    const store = storage(); initial(store);
    const plan = prepare(store, { ...base, occurredAt: "2026-10-02", mileage: 90000, nextDueMileage: null }).plan;
    assert.equal(plan.reference, null);
    const result = saveCareLoop(plan, store);
    assert.equal(result.evaluation.state, "insufficient-information");
    assert.equal(result.evaluation.evidence.reference, null);
    assert.deepEqual(result.evaluation.nextAction, { type: "provide-information", information: "care-reference" });
    assert.equal(result.references.length, 1);
});

test("checkpoint factual usa data do cuidado, zero válido e mileage opcional", () => {
    const store = storage(); const plan = prepare(store, { ...base, mileage: 0, nextDueMileage: 100 }).plan;
    assert.equal(plan.checkpoint.mileage, 0); assert.equal(plan.checkpoint.occurredAt, base.occurredAt);
    assert.equal(plan.checkpoint.recordedAt, now); assert.equal(saveCareLoop(plan, store).ok, true);
    const unknown = prepare(store, { ...base, occurredAt: "2026-10-02", mileage: null, nextDueMileage: null }).plan;
    assert.equal(unknown.checkpoint, null); assert.equal(saveCareLoop(unknown, store).ok, true);
});

test("retrospectivo torna-se marco quando aplicável sem reduzir última leitura", () => {
    const store = storage(); initial(store); checkpoint(store, 95000);
    const plan = prepare(store, { ...base, occurredAt: "2026-09-20", mileage: 90000, nextDueMileage: 100000 }).plan;
    const result = saveCareLoop(plan, store);
    assert.equal(result.ok, true); assert.equal(result.evaluation.evidence.careEvent.id, plan.event.id);
    assert.equal(result.evaluation.evidence.odometerCheckpoint.mileage, 95000);
    assert.equal(result.evaluation.evidence.calculation.currentMileage, 95000);
    assert.equal(result.checkpoints.length, 3);
});

test("evento anterior ao marco relevante fica histórico e referência mais recente permanece aplicável", () => {
    const store = storage(); const old = initial(store);
    const plan = prepare(store, { ...base, occurredAt: "2026-08-01", mileage: 70000, nextDueMileage: 80000 }).plan;
    const result = saveCareLoop(plan, store);
    assert.equal(result.ok, true); assert.equal(result.events.length, 2);
    assert.equal(result.evaluation.evidence.careEvent.id, old.event.id);
    assert.deepEqual(result.evaluation.evidence.reference, old.reference);
});

test("referência retrospectiva N<=M é rejeitada na preparação, sem plano de retry inválido", () => {
    const store = storage(); initial(store);
    const before = [...store.values];
    for (const nextDueMileage of [70000, 69999]) {
        const result = prepare(store, { ...base, occurredAt: "2026-08-01", mileage: 70000, nextDueMileage });
        assert.equal(result.ok, false);
        assert.equal(result.plan, undefined);
    }
    assert.deepEqual([...store.values], before);
});

test("reutiliza checkpoint equivalente sem duplicação e preserva perfil/veículos", () => {
    const store = storage(); checkpoint(store, 80000, base.occurredAt);
    store.setItem("autopilot.vehicle-profile.v1", "bytes do perfil");
    const before = loadCareOnboarding("car", "engine-oil", store).checkpoints[0];
    const plan = prepare(store).plan; assert.equal(plan.checkpoint.id, before.id);
    assert.equal(saveCareLoop(plan, store).checkpoints.length, 1);
    assert.equal(store.getItem("autopilot.vehicle-profile.v1"), "bytes do perfil");
    assert.equal(loadCareOnboarding("other", "engine-oil", store).events.length, 0);
    assert.equal(loadCareOnboarding("car", "cooling", store).evaluation.evidence.careEvent, null);
});

test("validação rejeita futuro, números inválidos, redução e N<=M antes de escrever", () => {
    const store = storage(); checkpoint(store); const before = [...store.values];
    for (const input of [{ ...base, occurredAt: "2027-01-01" }, { ...base, occurredAt: "invalid" },
        { ...base, mileage: -1 }, { ...base, mileage: 1.5 }, { ...base, nextDueMileage: 80000 },
        { ...base, occurredAt: "2026-10-03", mileage: 89999 }, { ...base, mileage: null },
        { ...base, mileage: Number.MAX_SAFE_INTEGER + 1 }]) assert.equal(prepare(store, input).ok, false);
    assert.deepEqual([...store.values], before);
});

test("falhas parciais em checkpoint/referência permitem retry idempotente sem falso sucesso", () => {
    for (const failingPrefix of ["autopilot.odometer-checkpoints.v1:", "autopilot.care-references.v1:"]) {
        const store = storage(); const write = store.setItem;
        const plan = prepare(store).plan;
        store.setItem = (key, value) => { if (key.startsWith(failingPrefix)) throw Error("quota"); write(key, value); };
        assert.equal(saveCareLoop(plan, store).ok, false);
        assert.equal(loadCareOnboarding("car", "engine-oil", store).events.length, 1);
        store.setItem = write;
        assert.equal(saveCareLoop(plan, store).ok, true);
        assert.equal(saveCareLoop(plan, store).ok, true);
        const result = loadCareOnboarding("car", "engine-oil", store);
        assert.equal(result.events.length, 1); assert.equal(result.checkpoints.length, 1); assert.equal(result.references.length, 1);
    }
});

test("corrupção falha sem sobrescrita e reload preserva novo estado/schema", () => {
    const store = storage(); initial(store);
    const copy = storage(); for (const [key, value] of store.values) copy.setItem(key, value);
    assert.deepEqual(loadCareCockpit("car", copy), loadCareCockpit("car", store));
    for (const prefix of ["autopilot.vehicle-care.v1:", "autopilot.odometer-checkpoints.v1:", "autopilot.care-references.v1:"]) {
        const bad = storage(); const plan = prepare(bad).plan; bad.setItem(prefix + "car", "{bad");
        const before = [...bad.values]; assert.equal(saveCareLoop(plan, bad).ok, false); assert.deepEqual([...bad.values], before);
    }
    assert.equal(saveCareLoop(null, store).ok, false);
    const incoherent = prepare(storage()).plan;
    assert.equal(saveCareLoop({ ...incoherent, checkpoint: null }, store).ok, false);
});

test("formulário preserva Care Item contextual, escapa perfil e impede reenvio concluído", t => {
    const store = storage();
    const profile = createVehicleProfile({ manufacturer: "Toyota", model: "Corolla", year: 2020, engine: "2.0", fuelType: "Flex", mileage: 80000 }).profile;
    assert.equal(saveVehicleProfile(profile, store).ok, true);
    const html = renderCareLoopScreen({ ...profile, model: '<img onerror="x">' }, "cooling");
    assert.match(html, /Registrar Arrefecimento/); assert.match(html, /&lt;img/); assert.doesNotMatch(html, /<select/);
    const savedGlobals = Object.fromEntries(["document", "localStorage", "FormData"].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
    t.after(() => { for (const [key, descriptor] of Object.entries(savedGlobals)) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } });
    const nodes = new Map(["care-loop-form", "loop-submit", "loop-message", "loop-mileage", "loop-reference", "loop-date"].map(id => [id,
        { value: "80000", disabled: false, handlers: {}, addEventListener(type, handler) { this.handlers[type] = handler; }, focus() {} }]));
    Object.defineProperty(globalThis, "document", { configurable: true, value: { getElementById: id => nodes.get(id) } });
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: store });
    Object.defineProperty(globalThis, "FormData", { configurable: true, value: class { get(key) { return { occurredAt: "2026-09-01", mileage: "80000", nextDueMileage: "90000" }[key]; } } });
    let completions = 0;
    bindCareLoopScreenEvents(profile, "cooling", { onSaved: () => completions++ });
    const submit = nodes.get("care-loop-form").handlers.submit;
    const replacement = createVehicleProfile({ ...profile, mileage: 80000 }).profile;
    saveVehicleProfile(replacement, store);
    submit({ preventDefault() {} });
    assert.equal(completions, 0);
    assert.match(nodes.get("loop-message").textContent, /veículo ativo mudou/);
    saveVehicleProfile(profile, store);
    const write = store.setItem;
    store.setItem = (key, value) => { if (key.startsWith("autopilot.odometer-checkpoints.v1:")) throw Error("quota"); write(key, value); };
    submit({ preventDefault() {} });
    assert.equal(completions, 0);
    assert.match(nodes.get("loop-message").textContent, /não serão duplicados/);
    assert.equal(nodes.get("loop-date").readOnly, true);
    store.setItem = write;
    submit({ preventDefault() {} }); submit({ preventDefault() {} });
    assert.equal(completions, 1); assert.equal(loadCareOnboarding(profile.id, "cooling", store).events.length, 1);
    assert.equal(loadCareOnboarding(profile.id, "engine-oil", store).evaluation.evidence.careEvent, null);
});
