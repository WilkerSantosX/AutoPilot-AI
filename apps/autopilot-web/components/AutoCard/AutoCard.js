export function renderAutoCard({
  title = "Auto",
  message = "Vamos descobrir isso juntos.",
  icon = "bi-chat-dots-fill"
}) {
  return `
    <div class="auto-card d-flex align-items-center text-start gap-3">
      <div class="auto-avatar">
        <i class="bi ${icon}"></i>
      </div>

      <div>
        <p class="auto-name">${title}</p>
        <p class="auto-text">${message}</p>
      </div>
    </div>
  `;
}