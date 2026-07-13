export function renderQuestionCard({
    title = "",
    subtitle = "",
    content = ""
}) {
    return `
        <div class="question-card text-start">
            <h2 class="question-title">${title}</h2>

            ${
                subtitle
                    ? `<p class="question-subtitle">${subtitle}</p>`
                    : ""
            }

            <div class="question-content">
                ${content}
            </div>
        </div>
    `;
}