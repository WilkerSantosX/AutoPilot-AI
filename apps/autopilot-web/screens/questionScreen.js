import { Questions } from "../data/questions.js";
import { loadVehicleProfile } from "../vehicle/vehicleStorage.js";

import {
    createQuestionEngine
} from "../engine/questionEngine.js";

import {
    renderQuestionCard
} from "../components/QuestionCard/QuestionCard.js";

const questionEngine = createQuestionEngine(Questions);

let selectedAnswer = null;
let currentOnComplete = null;
let currentOnChooseOther = null;

export function resetQuestionScreen() {
    questionEngine.reset();
    selectedAnswer = null;
}

export function renderQuestionScreen(profile = loadVehicleProfile().profile) {
    const question = questionEngine.getCurrentQuestion();

    if (!question) {
        return `
            <section class="question-screen">
                <p>Nenhuma pergunta disponível.</p>
            </section>
        `;
    }

    const savedAnswer = questionEngine.getAnswer(question.id);

    selectedAnswer = savedAnswer
        ? savedAnswer.value
        : null;

    const currentQuestionNumber =
        questionEngine.getCurrentIndex() + 1;

    const totalQuestions =
        questionEngine.getTotalQuestions();

    const progress =
        questionEngine.getProgress();

    return renderQuestionCard({
        title: question.title,
        subtitle: question.subtitle,
        content: `
            <div class="question-options">
                ${question.options.map(option => `
                    <button
                        type="button"
                        class="question-option ${
                            selectedAnswer === option
                                ? "selected"
                                : ""
                        }"
                        data-answer="${option}"
                    >
                        ${question.type === "vehicle" && option === "Usar este veículo" && profile
                            ? escapeText(`${profile.manufacturer} ${profile.model} · ${profile.year} · ${profile.engine}`)
                            : option}
                    </button>
                `).join("")}
            </div>

            ${question.type === "vehicle" && profile ? `<p><a href="./?screen=care-onboarding">Começar a acompanhar cuidados deste veículo</a></p>` : ""}

            <div class="question-footer">
                <div class="question-progress">
                    <div class="question-progress-header">
                        <span>
                            Pergunta ${currentQuestionNumber}
                            de ${totalQuestions}
                        </span>

                        <span>${progress}%</span>
                    </div>

                    <div class="question-progress-track">
                        <div
                            class="question-progress-bar"
                            style="width: ${progress}%;"
                        ></div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        id="btn-back-question"
                        ${
                            questionEngine.canGoBack()
                                ? ""
                                : "disabled"
                        }
                    >
                        Voltar
                    </button>

                    <button
                        type="button"
                        class="btn btn-primary"
                        id="btn-next-question"
                        ${selectedAnswer ? "" : "disabled"}
                    >
                        ${
                            questionEngine.isLastQuestion()
                                ? "Finalizar"
                                : "Continuar"
                        }
                    </button>
                </div>
            </div>
        `
    });
}

export function bindQuestionScreenEvents({
    onComplete,
    onChooseOther
} = {}) {
    currentOnComplete = onComplete;
    currentOnChooseOther = onChooseOther;

    const optionButtons =
        document.querySelectorAll(".question-option");

    const nextButton =
        document.getElementById("btn-next-question");

    const backButton =
        document.getElementById("btn-back-question");

    optionButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (questionEngine.getCurrentQuestion()?.type === "vehicle"
                && button.dataset.answer === "Escolher outro") {
                currentOnChooseOther?.();
                return;
            }
            selectedAnswer = button.dataset.answer;

            optionButtons.forEach(optionButton => {
                optionButton.classList.remove("selected");
            });

            button.classList.add("selected");

            if (nextButton) {
                nextButton.disabled = false;
            }
        });
    });

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            handleNextQuestion();
        });
    }

    if (backButton) {
        backButton.addEventListener("click", () => {
            handlePreviousQuestion();
        });
    }
}

function handleNextQuestion() {
    if (!selectedAnswer) {
        return;
    }

    questionEngine.answerCurrentQuestion(
        selectedAnswer
    );

    if (questionEngine.isLastQuestion()) {
        const answers =
            questionEngine.getAllAnswers();

        console.log(
            "Fluxo finalizado:",
            answers
        );

        if (typeof currentOnComplete === "function") {
            currentOnComplete(answers);
        }

        return;
    }

    questionEngine.goNext();
    updateQuestionScreen();
}

function handlePreviousQuestion() {
    if (!questionEngine.canGoBack()) {
        return;
    }

    questionEngine.goBack();
    updateQuestionScreen();
}

function updateQuestionScreen() {
    const app = document.getElementById("app");

    if (!app) {
        console.error("Elemento #app não encontrado.");
        return;
    }

    app.innerHTML = renderQuestionScreen();

    bindQuestionScreenEvents({
        onComplete: currentOnComplete,
        onChooseOther: currentOnChooseOther
    });
}

function escapeText(value) {
    return value.replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[character]);
}
