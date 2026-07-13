function renderQuestionnaireScreen() {
    const question = Questions[AppState.currentQuestion];

    const optionsHtml = question.options.map(option => `
        <button class="btn btn-ignition w-100 question-option">
            ${option}
        </button>
    `).join("");

    app.innerHTML = `
        <section class="hero-screen d-flex align-items-center">
            <div class="container">
                <div class="hero-shell text-center">

                    <div class="hud-line"></div>

                    ${renderAutoCard({
                        title: "Auto",
                        message: "Vamos começar. Primeiro quero conhecer o carro que vamos analisar.",
                        icon: "bi-chat-dots-fill"
                    })}

                    ${renderQuestionCard({
                        title: question.title,
                        subtitle: question.subtitle,
                        content: optionsHtml
                    })}

                    <div class="mt-4 text-center">
                        <button class="btn btn-link" onclick="goToScreen('landing')">
                            Voltar para início
                        </button>
                    </div>

                </div>
            </div>
        </section>
    `;
}