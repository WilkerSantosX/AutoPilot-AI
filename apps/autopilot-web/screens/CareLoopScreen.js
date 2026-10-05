import { loadVehicleProfile } from "../vehicle/vehicleStorage.js";
import { loadCareOnboarding } from "../vehicle/careOnboarding.js";
import { prepareCareLoop, saveCareLoop } from "../vehicle/careLoop.js";

const LABELS = { "engine-oil": "Óleo do motor", cooling: "Arrefecimento", "basic-review": "Revisão básica" };

export function renderCareLoopScreen(profile, careItemId) {
    return `<section class="vehicle-profile-screen"><div class="vehicle-profile-shell">
        <header class="vehicle-profile-header"><span class="vehicle-profile-badge">Cuidado realizado</span>
        <h1>Registrar ${LABELS[careItemId]}</h1><p>${escapeText(`${profile.manufacturer} ${profile.model} · ${profile.year}`)}</p>
        <p>Registre somente um cuidado que já aconteceu. O histórico anterior será preservado.</p></header>
        <form id="care-loop-form" novalidate><div class="vehicle-profile-grid">
            <div class="vehicle-profile-field"><label for="loop-date">Data do cuidado realizado</label>
                <input class="form-control" id="loop-date" name="occurredAt" type="date" required></div>
            <div class="vehicle-profile-field"><label for="loop-mileage">Quilometragem no cuidado (opcional)</label>
                <input class="form-control" id="loop-mileage" name="mileage" type="number" min="0" step="1" inputmode="numeric"></div>
            <div class="vehicle-profile-field vehicle-profile-field-wide"><label for="loop-reference">Próxima referência conhecida (km, opcional)</label>
                <input class="form-control" id="loop-reference" name="nextDueMileage" type="number" min="0" step="1" inputmode="numeric" aria-describedby="loop-help">
                <p id="loop-help">Informe apenas se já souber. Deve ser maior que a quilometragem do cuidado. Não reutilizamos a referência anterior. Origem: informada por você.</p></div>
        </div><p id="loop-message" role="status" aria-live="polite" tabindex="-1"></p>
        <button class="btn btn-primary" id="loop-submit" type="submit">Registrar cuidado realizado</button>
        <a class="btn btn-outline-secondary" href="./?screen=care-cockpit">Voltar aos cuidados</a></form>
    </div></section>`;
}

export function bindCareLoopScreenEvents(profile, careItemId, { onSaved } = {}) {
    const form = document.getElementById("care-loop-form");
    const submit = document.getElementById("loop-submit");
    const message = document.getElementById("loop-message");
    const mileage = document.getElementById("loop-mileage");
    const reference = document.getElementById("loop-reference");
    const date = document.getElementById("loop-date");
    let pendingPlan = null;
    let completed = false;
    function updateReference() { reference.disabled = mileage.value === ""; }
    mileage.addEventListener("input", updateReference);
    updateReference();
    form.addEventListener("submit", event => {
        event.preventDefault();
        if (completed || submit.disabled) return;
        const active = loadVehicleProfile();
        if (!active.ok || active.profile?.id !== profile.id) {
            message.textContent = "O veículo ativo mudou ou não pôde ser carregado. Volte aos cuidados para continuar com o veículo correto.";
            message.focus();
            return;
        }
        submit.disabled = true;
        if (!pendingPlan) {
            const data = new FormData(form);
            const prepared = prepareCareLoop({ vehicleId: profile.id, careItemId,
                occurredAt: data.get("occurredAt"), mileage: parseMileage(data.get("mileage")),
                nextDueMileage: parseMileage(data.get("nextDueMileage")) }, loadCareOnboarding(profile.id, careItemId));
            if (!prepared.ok) { showError(prepared.error); return; }
            pendingPlan = prepared.plan;
        }
        const saved = saveCareLoop(pendingPlan);
        if (!saved.ok) {
            for (const field of [date, mileage, reference]) field.readOnly = true;
            showError(`${saved.error} Tente registrar novamente com estes mesmos dados. Fatos já salvos não serão duplicados.`);
            return;
        }
        completed = true;
        onSaved?.(saved.evaluation.evidence.careEvent?.id === pendingPlan.event.id);
    });
    function showError(text) { message.textContent = text; submit.disabled = false; message.focus(); }
}

function parseMileage(value) { return value === null || value === "" ? null : /^\d+$/.test(value) ? Number(value) : NaN; }
function escapeText(value) {
    return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
