import { loadCareCockpit } from "../vehicle/careCockpit.js";
import { renderCareCockpitContent } from "./careCockpitContent.js";

export function renderCockpitScreen({ profile, answers }) {
    const vehicleName = escapeText(`${profile.manufacturer} ${profile.model} · ${profile.year} · ${profile.engine}`);
    const actions = [
        {
            icon: "bi-tools",
            title: "Diagnóstico inteligente",
            description: "Capacidade futura, ainda indisponível."
        },
        {
            icon: "bi-calendar-check-fill",
            title: "Plano de manutenção",
            description: "Planejamento de revisões ainda indisponível."
        },
        {
            icon: "bi-book-half",
            title: "Aprender sobre meu carro",
            description: "Conteúdo educativo ainda indisponível."
        },
        {
            icon: "bi-clock-history",
            title: "Histórico",
            description: "Consulta completa do histórico ainda indisponível."
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
                        Seu contexto automotivo
                    </p>

                    <h1 class="cockpit-title">
                        Bom te ver por aqui.
                    </h1>

                    <p class="cockpit-subtitle">
                        Este é o resumo da sua jornada com o
                        <strong>${vehicleName}</strong>.
                    </p>
                    <p class="cockpit-subtitle">Quilometragem informada: ${escapeText(profile.mileage)} km (no cadastro)</p>
                    ${profile.nickname ? `<p class="cockpit-subtitle">Apelido: ${escapeText(profile.nickname)}</p>` : ""}
                </header>

                ${renderCareCockpitContent(loadCareCockpit(profile.id))}

                ${answers ? `<section class="cockpit-status-card">
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

                ` : `<p><a class="care-link" href="./">Acessar a jornada de perguntas</a></p>`}

                <section class="cockpit-actions-section">
                    <div class="cockpit-section-heading">
                        <div>
                            <span class="cockpit-section-label">
                                Capacidades futuras
                            </span>

                            <h2>
                                Ainda indisponíveis
                            </h2>
                        </div>
                    </div>

                    <div class="cockpit-actions-grid">
                        ${actions.map(action => `
                            <button
                                type="button"
                                class="cockpit-action-card"
                                disabled
                            >
                                <div class="cockpit-action-icon">
                                    <i class="bi ${action.icon}"></i>
                                </div>

                                <div class="cockpit-action-content">
                                    <h3>${action.title}</h3>
                                    <span class="cockpit-section-label">Em breve</span>
                                    <p>${action.description}</p>
                                </div>

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
                            Conteúdo futuro
                        </span>

                        <h2>
                            Quer conhecer melhor o seu carro?
                        </h2>

                        <p>
                            Dicas educativas são uma capacidade futura e ainda não estão disponíveis.
                        </p>

                        <button
                            type="button"
                            class="cockpit-insight-button"
                            disabled
                        >
                            Dicas — em breve
                        </button>
                    </div>
                </section>

                <footer class="cockpit-footer">
                    <i class="bi bi-stars"></i>

                    <p>
                        O perfil do veículo fica salvo neste dispositivo.
                        As respostas são desta sessão e precisam ser refeitas ao recarregar.
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