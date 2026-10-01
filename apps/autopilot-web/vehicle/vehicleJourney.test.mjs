import test from "node:test";
import assert from "node:assert/strict";
import { createVehicleProfile } from "./vehicleModel.js";
import { loadVehicleProfile, saveVehicleProfile } from "./vehicleStorage.js";
import { goToScreen, AppState } from "../router.js";
import { bindVehicleProfileScreenEvents } from "../screens/VehicleProfileScreen.js";
import { renderQuestionScreen, resetQuestionScreen } from "../screens/questionScreen.js";

const input = { manufacturer: "Toyota", model: "Corolla", year: "2020",
    engine: "2.0", fuelType: "Flex", mileage: "0", nickname: "" };

function element() {
    return { innerHTML: "", textContent: "", disabled: false, hidden: true,
        handlers: {}, dataset: {}, classList: { add() {}, remove() {} },
        addEventListener(event, callback) { this.handlers[event] = callback; },
        removeAttribute() {}, setAttribute() {}, focus() {}, reset() { this.wasReset = true; } };
}

function setup(t) {
    const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
    const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    const originalFormData = globalThis.FormData;
    const nodes = new Map(["app", "vehicle-profile-form", "vehicle-profile-submit",
        "vehicle-profile-message", "vehicle-profile-current", "vehicle-profile-current-name",
        "btn-next-question", "btn-back-question"].map(id => [id, element()]));
    const options = [element(), element()];
    options[0].dataset.answer = "Usar este veículo";
    options[1].dataset.answer = "Escolher outro";
    let serialized = null;
    const storage = { getItem() { return serialized; }, setItem(key, value) { serialized = value; } };
    globalThis.document = { getElementById: id => nodes.get(id), querySelectorAll: () => options };
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
    globalThis.FormData = class { entries() { return Object.entries(input); } };
    resetQuestionScreen();
    t.after(() => {
        if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
        else delete globalThis.document;
        if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
        else delete globalThis.localStorage;
        globalThis.FormData = originalFormData;
        resetQuestionScreen();
    });
    return { nodes, options, storage };
}

test("entrada bloqueia perfil ausente, corrompido e inválido", t => {
    const { storage } = setup(t);
    for (const data of [null, "{invalid", JSON.stringify({ model: "Clio" })]) {
        storage.setItem("profile", data);
        goToScreen("questionnaire");
        assert.equal(AppState.currentScreen, "vehicle-profile");
    }
});

test("cadastro persiste zero, continua e reutiliza o mesmo perfil na reentrada", t => {
    const { nodes } = setup(t);
    goToScreen("questionnaire");
    nodes.get("vehicle-profile-form").handlers.submit({ preventDefault() {} });
    assert.equal(AppState.currentScreen, "questionnaire");
    const saved = loadVehicleProfile().profile;
    assert.equal(saved.mileage, 0);
    assert.match(nodes.get("app").innerHTML, /Toyota Corolla · 2020 · 2.0/);
    goToScreen("questionnaire");
    assert.equal(loadVehicleProfile().profile.id, saved.id);
    assert.match(nodes.get("app").innerHTML, /Toyota Corolla/);
});

test("falha de escrita mantém formulário, dados e nova tentativa sem continuar", t => {
    const { nodes, storage } = setup(t);
    const write = storage.setItem;
    storage.setItem = () => { throw new Error("quota"); };
    goToScreen("questionnaire");
    const form = nodes.get("vehicle-profile-form");
    form.handlers.submit({ preventDefault() {} });
    assert.equal(AppState.currentScreen, "vehicle-profile");
    assert.equal(loadVehicleProfile().profile, null);
    assert.equal(form.wasReset, undefined);
    assert.equal(nodes.get("vehicle-profile-submit").disabled, false);
    assert.match(nodes.get("vehicle-profile-message").textContent, /Tente novamente/);
    storage.setItem = write;
    form.handlers.submit({ preventDefault() {} });
    assert.equal(AppState.currentScreen, "questionnaire");
});

test("getter bloqueado de localStorage retorna erros recuperáveis", t => {
    setup(t);
    Object.defineProperty(globalThis, "localStorage", { configurable: true,
        get() { throw new Error("blocked"); } });
    assert.equal(loadVehicleProfile().ok, false);
    assert.equal(saveVehicleProfile(createVehicleProfile(input).profile).ok, false);
    goToScreen("questionnaire");
    assert.equal(AppState.currentScreen, "vehicle-profile");
});

test("Escolher outro abre cadastro e substituição reinicia respostas", t => {
    const { nodes, options } = setup(t);
    saveVehicleProfile(createVehicleProfile(input).profile);
    goToScreen("questionnaire");
    options[0].handlers.click();
    nodes.get("btn-next-question").handlers.click();
    assert.match(nodes.get("app").innerHTML, /O que você quer fazer agora/);
    nodes.get("btn-back-question").handlers.click();
    options[1].handlers.click();
    assert.equal(AppState.currentScreen, "vehicle-profile");
    nodes.get("vehicle-profile-form").handlers.submit({ preventDefault() {} });
    assert.match(nodes.get("app").innerHTML, /Pergunta 1/);
    assert.match(nodes.get("app").innerHTML, /id="btn-next-question"\s+disabled/);
    assert.deepEqual(AppState.answers, {});
});

test("dados do perfil são escapados e não entram em atributos HTML", t => {
    setup(t);
    const profile = createVehicleProfile({ ...input,
        manufacturer: '<img src=x onerror="alert(1)"> &', model: "'Teste'" }).profile;
    saveVehicleProfile(profile);
    const html = renderQuestionScreen();
    assert.equal(html.includes("<img"), false);
    assert.match(html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt; &amp;/);
    assert.match(html, /data-answer="Usar este veículo"/);
    assert.equal(html.includes("Renault Clio"), false);
});

test("callback de cadastro não é chamado em reenvio duplicado", t => {
    const { nodes } = setup(t);
    let calls = 0;
    bindVehicleProfileScreenEvents({ onSaved() { calls++; } });
    const submit = nodes.get("vehicle-profile-form").handlers.submit;
    submit({ preventDefault() {} });
    submit({ preventDefault() {} });
    assert.equal(calls, 1);
});
