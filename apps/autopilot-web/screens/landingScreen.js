import { renderAutoCard } from "../components/AutoCard/AutoCard.js";
import { renderFeatureCard } from "../components/FeatureCard/FeatureCard.js";

export function renderLanding({
    onStartDiagnosis
} = {}) {
    const app = document.getElementById("app");

    if (!app) {
        console.error("Elemento #app não encontrado.");
        return;
    }

    const features = [
        {
            icon: "bi-unlock-fill",
            title: "Sem criar conta"
        },
        {
            icon: "bi-mortarboard-fill",
            title: "Perfil salvo neste dispositivo"
        },
        {
            icon: "bi-cpu-fill",
            title: "Resumo das suas respostas"
        }
    ];

    app.innerHTML = `
        <section class="hero-screen d-flex align-items-center">
            <div class="container">
                <div class="hero-shell text-center">

                    <div class="hud-line"></div>

                    <div class="brand-badge">
                        <i class="bi bi-car-front-fill"></i>
                        AutoPilot AI
                    </div>

                    <h1 class="hero-title">
                        Seu veículo.<br>
                        Suas respostas.<br>
                        Seu cockpit.
                    </h1>

                    <p class="hero-subtitle">
                        Cadastre seu veículo e organize seu objetivo e sua urgência
                        em um resumo. Esta experiência não realiza diagnóstico automotivo.
                    </p>

                    <button
                        class="btn btn-ignition"
                        id="startDiagnosisButton"
                        type="button"
                    >
                        <i class="bi bi-lightning-charge-fill me-2"></i>
                        Iniciar minha jornada
                    </button>

                    <div class="benefits-grid">
                        <div class="row g-3 justify-content-center">
                            ${features.map(feature => `
                                <div class="col-12 col-md-4">
                                    ${renderFeatureCard({
                                        icon: feature.icon,
                                        title: feature.title
                                    })}
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    ${renderAutoCard({
                        title: "Auto",
                        message: "Vamos organizar suas informações juntos.",
                        icon: "bi-chat-dots-fill"
                    })}

                </div>
            </div>
        </section>
    `;

    const startButton = document.getElementById(
        "startDiagnosisButton"
    );

    if (!startButton) {
        console.error(
            "Botão #startDiagnosisButton não encontrado."
        );
        return;
    }

    startButton.addEventListener("click", () => {
        if (typeof onStartDiagnosis === "function") {
            onStartDiagnosis();
            return;
        }

        console.error(
            "Callback onStartDiagnosis não foi informado."
        );
    });
}