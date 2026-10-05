import test from "node:test";
import assert from "node:assert/strict";
import { CARE_STATES, isCareState, evaluateCareItem } from "./careStateEngine.js";
import { CARE_ITEMS, createCareEvent, isCareEvent } from "./careModel.js";
import { createOdometerCheckpoint, isOdometerCheckpoint } from "./odometerModel.js";
import { createVehicleProfile, isVehicleProfile } from "./vehicleModel.js";
import { loadCareEvents, saveCareEvent } from "./careStorage.js";
import { loadOdometerCheckpoints, saveOdometerCheckpoint } from "./odometerStorage.js";
import { loadVehicleProfile, saveVehicleProfile } from "./vehicleStorage.js";

const now = "2026-10-05T12:00:00.000Z";
const event = createCareEvent({ vehicleId: "vehicle-1", careItemId: "engine-oil",
    action: "performed", occurredAt: "2026-10-01T12:00:00.000Z", mileage: 40000
}, { id: "care-1", now }).event;
const checkpoint = createOdometerCheckpoint({ vehicleId: "vehicle-1", mileage: 45000,
    occurredAt: "2026-10-04T12:00:00.000Z"
}, { id: "reading-1", now }).checkpoint;
const input = { vehicleId: "vehicle-1", careItemId: "engine-oil", events: [], checkpoints: [] };

test("representa exatamente os quatro estados aprovados sem aceitar valores estranhos", () => {
    assert.deepEqual(CARE_STATES, ["up-to-date", "due-soon", "attention-needed", "insufficient-information"]);
    assert.equal(Object.isFrozen(CARE_STATES), true);
    for (const state of CARE_STATES) assert.equal(isCareState(state), true);
    for (const value of [null, undefined, {}, "healthy", "", "due"]) assert.equal(isCareState(value), false);
});

test("histórico ausente permanece desconhecido e permite estabelecer marco após cuidado realizado", () => {
    const expected = {
        ok: true,
        evaluation: {
            vehicleId: input.vehicleId, careItemId: input.careItemId, state: "insufficient-information",
            nextAction: { type: "provide-information", information: "care-history", alternative: "record-performed-care" },
            evidence: { careEvent: null, odometerCheckpoint: null, policy: null, calculation: null },
            missingInformation: ["care-history", "care-policy"]
        }, error: null
    };
    assert.deepEqual(evaluateCareItem(input), expected);
    assert.deepEqual(evaluateCareItem(input), expected);
});

test("evento realizado sem política continua insuficiente nas três famílias", () => {
    for (const { id } of CARE_ITEMS) {
        const result = evaluateCareItem({ ...input, careItemId: id,
            events: [{ ...event, careItemId: id }], checkpoints: [checkpoint] });
        assert.equal(result.ok, true);
        assert.equal(result.evaluation.state, "insufficient-information");
        assert.deepEqual(result.evaluation.missingInformation, ["care-policy"]);
        assert.deepEqual(result.evaluation.nextAction, { type: "provide-information", information: "care-policy" });
        assert.equal(result.evaluation.evidence.policy, null);
        assert.equal(result.evaluation.evidence.calculation, null);
    }
});

test("avaliação isola veículo e Care Item mesmo quando outro histórico é mais recente", () => {
    const foreign = { ...event, vehicleId: "vehicle-2", occurredAt: now };
    const cooling = { ...event, id: "cooling-1", careItemId: "cooling", occurredAt: now };
    const foreignReading = { ...checkpoint, vehicleId: "vehicle-2", occurredAt: now, mileage: 99999 };
    const facts = { ...input, events: [foreign, cooling, event], checkpoints: [foreignReading, checkpoint] };
    const result = evaluateCareItem(facts).evaluation;
    assert.deepEqual(result.evidence.careEvent, event);
    assert.deepEqual(result.evidence.odometerCheckpoint, checkpoint);
    assert.equal(evaluateCareItem({ ...facts, careItemId: "basic-review" }).evaluation.evidence.careEvent, null);
    assert.deepEqual(evaluateCareItem({ ...facts, vehicleId: "vehicle-3" }), evaluateCareItem({ ...input, vehicleId: "vehicle-3" }));
});

test("seleção de evento usa ocorrência antes de registro e não altera os fatos", () => {
    const older = { ...event, id: "older", occurredAt: "2026-09-01T12:00:00.000Z", recordedAt: "2026-10-06T12:00:00.000Z" };
    const events = [event, older];
    const snapshot = structuredClone(events);
    for (const list of [events, [...events].reverse()]) {
        assert.deepEqual(evaluateCareItem({ ...input, events: list }).evaluation.evidence.careEvent, event);
    }
    assert.deepEqual(events, snapshot);
});

