import test from "node:test";
import assert from "node:assert/strict";
import { loadCareCockpit } from "./careCockpit.js";
import { loadCareOnboarding, prepareCareOnboarding, saveCareOnboarding } from "./careOnboarding.js";
import { renderCareCockpitContent, describeNextAction } from "../screens/careCockpitContent.js";
import { saveOdometerCheckpoint } from "./odometerStorage.js";
import { createOdometerCheckpoint } from "./odometerModel.js";
import { CARE_ITEMS } from "./careModel.js";

function storage() {
    const values = new Map();
    return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
function add(store, careItemId, nextDueMileage, mileage = 80000, vehicleId = "car") {
    const context = loadCareOnboarding(vehicleId, careItemId, store);
    const result = prepareCareOnboarding({ vehicleId, careItemId, knowledge: "known",
        occurredAt: "2026-09-01", mileage, nextDueMileage }, context, { now: "2026-10-05T12:00:00Z" });
    assert.equal(result.ok, true);
    assert.equal(saveCareOnboarding(result.plan, store).ok, true);
}
function reading(store, mileage) {
    const checkpoint = createOdometerCheckpoint({ vehicleId: "car", mileage, occurredAt: "2026-10-05T13:00:00Z" }).checkpoint;
    assert.equal(saveOdometerCheckpoint(checkpoint, store).ok, true);
}

test("consolida três itens sem fatos com ação útil e ordem estável", () => {
    const result = loadCareCockpit("car", storage());
    assert.equal(result.ok, true);
    assert.deepEqual(result.items.map(item => item.careItemId), CARE_ITEMS.map(item => item.id));
    assert.ok(result.items.every(item => item.state === "insufficient-information" && item.remainingMileage === null));
    const html = renderCareCockpitContent(result);
    assert.match(html, /Informe o histórico quando souber/);
    assert.match(html, /screen=care-onboarding/);
    assert.doesNotMatch(html, /prevista|km por dia|saudável|defeito/);
});

test("prioridade atenção > aproximação > insuficiência preserva avaliações do engine", () => {
    const store = storage();
    add(store, "engine-oil", 90000);
    add(store, "cooling", 89000);
    reading(store, 89000);
    const before = [...store.values];
    const result = loadCareCockpit("car", store);
    assert.equal(result.priority, "attention-needed");
    assert.deepEqual(result.items.map(item => item.careItemId), ["cooling", "engine-oil", "basic-review"]);
    for (const item of result.items) {
        const { remainingMileage, ...evaluation } = item;
        assert.deepEqual(evaluation, loadCareOnboarding("car", item.careItemId, store).evaluation);
    }
    assert.deepEqual([...store.values], before);
});

test("insuficiência precede acompanhamento dentro da referência; empates seguem CARE_ITEMS", () => {
    const store = storage();
    add(store, "engine-oil", 100000); add(store, "cooling", 100000);
    reading(store, 89000);
    const result = loadCareCockpit("car", store);
    assert.equal(result.priority, "insufficient-information");
    assert.deepEqual(result.items.map(item => item.careItemId), ["basic-review", "engine-oil", "cooling"]);
    add(store, "basic-review", 100000);
    const complete = loadCareCockpit("car", store);
    assert.equal(complete.priority, "up-to-date");
    assert.deepEqual(complete.items.map(item => item.careItemId), CARE_ITEMS.map(item => item.id));
});

test("distância factual positiva, zero e excedida; sem previsão temporal", () => {
    const store = storage();
    add(store, "engine-oil", 90000); add(store, "cooling", 89000); add(store, "basic-review", 88000);
    reading(store, 89000);
    const result = loadCareCockpit("car", store);
    assert.deepEqual(Object.fromEntries(result.items.map(item => [item.careItemId, item.remainingMileage])),
        { "engine-oil": 1000, cooling: 0, "basic-review": -1000 });
    const html = renderCareCockpitContent(result);
    assert.match(html, /1\.000 km até/); assert.match(html, /1\.000 km além/); assert.match(html, /na referência/);
    assert.doesNotMatch(html, /vencimento|estimad|por dia|por mês/);
});

test("referência continua user e evidência identifica origem e datas factuais", () => {
    const store = storage(); add(store, "engine-oil", 90000); reading(store, 89000);
    const result = loadCareCockpit("car", store);
    assert.equal(result.items[0].evidence.reference.source, "user");
    const html = renderCareCockpitContent(result);
    assert.match(html, /Referência informada por você/); assert.match(html, /origem: usuário/);
    assert.match(html, /2026-09-01/); assert.match(html, /Última leitura informada/);
});

test("reload recupera onboarding e isola veículos sem tocar schemas ou perfil", () => {
    const store = storage(); store.setItem("autopilot.vehicle-profile.v1", "perfil preservado");
    add(store, "engine-oil", 90000); reading(store, 89000);
    const reloaded = storage(); for (const [key, value] of store.values) reloaded.setItem(key, value);
    assert.deepEqual(loadCareCockpit("car", reloaded), loadCareCockpit("car", store));
    assert.ok(loadCareCockpit("other", reloaded).items.every(item => item.state === "insufficient-information"));
    assert.deepEqual([...reloaded.values], [...store.values]);
});

test("falha/corrupção de cada storage não vira informação insuficiente nem escreve", () => {
    for (const prefix of ["autopilot.vehicle-care.v1:", "autopilot.odometer-checkpoints.v1:", "autopilot.care-references.v1:"]) {
        const store = storage(); store.setItem(prefix + "car", "{invalid");
        const before = [...store.values]; const result = loadCareCockpit("car", store);
        assert.equal(result.ok, false); assert.deepEqual(result.items, []); assert.equal(result.priority, null);
        const html = renderCareCockpitContent(result);
        assert.match(html, /role="alert"/); assert.doesNotMatch(html, /Informação a completar/);
        assert.deepEqual([...store.values], before);
    }
    assert.equal(loadCareCockpit("car", { getItem() { throw Error("blocked"); } }).ok, false);
    assert.equal(loadCareCockpit("", storage()).ok, false);
});

test("quilometragem de marco ausente não fabrica CTA de edição impossível", () => {
    const store = storage(); add(store, "engine-oil", null, null);
    const html = renderCareCockpitContent(loadCareCockpit("car", store));
    assert.match(html, /marco salvo não pode ser editado/);
    assert.doesNotMatch(html, /Completar óleo do motor no percurso/);
    assert.match(describeNextAction({ type: "update-mileage" }), /leitura do odômetro/);
    assert.match(describeNextAction({ type: "provide-information", information: "care-reference" }), /próxima referência/);
    assert.match(describeNextAction({ type: "act-on-reference" }), /registre-o para estabelecer um novo marco/);
});

test("erros são escapados antes de apresentar HTML", () => {
    assert.match(renderCareCockpitContent({ ok: false, error: '<img onerror="x">' }), /&lt;img/);
});
