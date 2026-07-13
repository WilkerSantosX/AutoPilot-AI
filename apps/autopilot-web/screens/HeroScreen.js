const heroSteps = [
    {
        label: "Organizando suas respostas...",
        progress: 20
    },
    {
        label: "Entendendo sua necessidade...",
        progress: 45
    },
    {
        label: "Analisando o contexto do veículo...",
        progress: 70
    },
    {
        label: "Preparando uma orientação personalizada...",
        progress: 92
    },
    {
        label: "Análise concluída.",
        progress: 100
    }
];

export function renderHeroScreen() {
    return `
        <section class="hero-moment-screen">
            <div class="hero-moment-card">

                <div class="hero-moment-icon">
                    <i class="bi bi-cpu-fill"></i>
                </div>

                <span class="hero-moment-brand">
                    AutoPilot AI
                </span>

                <h1 class="hero-moment-title">
                    Estou analisando tudo para você.
                </h1>

                <p
                    class="hero-moment-status"
                    id="heroMomentStatus"
                    aria-live="polite"
                >
                    Iniciando análise...
                </p>

                <div
                    class="hero-moment-progress"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="0"
                >
                    <div
                        class="hero-moment-progress-bar"
                        id="heroMomentProgressBar"
                    ></div>
                </div>

                <p class="hero-moment-final-message" id="heroMomentFinalMessage">
                    Entendido. Já sei como posso ajudar.
                </p>

            </div>
        </section>
    `;
}

export function bindHeroScreenEvents({
    onComplete
} = {}) {
    const statusElement = document.getElementById("heroMomentStatus");
    const progressElement = document.getElementById(
        "heroMomentProgressBar"
    );
    const progressContainer = document.querySelector(
        ".hero-moment-progress"
    );
    const finalMessage = document.getElementById(
        "heroMomentFinalMessage"
    );

    if (
        !statusElement ||
        !progressElement ||
        !progressContainer ||
        !finalMessage
    ) {
        return;
    }

    let currentStepIndex = 0;
    let animationInterval = null;

    function showNextStep() {
        const step = heroSteps[currentStepIndex];

        statusElement.textContent = step.label;
        progressElement.style.width = `${step.progress}%`;

        progressContainer.setAttribute(
            "aria-valuenow",
            step.progress.toString()
        );

        currentStepIndex++;

        if (currentStepIndex >= heroSteps.length) {
            window.clearInterval(animationInterval);

            window.setTimeout(() => {
                finalMessage.classList.add("visible");

                window.setTimeout(() => {
                    if (typeof onComplete === "function") {
                        onComplete();
                    }
                }, 1400);
            }, 500);
        }
    }

    showNextStep();

    animationInterval = window.setInterval(
        showNextStep,
        700
    );
}