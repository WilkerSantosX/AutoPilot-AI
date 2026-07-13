export function renderCockpitScreen({
    userName = "Wilker",
    vehicleName = "Renault Clio 2001 RT 1.0 16V"
} = {}) {
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
                        Bom te ver, ${userName}.
                    </h1>

                    <p class="cockpit-subtitle">
                        Hoje vamos cuidar do seu
                        <strong>${vehicleName}</strong>.
                    </p>
                </header>

                <section class="cockpit-status-card">
                    <div class="cockpit-status-header">
                        <div class="cockpit-status-indicator">
                            <span class="cockpit-status-dot"></span>

                            <span>
                                Veículo estável
                            </span>
                        </div>

                        <i class="bi bi-shield-check"></i>
                    </div>

                    <h2>
                        Não encontrei nenhuma situação crítica.
                    </h2>

                    <p>
                        Com base nas informações que você compartilhou,
                        podemos seguir com tranquilidade e aprofundar
                        a análise aos poucos.
                    </p>

                    <div class="cockpit-status-footer">
                        <span>
                            <i class="bi bi-check-circle-fill"></i>
                            Análise inicial concluída
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