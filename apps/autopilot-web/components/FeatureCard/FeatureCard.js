export function renderFeatureCard({
    icon = "bi-star-fill",
    title = "",
    description = ""
}) {
    return `
        <div class="feature-card">
            <div class="feature-icon">
                <i class="bi ${icon}"></i>
            </div>

            <div class="feature-content">
                <h3 class="feature-title">
                    ${title}
                </h3>

                ${
                    description
                        ? `<p class="feature-description">${description}</p>`
                        : ""
                }
            </div>
        </div>
    `;
}