import test from "node:test";
import assert from "node:assert/strict";
import { createVehicleProfile } from "./vehicleModel.js";
import { loadVehicleProfile, saveVehicleProfile } from "./vehicleStorage.js";
import { goToScreen, AppState } from "../router.js";
import { bindVehicleProfileScreenEvents } from "../screens/VehicleProfileScreen.js";
import { renderQuestionScreen, resetQuestionScreen } from "../screens/questionScreen.js";
import { Questions } from "../data/questions.js";
import { renderCockpitScreen } from "../screens/CockpitScreen.js";
import { renderHeroScreen } from "../screens/HeroScreen.js";

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
    const storedValues = new Map();
    const storage = { getItem(key) { return storedValues.get(key) ?? null; },
        setItem(key, value) { storedValues.set(key === "profile" ? "autopilot.vehicle-profile.v1" : key, value); } };
    globalThis.document = { getElementById: id => nodes.get(id), querySelectorAll: () => options,
        querySelector: () => null };
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
    globalThis.FormData = class { entries() { return Object.entries(input); } };
    resetQuestionScreen();
    AppState.answers = {};
    AppState.answerVehicleId = null;
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

function sessionAnswers(goal = 0, urgency = 0) {
    return Object.fromEntries(Questions.map((question, index) => [question.id, {
        questionId: question.id,
        value: question.options[[0, goal, urgency][index]],
        answeredAt: "2026-10-03T12:00:00.000Z"
    }]));
}

test("Engine entrega respostas reais pela conclusão do questionário ao cockpit", t => {
    const { nodes, options } = setup(t);
    saveVehicleProfile(createVehicleProfile(input).profile);
    goToScreen("questionnaire");
    for (const question of Questions) {
        options[0].dataset.answer = question.options[0];
        options[0].handlers.click();
        nodes.get("btn-next-question").handlers.click();
    }
    assert.equal(AppState.currentScreen, "hero");
    assert.equal(AppState.answers[2].value, Questions[1].options[0]);
    assert.equal(AppState.answers[3].value, Questions[2].options[0]);
    goToScreen("cockpit");
    assert.equal(AppState.currentScreen, "cockpit");
    assert.ok(nodes.get("app").innerHTML.includes(Questions[1].options[0]));
});

test("Hero e cockpit recuperam entradas sem perfil ou respostas válidas", t => {
    const { storage } = setup(t);
    const read = storage.getItem;
    for (const screen of ["hero", "cockpit"]) {
        for (const data of [null, "{bad", JSON.stringify({ id: "bad" })]) {
            storage.setItem("profile", data);
            goToScreen(screen);
            assert.equal(AppState.currentScreen, "vehicle-profile");
            assert.deepEqual(AppState.answers, {});
        }
        saveVehicleProfile(createVehicleProfile(input).profile);
        for (const invalid of [null, {}, [], { ...sessionAnswers(), 2: undefined },
            { ...sessionAnswers(), 3: { ...sessionAnswers()[3], value: "inventado" } },
            { ...sessionAnswers(), 1: { ...sessionAnswers()[1], value: "Escolher outro" } },
            { ...sessionAnswers(), 2: { ...sessionAnswers()[2], questionId: 3 } },
            { ...sessionAnswers(), 2: { ...sessionAnswers()[2], answeredAt: "invalid" } }]) {
            goToScreen("questionnaire");
            AppState.answers = invalid;
            goToScreen(screen);
            assert.equal(AppState.currentScreen, "questionnaire");
            assert.deepEqual(AppState.answers, {});
        }
        storage.getItem = () => { throw new Error("blocked"); };
        goToScreen(screen);
        assert.equal(AppState.currentScreen, "vehicle-profile");
        storage.getItem = read;
    }
});