test("empates de evento usam registro e ID independentemente de todas as permutações", () => {
    const laterRecord = { ...event, id: "a", recordedAt: "2026-10-06T12:00:00.000Z" };
    const sameDates = { ...laterRecord, id: "z", mileage: 41000 };
    for (const events of permutations([event, laterRecord, sameDates])) {
        assert.deepEqual(evaluateCareItem({ ...input, events }).evaluation.evidence.careEvent, sameDates);
    }
});

test("usa seleção factual da 03.2, inclusive leituras retrospectivas, empates e zero", () => {
    const older = { ...checkpoint, id: "older", occurredAt: "2026-09-01T12:00:00.000Z", recordedAt: "2026-10-06T12:00:00.000Z" };
    const laterRecord = { ...checkpoint, id: "a", recordedAt: "2026-10-06T12:00:00.000Z" };
    const sameDates = { ...laterRecord, id: "z", mileage: 46000 };
    for (const checkpoints of permutations([older, checkpoint, laterRecord, sameDates])) {
        assert.deepEqual(evaluateCareItem({ ...input, checkpoints }).evaluation.evidence.odometerCheckpoint, sameDates);
    }
    assert.equal(evaluateCareItem({ ...input, checkpoints: [{ ...checkpoint, mileage: 0 }] }).evaluation.evidence.odometerCheckpoint.mileage, 0);
});

test("não converte mileage do evento ou perfil em checkpoint nem estima leitura ausente", () => {
    const result = evaluateCareItem({ ...input, events: [event], mileage: 99999 }).evaluation;
    assert.equal(result.evidence.careEvent.mileage, 40000);
    assert.equal(result.evidence.odometerCheckpoint, null);
    assert.equal(result.evidence.calculation, null);
    assert.equal(result.state, "insufficient-information");
    // Sem regra dependente de km, não afirma que atualizar km resolveria a falta de política.
    assert.deepEqual(result.missingInformation, ["care-policy"]);
});

test("dados inválidos e duplicados falham explicitamente sem avaliação artificial", () => {
    const invalid = [null, undefined, {}, [],
        ...["", " ", null, 12].map(vehicleId => ({ ...input, vehicleId })),
        { ...input, careItemId: "brakes" }, { ...input, careItemId: null },
        { ...input, events: null }, { ...input, checkpoints: undefined },
        { ...input, events: [null] }, { ...input, checkpoints: [{}] },
        { ...input, events: new Array(1) }, { ...input, checkpoints: new Array(1) },
        { ...input, events: [{ ...event, action: "healthy" }] },
        { ...input, events: [{ ...event, mileage: -1 }] },
        { ...input, events: [{ ...event, occurredAt: "invalid" }] },
        { ...input, checkpoints: [{ ...checkpoint, recordedAt: "invalid" }] },
        { ...input, checkpoints: [{ ...checkpoint, mileage: "0" }] },
        { ...input, events: [event, event] },
        { ...input, events: [event, { ...event, careItemId: "cooling" }] },
        { ...input, checkpoints: [checkpoint, checkpoint] }
    ];
    for (const value of invalid) {
        const result = evaluateCareItem(value);
        assert.equal(result.ok, false);
        assert.equal(result.evaluation, null);
        assert.equal(typeof result.error, "string");
    }
});

test("avalia fatos persistidos preservando contratos, bytes e objetos de entrada", () => {
    const entries = new Map();
    const storage = { getItem(key) { return entries.get(key) ?? null; }, setItem(key, value) { entries.set(key, value); } };
    const profile = createVehicleProfile({ manufacturer: "Toyota", model: "Corolla", year: 2020,
        engine: "2.0", fuelType: "Flex", mileage: 45000 }, { id: input.vehicleId, now }).profile;
    assert.equal(saveVehicleProfile(profile, storage).ok, true);
    assert.equal(saveCareEvent(event, storage).ok, true);
    assert.equal(saveOdometerCheckpoint(checkpoint, storage).ok, true);
    const before = new Map(entries);
    const facts = { ...input, events: loadCareEvents(profile.id, storage).events,
        checkpoints: loadOdometerCheckpoints(profile.id, storage).checkpoints };
    const snapshot = structuredClone(facts);
    const result = evaluateCareItem(facts);
    assert.equal(result.ok, true);
    result.evaluation.evidence.careEvent.mileage = 0;
    result.evaluation.evidence.odometerCheckpoint.mileage = 0;
    assert.deepEqual(facts, snapshot);
    assert.deepEqual(entries, before);
    assert.equal(isVehicleProfile(loadVehicleProfile(storage).profile), true);
    assert.deepEqual(loadVehicleProfile(storage).profile, profile);
    assert.equal(isCareEvent(facts.events[0]), true);
    assert.equal(isOdometerCheckpoint(facts.checkpoints[0]), true);
});

function permutations(values) {
    if (!values.length) return [[]];
    return values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index))
        .map(rest => [value, ...rest]));
}
