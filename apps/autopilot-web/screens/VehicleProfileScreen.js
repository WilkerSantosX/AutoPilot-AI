import { createVehicleProfile } from "../vehicle/vehicleModel.js";
import {
    loadVehicleProfile,
    saveVehicleProfile
} from "../vehicle/vehicleStorage.js";

const FIELD_NAMES = [
    "manufacturer",
    "model",
    "year",
    "engine",
    "fuelType",
    "mileage",
    "nickname"
];

export function renderVehicleProfileScreen() {
    const maximumYear = new Date().getFullYear() + 1;

    return `
        <section class="vehicle-profile-screen">
            <div class="vehicle-profile-shell">
                <header class="vehicle-profile-header">
                    <span class="vehicle-profile-badge">Validação técnica · Missão 2.1</span>
                    <h1>Cadastre seu veículo</h1>
                    <p>Crie o contexto automotivo que será usado pelas próximas experiências do AutoPilot AI.</p>
                </header>

                <div class="vehicle-profile-current" id="vehicle-profile-current" hidden>
                    <strong>Perfil armazenado neste dispositivo</strong>
                    <span id="vehicle-profile-current-name"></span>
                </div>

                <div class="vehicle-profile-message" id="vehicle-profile-message" role="status" aria-live="polite" hidden></div>

                <form id="vehicle-profile-form" novalidate>
                    <div class="vehicle-profile-grid">
                        ${renderTextField("manufacturer", "Fabricante", "Ex.: Toyota", true)}
                        ${renderTextField("model", "Modelo", "Ex.: Corolla", true)}
                        ${renderNumberField("year", "Ano", 1886, maximumYear)}
                        ${renderTextField("engine", "Motorização", "Ex.: 2.0 16V", true)}
                        ${renderTextField("fuelType", "Combustível", "Ex.: Flex", true)}
                        ${renderNumberField("mileage", "Quilometragem atual", 0)}
                        ${renderTextField("nickname", "Apelido (opcional)", "Ex.: Meu companheiro", false, "vehicle-profile-field-wide")}
                    </div>

                    <div class="vehicle-profile-actions">
                        <a class="btn btn-outline-secondary" href="./">Voltar à aplicação</a>
                        <button class="btn btn-primary" id="vehicle-profile-submit" type="submit">
                            Salvar veículo
                        </button>
                    </div>
                </form>
            </div>
        </section>
    `;
}

export function bindVehicleProfileScreenEvents() {
    const form = document.getElementById("vehicle-profile-form");
    const submitButton = document.getElementById("vehicle-profile-submit");

    if (!form || !submitButton) {
        console.error("Formulário de veículo não encontrado.");
        return;
    }

    showPersistedProfile();

    let isSubmitting = false;

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        isSubmitting = true;
        submitButton.disabled = true;
        clearFeedback();

        const result = createVehicleProfile(
            Object.fromEntries(new FormData(form).entries())
        );

        if (!result.ok) {
            showValidationErrors(result.errors);
            showMessage("Revise os campos destacados antes de continuar.", "error");
            isSubmitting = false;
            submitButton.disabled = false;
            return;
        }

        const persistence = saveVehicleProfile(result.profile);

        if (!persistence.ok) {
            showMessage(persistence.error, "error");
            isSubmitting = false;
            submitButton.disabled = false;
            return;
        }

        showMessage("Veículo salvo com sucesso neste dispositivo.", "success");
        form.reset();
        showPersistedProfile();
        submitButton.textContent = "Veículo salvo";
    });
}

function renderTextField(name, label, placeholder, required, className = "") {
    return `
        <div class="vehicle-profile-field ${className}">
            <label for="vehicle-${name}">${label}${required ? " *" : ""}</label>
            <input
                class="form-control"
                id="vehicle-${name}"
                name="${name}"
                type="text"
                placeholder="${placeholder}"
                ${required ? "required" : ""}
                aria-describedby="vehicle-${name}-error"
            />
            <span class="vehicle-profile-error" id="vehicle-${name}-error"></span>
        </div>
    `;
}

function renderNumberField(name, label, minimum, maximum = null) {
    return `
        <div class="vehicle-profile-field">
            <label for="vehicle-${name}">${label} *</label>
            <input
                class="form-control"
                id="vehicle-${name}"
                name="${name}"
                type="number"
                min="${minimum}"
                ${maximum ? `max="${maximum}"` : ""}
                step="1"
                inputmode="numeric"
                required
                aria-describedby="vehicle-${name}-error"
            />
            <span class="vehicle-profile-error" id="vehicle-${name}-error"></span>
        </div>
    `;
}

function clearFeedback() {
    FIELD_NAMES.forEach(field => {
        const input = document.getElementById(`vehicle-${field}`);
        const error = document.getElementById(`vehicle-${field}-error`);

        input?.removeAttribute("aria-invalid");
        if (error) error.textContent = "";
    });

    const message = document.getElementById("vehicle-profile-message");
    if (message) message.hidden = true;
}

function showValidationErrors(errors) {
    Object.entries(errors).forEach(([field, text]) => {
        const input = document.getElementById(`vehicle-${field}`);
        const error = document.getElementById(`vehicle-${field}-error`);

        input?.setAttribute("aria-invalid", "true");
        if (error) error.textContent = text;
    });

    const firstInvalidField = Object.keys(errors)[0];
    document.getElementById(`vehicle-${firstInvalidField}`)?.focus();
}

function showMessage(text, type) {
    const message = document.getElementById("vehicle-profile-message");
    if (!message) return;

    message.textContent = text;
    message.className = `vehicle-profile-message vehicle-profile-message-${type}`;
    message.hidden = false;
}

function showPersistedProfile() {
    const result = loadVehicleProfile();

    if (!result.ok) {
        showMessage(result.error, "error");
        return;
    }

    if (!result.profile) return;

    const container = document.getElementById("vehicle-profile-current");
    const name = document.getElementById("vehicle-profile-current-name");

    if (container && name) {
        name.textContent = formatVehicleName(result.profile);
        container.hidden = false;
    }
}

function formatVehicleName(profile) {
    return `${profile.manufacturer} ${profile.model} · ${profile.year}`;
}