test("cockpit recebe veículo real, zero e diferentes respostas da sessão", t => {
    const { nodes } = setup(t);
    for (const [manufacturer, model, goal, urgency] of [
        ["Toyota", "Corolla", 1, 0], ["Honda", "Civic", 0, 2]
    ]) {
        const profile = createVehicleProfile({ ...input, manufacturer, model }).profile;
        saveVehicleProfile(profile);
        goToScreen("questionnaire");
        AppState.answers = sessionAnswers(goal, urgency);
        goToScreen("hero");
        assert.equal(AppState.currentScreen, "hero");
        goToScreen("cockpit");
        assert.equal(AppState.currentScreen, "cockpit");
        const html = nodes.get("app").innerHTML;
        assert.ok(html.includes(`${manufacturer} ${model} · 2020 · 2.0`));
        assert.ok(html.includes("Quilometragem informada: 0 km"));
        assert.ok(html.includes(Questions[1].options[goal]));
        assert.ok(html.includes(Questions[2].options[urgency]));
        assert.ok(html.includes("não constitui diagnóstico"));
        assert.doesNotMatch(html, /Wilker|Renault Clio|Veículo estável|situação crítica|tranquilidade/);
    }
});

test("troca de perfil durante perguntas ou Hero invalida respostas e reinicia", t => {
    const { nodes } = setup(t);
    for (const screen of ["hero", "cockpit"]) {
        saveVehicleProfile(createVehicleProfile(input).profile);
        goToScreen("questionnaire");
        AppState.answers = sessionAnswers();
        if (screen === "cockpit") goToScreen("hero");
        const replacement = createVehicleProfile({ ...input, manufacturer: "Honda" }).profile;
        saveVehicleProfile(replacement);
        goToScreen(screen);
        assert.equal(AppState.currentScreen, "questionnaire");
        assert.deepEqual(AppState.answers, {});
        assert.equal(AppState.answerVehicleId, replacement.id);
        assert.match(nodes.get("app").innerHTML, /Pergunta 1/);
        assert.match(nodes.get("app").innerHTML, /Honda Corolla/);
    }
});

test("reset da jornada mantém apenas veículo persistido", t => {
    setup(t);
    const profile = createVehicleProfile(input).profile;
    saveVehicleProfile(profile);
    goToScreen("questionnaire");
    AppState.answers = sessionAnswers();
    goToScreen("vehicle-profile");
    assert.deepEqual(AppState.answers, {});
    assert.equal(AppState.answerVehicleId, null);
    assert.equal(loadVehicleProfile().profile.id, profile.id);
});

test("cockpit escapa textos do perfil e respostas sem interpolar atributos", () => {
    const payload = `<img src=x onerror="alert(1)"> & 'teste'`;
    const profile = createVehicleProfile({ ...input, manufacturer: payload,
        model: payload, engine: payload, nickname: payload }).profile;
    const answers = sessionAnswers();
    answers[2].value = payload;
    answers[3].value = payload;
    const html = renderCockpitScreen({ profile, answers });
    assert.equal(html.includes(payload), false);
    assert.equal(html.includes("<img"), false);
    assert.match(html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt; &amp; &#39;teste&#39;/);
    assert.doesNotMatch(renderHeroScreen(), /analisando|Iniciando análise|Já sei como posso ajudar/);
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


test("entrada direta de cuidados usa veículo ativo sem respostas e preserva guarda legada", t => {
    const { nodes, storage } = setup(t);
    goToScreen("care-cockpit");
    assert.equal(AppState.currentScreen, "vehicle-profile");
    saveVehicleProfile(createVehicleProfile(input).profile);
    goToScreen("care-cockpit");
    assert.equal(AppState.currentScreen, "care-cockpit");
    assert.match(nodes.get("app").innerHTML, /Existe algo a fazer agora/);
    assert.match(nodes.get("app").innerHTML, /Informação a completar/);
    assert.match(nodes.get("app").innerHTML, /screen=care-onboarding/);
    goToScreen("cockpit");
    assert.equal(AppState.currentScreen, "questionnaire");
    storage.setItem("profile", "{bad");
    goToScreen("care-cockpit");
    assert.equal(AppState.currentScreen, "vehicle-profile");
});
