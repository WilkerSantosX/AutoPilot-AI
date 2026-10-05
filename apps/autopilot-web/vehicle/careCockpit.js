import { CARE_ITEMS } from "./careModel.js";
import { loadCareOnboarding } from "./careOnboarding.js";

const PRIORITY = ["attention-needed", "due-soon", "insufficient-information", "up-to-date"];

export function loadCareCockpit(vehicleId, storage) {
    const items = [];
    for (const item of CARE_ITEMS) {
        const result = loadCareOnboarding(vehicleId, item.id, storage);
        if (!result.ok) return { ok: false, items: [], priority: null, error: result.error };
        const evaluation = result.evaluation;
        const calculation = evaluation.evidence.calculation;
        items.push({ ...evaluation, remainingMileage: calculation
            ? calculation.nextDueMileage - calculation.currentMileage : null });
    }
    items.sort((left, right) => PRIORITY.indexOf(left.state) - PRIORITY.indexOf(right.state));
    return { ok: true, items, priority: items[0].state, error: null };
}
