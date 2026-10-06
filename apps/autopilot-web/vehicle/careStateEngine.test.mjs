import test from "node:test";
import assert from "node:assert/strict";
import { CARE_STATES, CARE_STATE_POLICY, isCareState, isCareReference, evaluateCareItem } from "./careStateEngine.js";
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
const reference = { vehicleId: input.vehicleId, careItemId: input.careItemId,
    careEventId: event.id, nextDueMileage: 50000, source: "user" };

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
            evidence: { careEvent: null, odometerCheckpoint: null, reference: null, policy: CARE_STATE_POLICY, calculation: null },
            missingInformation: ["care-history", "care-reference", "odometer-checkpoint"]
        }, error: null
    };
    assert.deepEqual(evaluateCareItem(input), expected);
    assert.deepEqual(evaluateCareItem(input), expected);
});

test("evento realizado sem referência continua insuficiente nas três famílias", () => {
    for (const { id } of CARE_ITEMS) {
        const result = evaluateCareItem({ ...input, careItemId: id,
            events: [{ ...event, careItemId: id }], checkpoints: [checkpoint] });
        assert.equal(result.ok, true);
        assert.equal(result.evaluation.state, "insufficient-information");
        assert.deepEqual(result.evaluation.missingInformation, ["care-reference"]);
        assert.deepEqual(result.evaluation.nextAction, { type: "provide-information", information: "care-reference" });
        assert.deepEqual(result.evaluation.evidence.policy, CARE_STATE_POLICY);
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
    assert.deepEqual(result.missingInformation, ["care-reference", "odometer-checkpoint"]);
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
    const facts = { ...input, reference: { ...reference }, events: loadCareEvents(profile.id, storage).events,
        checkpoints: loadOdometerCheckpoints(profile.id, storage).checkpoints };
    const snapshot = structuredClone(facts);
    const result = evaluateCareItem(facts);
    assert.equal(result.ok, true);
    assert.equal(result.evaluation.state, "up-to-date");
    result.evaluation.evidence.careEvent.mileage = 0;
    result.evaluation.evidence.odometerCheckpoint.mileage = 0;
    assert.deepEqual(facts, snapshot);
    assert.deepEqual(entries, before);
    assert.equal(isVehicleProfile(loadVehicleProfile(storage).profile), true);
    assert.deepEqual(loadVehicleProfile(storage).profile, profile);
    assert.equal(isCareEvent(facts.events[0]), true);
    assert.equal(isOdometerCheckpoint(facts.checkpoints[0]), true);
});

test("referência user é explícita e rejeita outras origens, vínculos e valores inválidos", () => {
    assert.equal(isCareReference(reference), true);
    const invalid = [null, [], {},
        ...["manufacturer", "autopilot", "", null].map(source => ({ ...reference, source })),
        ...[-1, 1.5, "50000", NaN, Infinity, 2 ** 53, null, undefined].map(nextDueMileage => ({ ...reference, nextDueMileage })),
        { ...reference, vehicleId: "" }, { ...reference, careItemId: "brakes" }, { ...reference, careEventId: "" }
    ];
    for (const value of invalid) assert.equal(isCareReference(value), false);
    for (const value of invalid.filter(value => value !== null).concat([
        { ...reference, vehicleId: "vehicle-2" }, { ...reference, careItemId: "cooling" }
    ])) {
        const result = evaluateCareItem({ ...input, events: [event], checkpoints: [checkpoint], reference: value });
        assert.equal(result.ok, false);
        assert.equal(result.evaluation, null);
    }
});

test("referência igual ou inferior ao marco falha sem estado artificial", () => {
    for (const nextDueMileage of [0, 39999, 40000]) {
        const result = evaluateCareItem({ ...input, events: [event], checkpoints: [checkpoint],
            reference: { ...reference, nextDueMileage } });
        assert.equal(result.ok, false);
        assert.equal(result.evaluation, null);
    }
});

test("exemplo normativo 80000→90000 cobre as fronteiras e as próximas ações nos três itens", () => {
    for (const { id } of CARE_ITEMS) {
        for (const [mileage, state, nextAction] of [
            [80000, "up-to-date", { type: "monitor" }],
            [88999, "up-to-date", { type: "monitor" }],
            [89000, "due-soon", { type: "prepare-for-reference" }],
            [89500, "due-soon", { type: "prepare-for-reference" }],
            [89999, "due-soon", { type: "prepare-for-reference" }],
            [90000, "attention-needed", { type: "act-on-reference", afterCare: "record-performed-care" }],
            [91000, "attention-needed", { type: "act-on-reference", afterCare: "record-performed-care" }]
        ]) {
            const result = evaluateCareItem({ ...input, careItemId: id,
                events: [{ ...event, careItemId: id, mileage: 80000 }],
                checkpoints: [{ ...checkpoint, mileage }],
                reference: { ...reference, careItemId: id, nextDueMileage: 90000 } });
            assert.equal(result.ok, true);
            assert.equal(result.evaluation.state, state);
            assert.deepEqual(result.evaluation.nextAction, nextAction);
            assert.deepEqual(result.evaluation.missingInformation, []);
            assert.deepEqual(result.evaluation.evidence.reference, { ...reference, careItemId: id, nextDueMileage: 90000 });
            assert.deepEqual(result.evaluation.evidence.calculation, { milestoneMileage: 80000, nextDueMileage: 90000,
                currentMileage: mileage, intervalMileage: 10000, attentionWindowMileage: 1000, dueSoonThreshold: 89000 });
        }
    }
});

test("limites inteiros equivalem a ceil do limiar racional, inclusive intervalos curtos e máximos", () => {
    for (const [milestoneMileage, nextDueMileage, threshold] of [
        [0, 11, 10], [40000, 50001, 49001], [0, 9, 9], [0, 1, 1],
        [0, Number.MAX_SAFE_INTEGER, 8106479329266892],
        [Number.MAX_SAFE_INTEGER - 11, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1]
    ]) {
        for (const currentMileage of new Set([threshold - 1, threshold, nextDueMileage])) {
            const result = evaluateCareItem({ ...input, events: [{ ...event, mileage: milestoneMileage }],
                checkpoints: [{ ...checkpoint, mileage: currentMileage }], reference: { ...reference, nextDueMileage } }).evaluation;
            const exactThreshold = (9n * BigInt(nextDueMileage) + BigInt(milestoneMileage) + 9n) / 10n;
            assert.equal(result.evidence.calculation.dueSoonThreshold, Number(exactThreshold));
            assert.equal(result.evidence.calculation.dueSoonThreshold, threshold);
            assert.equal(result.state, currentMileage >= nextDueMileage ? "attention-needed"
                : currentMileage >= threshold ? "due-soon" : "up-to-date");
        }
    }
});

test("lacunas indicam marco, referência ou leitura sem estimativa", () => {
    const cases = [
        { events: [], checkpoints: [checkpoint], reference, missing: ["care-history", "care-reference"],
            nextAction: { type: "provide-information", information: "care-history", alternative: "record-performed-care" } },
        { events: [{ ...event, mileage: null }], checkpoints: [checkpoint], reference,
            missing: ["milestone-mileage"], nextAction: { type: "provide-information", information: "milestone-mileage" } },
        { events: [event], checkpoints: [checkpoint], reference: null,
            missing: ["care-reference"], nextAction: { type: "provide-information", information: "care-reference" } },
        { events: [event], checkpoints: [], reference,
            missing: ["odometer-checkpoint"], nextAction: { type: "update-mileage" } },
        { events: [event], checkpoints: [{ ...checkpoint, mileage: 39999 }], reference,
            missing: ["odometer-checkpoint"], nextAction: { type: "update-mileage" } },
        { events: [event], checkpoints: [{ ...checkpoint, occurredAt: "2026-09-01", recordedAt: now }], reference,
            missing: ["odometer-checkpoint"], nextAction: { type: "update-mileage" } }
    ];
    for (const { missing, nextAction, ...facts } of cases) {
        const result = evaluateCareItem({ ...input, ...facts });
        assert.equal(result.ok, true);
        assert.equal(result.evaluation.state, "insufficient-information");
        assert.deepEqual(result.evaluation.missingInformation, missing);
        assert.deepEqual(result.evaluation.nextAction, nextAction);
        assert.equal(result.evaluation.evidence.calculation, null);
    }
});

test("novo marco não herda referência nem periodicidade do marco anterior", () => {
    const newEvent = { ...event, id: "care-2", mileage: 60000, occurredAt: "2026-10-05T10:00:00Z" };
    const latestCheckpoint = { ...checkpoint, id: "reading-2", mileage: 65000, occurredAt: now };
    for (const events of permutations([event, newEvent])) {
        for (const checkpoints of permutations([checkpoint, latestCheckpoint])) {
            const result = evaluateCareItem({ ...input, events, checkpoints, reference }).evaluation;
            assert.deepEqual(result.evidence.careEvent, newEvent);
            assert.deepEqual(result.evidence.odometerCheckpoint, latestCheckpoint);
            assert.equal(result.state, "insufficient-information");
            assert.deepEqual(result.missingInformation, ["care-reference"]);
            assert.equal(result.evidence.calculation, null);
            const updated = evaluateCareItem({ ...input, events, checkpoints,
                reference: { ...reference, careEventId: newEvent.id, nextDueMileage: 66000 } }).evaluation;
            assert.equal(updated.state, "up-to-date");
            assert.equal(updated.evidence.calculation.nextDueMileage, 66000);
        }
    }
});

test("resultado é explicável sem diagnóstico e não modifica a referência de entrada", () => {
    const supplied = { ...reference };
    const result = evaluateCareItem({ ...input, events: [event], checkpoints: [checkpoint], reference: supplied }).evaluation;
    assert.deepEqual(Object.keys(result).sort(), ["careItemId", "evidence", "missingInformation", "nextAction", "state", "vehicleId"]);
    assert.deepEqual(Object.keys(result.evidence).sort(), ["calculation", "careEvent", "odometerCheckpoint", "policy", "reference"]);
    assert.equal(result.evidence.reference.source, "user");
    result.evidence.reference.nextDueMileage = 0;
    assert.deepEqual(supplied, reference);
});

function permutations(values) {
    if (!values.length) return [[]];
    return values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index))
        .map(rest => [value, ...rest]));
}
