export function renderCockpitScreen({ profile, answers }) {
    const vehicleName = escapeText(`${profile.manufacturer} ${profile.model} · ${profile.year} · ${profile.engine}`);
    const actions = [
        {
            icon: "bi-tools",
            title: "Diagnóstico inteligente",
            description: "Seu carro está estranho? Vamos entender juntos."
        },
        {
            icon: "bi-calendar-check-fill",
            title: "Plano de manutenção",
            description: "Organize revisões e evite surpresas."
        },
        {
            icon: "bi-book-half",
            title: "Aprender sobre meu carro",
            description: "Entenda mecânica sem linguagem complicada."
        },
        {
            icon: "bi-clock-history",
            title: "Histórico",
            description: "Relembre tudo o que já aconteceu com seu veículo."
        }
    ];

    return `
        <section class="cockpit-screen">
            <div class="cockpit-container">

                <header class="cockpit-header">
                    <div class="cockpit-brand">
                        <div class="cockpit-brand-icon">
                            <i class="bi bi-car-front-fill"></i>
                        </div>

                        <span>AutoPilot AI</span>
                    </div>

                    <p class="cockpit-eyebrow">
                        Seu copiloto automotivo
                    </p>

                    <h1 class="cockpit-title">
                        Bom te ver por aqui.
                    </h1>

                    <p class="cockpit-subtitle">
                        Hoje vamos cuidar do seu
                        <strong>${vehicleName}</strong>.
                    </p>
                    <p class="cockpit-subtitle">Quilometragem informada: ${escapeText(profile.mileage)} km</p>
                    ${profile.nickname ? `<p class="cockpit-subtitle">Apelido: ${escapeText(profile.nickname)}</p>` : ""}
                </header>

                <section class="cockpit-status-card">
                    <div class="cockpit-status-header">
                        <div class="cockpit-status-indicator">
                            <span class="cockpit-status-dot"></span>

                            <span>
                                Informações recebidas
                            </span>
                        </div>

                        <i class="bi bi-card-text"></i>
                    </div>

                    <h2>
                        Suas respostas estão organizadas.
                    </h2>

                    <p>
                        Objetivo: <strong>${escapeText(answers[2].value)}</strong>
                    </p>
                    <p>Urgência declarada: <strong>${escapeText(answers[3].value)}</strong></p>
                    <p>A urgência foi informada por você e não é uma classificação mecânica.
                        Este resumo organiza suas informações e não constitui diagnóstico do veículo.</p>

                    <div class="cockpit-status-footer">
                        <span>
                            <i class="bi bi-check-circle-fill"></i>
                            Resumo da sessão preparado
                        </span>
                    </div>
                </section>

                <section class="cockpit-actions-section">
                    <div class="cockpit-section-heading">
                        <div>
                            <span class="cockpit-section-label">
                                Próximo passo
                            </span>

                            <h2>
                                Por onde começamos?
                            </h2>
                        </div>
                    </div>

                    <div class="cockpit-actions-grid">
                        ${actions.map(action => `
                            <button
                                type="button"
                                class="cockpit-action-card"
                            >
                                <div class="cockpit-action-icon">
                                    <i class="bi ${action.icon}"></i>
                                </div>

                                <div class="cockpit-action-content">
                                    <h3>${action.title}</h3>
                                    <p>${action.description}</p>
                                </div>

                                <i class="bi bi-arrow-right cockpit-action-arrow"></i>
                            </button>
                        `).join("")}
                    </div>
                </section>

                <section class="cockpit-insight-card">
                    <div class="cockpit-insight-icon">
                        <i class="bi bi-chat-dots-fill"></i>
                    </div>

                    <div class="cockpit-insight-content">
                        <span class="cockpit-section-label">
                            Dica do AutoPilot
                        </span>

                        <h2>
                            Quer conhecer melhor o seu carro?
                        </h2>

                        <p>
                            Posso ensinar como identificar sinais de desgaste
                            antes que eles se transformem em problemas maiores.
                        </p>

                        <button
                            type="button"
                            class="cockpit-insight-button"
                        >
                            Ver dica
                            <i class="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </section>

                <footer class="cockpit-footer">
                    <i class="bi bi-stars"></i>

                    <p>
                        Quanto melhor eu conhecer seu carro,
                        melhor poderei ajudar você a cuidar dele.
                    </p>
                </footer>

            </div>
        </section>
    `;
}

function escapeText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[character]);
}

export function bindCockpitScreenEvents() {
    const actionCards = document.querySelectorAll(
        ".cockpit-action-card"
    );

    const insightButton = document.querySelector(
        ".cockpit-insight-button"
    );

    actionCards.forEach(card => {
        card.addEventListener("click", () => {
            console.log(
                "Módulo selecionado:",
                card.innerText.trim()
            );
        });
    });

    if (insightButton) {
        insightButton.addEventListener("click", () => {
            console.log("Dica do AutoPilot selecionada.");
        });
    }
}