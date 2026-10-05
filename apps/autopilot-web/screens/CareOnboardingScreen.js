import { CARE_ITEMS } from "../vehicle/careModel.js";
import { loadVehicleProfile } from "../vehicle/vehicleStorage.js";
import { loadCareOnboarding, prepareCareOnboarding, saveCareOnboarding } from "../vehicle/careOnboarding.js";

const LABELS = { "engine-oil": "Óleo do motor", cooling: "Arrefecimento", "basic-review": "Revisão básica" };

export function renderCareOnboardingScreen(profile) {
    return `<section class="vehicle-profile-screen care-onboarding-screen"><div class="vehicle-profile-shell">
        <header class="vehicle-profile-header"><span class="vehicle-profile-badge">Começar a acompanhar</span>
            <h1>Cuidados do seu veículo</h1><p>${escapeText(`${profile.manufacturer} ${profile.model} · ${profile.year}`)}</p>
            <p>Conte o que você sabe, sem precisar lembrar de tudo. Acompanhamos suas referências; não avaliamos a condição mecânica.</p>
        </header>
        <div id="care-step"></div>
        <div class="vehicle-profile-actions"><a class="btn btn-outline-secondary" href="./">Voltar à aplicação</a></div>
    </div></section>`;
}

export function bindCareOnboardingScreenEvents(profile) {
    const step = document.getElementById("care-step");
    let index = 0;
    function sameVehicle() {
        const active = loadVehicleProfile();
        if (active.ok && active.profile?.id === profile.id) return true;
        step.innerHTML = `<p role="alert">O veículo ativo mudou ou não pôde ser carregado. Volte à aplicação para continuar com o veículo correto.</p>`;
        return false;
    }
    function showChoice() {
        if (!sameVehicle()) return;
        if (index === CARE_ITEMS.length) {
            step.innerHTML = `<h2>Percurso concluído</h2><p>As informações registradas estão salvas neste dispositivo. O que você não sabe pode ser informado depois, ou a partir de um novo marco quando realizar um cuidado.</p>`;
            return;
        }
        const careItemId = CARE_ITEMS[index].id;
        const context = loadCareOnboarding(profile.id, careItemId);
        step.innerHTML = `<p class="care-progress">Cuidado ${index + 1} de ${CARE_ITEMS.length}</p><h2>${LABELS[careItemId]}</h2>
            ${context.ok ? `<p>Você sabe quando este cuidado foi realizado?</p>
            <div class="care-choices"><button class="btn btn-primary" id="care-known" type="button">Sei o histórico</button>
            <button class="btn btn-outline-secondary" id="care-unknown" type="button">Não sei / não lembro</button>
            ${context.evaluation.evidence.careEvent ? `<button class="btn btn-outline-secondary" id="care-existing" type="button">Usar marco já salvo</button>` : ""}</div>`
                : `<p role="alert">${escapeText(context.error)}</p><button class="btn btn-primary" id="care-retry" type="button">Tentar carregar novamente</button>`}`;
        document.getElementById("care-retry")?.addEventListener("click", showChoice);
        document.getElementById("care-known")?.addEventListener("click", () => showForm(context, false));
        document.getElementById("care-existing")?.addEventListener("click", () => showForm(context, true));
        document.getElementById("care-unknown")?.addEventListener("click", () => {
            if (!sameVehicle()) return;
            const fresh = loadCareOnboarding(profile.id, careItemId);
            if (!fresh.ok) { showChoice(); return; }
            showResult(fresh.evaluation, true);
        });
    }
    function showForm(context, reuse) {
        if (!sameVehicle()) return;
        const event = reuse ? context.evaluation.evidence.careEvent : null;
        const reference = reuse ? context.reference : null;
        step.innerHTML = `<p class="care-progress">Cuidado ${index + 1} de ${CARE_ITEMS.length}</p><h2>${LABELS[CARE_ITEMS[index].id]}</h2>
            <p>${reuse ? "O marco salvo foi preservado. Você pode completar a referência ou a leitura atual." : "Informe apenas o que sabe sobre um cuidado que aconteceu."}</p>
            <form id="care-form" novalidate><div class="vehicle-profile-grid">
                ${field("occurredAt", "Data do cuidado realizado", "date", event?.occurredAt.slice(0, 10) ?? "", !!event)}
                ${field("mileage", "Quilometragem nesse cuidado (opcional)", "number", event?.mileage ?? "", !!event)}
                <div class="vehicle-profile-field vehicle-profile-field-wide">
                    <label for="care-nextDueMileage">Próxima referência que você já conhece (km, opcional)</label>
                    <input class="form-control" id="care-nextDueMileage" name="nextDueMileage" type="number" min="0" step="1" inputmode="numeric"
                        value="${reference?.nextDueMileage ?? ""}" ${reference ? "readonly" : ""} aria-describedby="care-reference-help">
                    <p id="care-reference-help">Referência informada por você, não uma recomendação do AutoPilot. Requer a quilometragem conhecida do marco e deve ser maior que ela. Se não souber, deixe em branco.</p>
                </div>
                <div id="care-current-section" class="vehicle-profile-field vehicle-profile-field-wide" hidden>
                    <label for="care-currentMileage">Quilometragem atual (opcional)</label>
                    <input class="form-control" id="care-currentMileage" name="currentMileage" type="number" min="0" step="1" inputmode="numeric" aria-describedby="care-current-help">
                    <p id="care-current-help">Ainda precisamos de uma leitura para posicionar este cuidado. Informe o valor que você lê no odômetro agora; não usamos o histórico como leitura atual.</p>
                </div>
            </div><p id="care-message" role="status" aria-live="polite" tabindex="-1"></p>
            <div class="care-choices"><button class="btn btn-primary" id="care-submit" type="submit">Salvar e avaliar</button>
                <button class="btn btn-outline-secondary" id="care-cancel" type="button">Voltar às opções</button></div></form>`;
        const form = document.getElementById("care-form");
        const date = document.getElementById("care-occurredAt");
        const mileage = document.getElementById("care-mileage");
        const nextDue = document.getElementById("care-nextDueMileage");
        const current = document.getElementById("care-currentMileage");
        const submit = document.getElementById("care-submit");
        const message = document.getElementById("care-message");
        let pendingPlan = null;
        function updateFields() {
            nextDue.disabled = mileage.value === "";
            const reading = context.evaluation.evidence.odometerCheckpoint;
            const adequate = reading && Number(mileage.value) <= reading.mileage
                && !Number.isNaN(Date.parse(date.value)) && Date.parse(date.value) <= Date.parse(reading.occurredAt);
            const needsReading = !nextDue.disabled && nextDue.value !== "" && !adequate;
            document.getElementById("care-current-section").hidden = !needsReading;
            current.disabled = !needsReading;
        }
        for (const control of [date, mileage, nextDue]) control.addEventListener("input", updateFields);
        updateFields();
        document.getElementById("care-cancel").addEventListener("click", showChoice);
        form.addEventListener("submit", e => {
            e.preventDefault();
            if (submit.disabled || !sameVehicle()) return;
            submit.disabled = true;
            if (!pendingPlan) {
                const fresh = loadCareOnboarding(profile.id, CARE_ITEMS[index].id);
                const data = new FormData(form);
                const prepared = prepareCareOnboarding({ vehicleId: profile.id, careItemId: CARE_ITEMS[index].id,
                    knowledge: "known", careEventId: event?.id,
                    occurredAt: event?.occurredAt ?? data.get("occurredAt"),
                    mileage: parseMileage(data.get("mileage")), nextDueMileage: parseMileage(data.get("nextDueMileage")),
                    currentMileage: parseMileage(data.get("currentMileage")) }, fresh);
                if (!prepared.ok) {
                    message.textContent = prepared.error;
                    submit.disabled = false;
                    message.focus();
                    return;
                }
                pendingPlan = prepared.plan;
            }
            const result = saveCareOnboarding(pendingPlan);
            if (!result.ok) {
                // O mesmo plano pode ser repetido após escrita parcial, sem duplicar fatos.
                for (const control of [date, mileage, nextDue, current]) control.readOnly = true;
                message.textContent = `${result.error} Os dados informados foram preservados. Tente salvar novamente; registros já salvos não serão duplicados.`;
                submit.disabled = false;
                return;
            }
            showResult(result.evaluation, false);
        });
    }
    function showResult(evaluation, unknown) {
        const messages = {
            "up-to-date": "Começamos a acompanhar: você ainda está antes da faixa de atenção da referência informada. Continue acompanhando.",
            "due-soon": "Sua referência está se aproximando. Prepare-se para ela.",
            "attention-needed": "A referência informada por você foi atingida. Aja em relação a ela e registre quando realizar o cuidado, para estabelecer um novo marco.",
            "insufficient-information": "Ainda não temos informação suficiente para posicionar este cuidado."
        };
        const missingLabels = { "care-history": "histórico do cuidado", "milestone-mileage": "quilometragem do marco",
            "care-reference": "próxima referência conhecida", "odometer-checkpoint": "leitura atual do odômetro" };
        const reference = evaluation.evidence.reference;
        step.innerHTML = `<h2>${LABELS[CARE_ITEMS[index].id]}</h2><div class="care-feedback" role="status">
            ${unknown ? `<p>Tudo bem não lembrar. Nenhum fato foi criado por essa escolha. Quando realizar este cuidado, poderá registrar um novo marco para começar a acompanhar.</p>
                ${evaluation.evidence.careEvent ? "<p>As informações que você já havia salvo foram preservadas.</p>" : ""}` : ""}
            <p>${messages[evaluation.state]}</p>
            ${reference ? `<p>Referência informada por você: ${reference.nextDueMileage.toLocaleString("pt-BR")} km.</p>` : ""}
            ${evaluation.missingInformation.length ? `<p>Para avançar no acompanhamento: ${evaluation.missingInformation.map(key => missingLabels[key]).join(", ")}.</p>` : ""}
            <p>Este resultado acompanha registros e referências, não a condição mecânica do veículo.</p>
        </div><button class="btn btn-primary" id="care-next" type="button">${index === CARE_ITEMS.length - 1 ? "Concluir percurso" : "Próximo cuidado"}</button>`;
        document.getElementById("care-next").addEventListener("click", () => { index++; showChoice(); });
    }
    showChoice();
}

function field(name, label, type, value, readOnly) {
    return `<div class="vehicle-profile-field"><label for="care-${name}">${label}</label>
        <input class="form-control" id="care-${name}" name="${name}" type="${type}" value="${escapeText(String(value))}"
            ${type === "number" ? 'min="0" step="1" inputmode="numeric"' : "required"} ${readOnly ? "readonly" : ""}></div>`;
}

function parseMileage(value) {
    if (value === null || value === "") return null;
    return /^\d+$/.test(value) ? Number(value) : NaN;
}

function escapeText(value) {
    return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
