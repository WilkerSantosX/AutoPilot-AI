const LABELS = { "engine-oil": "Óleo do motor", cooling: "Arrefecimento", "basic-review": "Revisão básica" };
const STATES = { "attention-needed": "Referência atingida", "due-soon": "Referência se aproximando",
    "up-to-date": "Dentro da referência", "insufficient-information": "Informação a completar" };
const SUMMARY = {
    "attention-needed": "Há referência informada por você que já foi atingida. Priorize a ação em relação a ela.",
    "due-soon": "Há referência se aproximando. Prepare-se para ela.",
    "insufficient-information": "Precisamos de mais informações para posicionar alguns cuidados.",
    "up-to-date": "Os três cuidados estão antes da faixa de atenção das referências informadas. Continue acompanhando."
};
const MISSING = { "care-history": "histórico do cuidado", "milestone-mileage": "quilometragem do marco",
    "care-reference": "próxima referência conhecida", "odometer-checkpoint": "leitura do odômetro que posicione o marco" };

export function renderCareCockpitContent(result) {
    if (!result.ok) return `<section class="care-cockpit" aria-labelledby="care-title"><h2 id="care-title">Cuidados do veículo</h2>
        <p role="alert">Não foi possível carregar o acompanhamento. ${escapeText(result.error)} Os dados existentes foram preservados.</p>
        <a class="care-link" href="./?screen=care-cockpit">Tentar carregar novamente</a></section>`;
    return `<section class="care-cockpit" aria-labelledby="care-title">
        <span class="cockpit-section-label">Vehicle Care</span><h2 id="care-title">Existe algo a fazer agora?</h2>
        <p class="care-summary">${SUMMARY[result.priority]}</p>
        <p>Acompanhamos fatos e referências informadas por você; este resultado não avalia a condição mecânica.</p>
        <a class="care-link" href="./?screen=care-onboarding">Completar informações dos cuidados</a>
        <div class="care-grid">${result.items.map(renderItem).join("")}</div>
    </section>`;
}

function renderItem(item) {
    const { careEvent, odometerCheckpoint, reference } = item.evidence;
    const next = describeNextAction(item.nextAction);
    const canComplete = item.nextAction.type === "update-mileage"
        || (item.nextAction.type === "provide-information" && item.nextAction.information !== "milestone-mileage");
    const distance = item.remainingMileage === null ? ""
        : item.remainingMileage > 0 ? `${km(item.remainingMileage)} até a referência, pela última leitura informada.`
            : item.remainingMileage === 0 ? "A última leitura está na referência."
                : `${km(-item.remainingMileage)} além da referência, pela última leitura informada.`;
    return `<article class="care-item care-${item.state}" aria-labelledby="care-${item.careItemId}-title">
        <span class="care-state">${STATES[item.state]}</span><h3 id="care-${item.careItemId}-title">${LABELS[item.careItemId]}</h3>
        <p><strong>Próximo passo:</strong> ${next}</p>
        ${item.missingInformation.length ? `<p>Falta: ${item.missingInformation.map(key => MISSING[key]).join(", ")}.</p>` : ""}
        <dl>
            ${careEvent ? `<dt>Marco registrado</dt><dd>${escapeText(careEvent.occurredAt.slice(0, 10))} · ${careEvent.mileage === null ? "quilometragem desconhecida" : km(careEvent.mileage)}</dd>` : ""}
            ${odometerCheckpoint ? `<dt>Última leitura informada</dt><dd>${km(odometerCheckpoint.mileage)} · ${escapeText(odometerCheckpoint.occurredAt.slice(0, 10))}</dd>` : ""}
            ${reference ? `<dt>Referência informada por você</dt><dd>${km(reference.nextDueMileage)} — origem: usuário</dd>` : ""}
        </dl>${distance ? `<p class="care-distance">${distance}</p>` : ""}
        ${canComplete ? `<a class="care-link" href="./?screen=care-onboarding">Completar ${LABELS[item.careItemId].toLowerCase()} no percurso de cuidados</a>` : ""}
    </article>`;
}

export function describeNextAction(action) {
    if (action.type === "monitor") return "Continue acompanhando a referência informada.";
    if (action.type === "prepare-for-reference") return "Prepare-se para a referência informada que se aproxima.";
    if (action.type === "act-on-reference") return "Aja em relação à referência informada. Após realizar o cuidado, será necessário registrar um novo marco; esse fluxo ainda não está disponível no cockpit.";
    if (action.type === "update-mileage") return "Informe uma leitura do odômetro no onboarding, usando o marco já salvo.";
    if (action.information === "milestone-mileage") return "Precisamos da quilometragem do marco. O marco salvo não pode ser editado neste fluxo; complemente o histórico somente quando souber. Um novo marco após manutenção dependerá do fluxo futuro.";
    if (action.information === "care-reference") return "Informe a próxima referência que você já conhece, usando o marco salvo no onboarding. Se não souber, mantenha a lacuna.";
    return "Informe o histórico quando souber. Se não lembrar, pode continuar sem inventar fatos; um novo marco após realizar o cuidado dependerá do fluxo futuro.";
}

function km(value) { return `${value.toLocaleString("pt-BR")} km`; }
function escapeText(value) {
    return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
