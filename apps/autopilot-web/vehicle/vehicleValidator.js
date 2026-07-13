const REQUIRED_TEXT_FIELDS = [
    "manufacturer",
    "model",
    "engine",
    "fuelType"
];

export function normalizeVehicleInput(input = {}) {
    return {
        manufacturer: normalizeText(input.manufacturer),
        model: normalizeText(input.model),
        year: normalizeNumber(input.year),
        engine: normalizeText(input.engine),
        fuelType: normalizeText(input.fuelType),
        mileage: normalizeNumber(input.mileage),
        nickname: normalizeText(input.nickname) || null
    };
}

export function validateVehicleInput(input = {}, currentYear = new Date().getFullYear()) {
    const value = normalizeVehicleInput(input);
    const errors = {};

    REQUIRED_TEXT_FIELDS.forEach(field => {
        if (!value[field]) {
            errors[field] = requiredFieldMessage(field);
        }
    });

    if (!Number.isInteger(value.year)) {
        errors.year = "Informe um ano válido, usando um número inteiro.";
    } else if (value.year < 1886) {
        errors.year = "O ano não pode ser anterior a 1886.";
    } else if (value.year > currentYear + 1) {
        errors.year = `O ano não pode ser posterior a ${currentYear + 1}.`;
    }

    if (!Number.isInteger(value.mileage)) {
        errors.mileage = "Informe a quilometragem usando um número inteiro.";
    } else if (value.mileage < 0) {
        errors.mileage = "A quilometragem não pode ser negativa.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        value,
        errors
    };
}

function normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value) {
    if (value === "" || value === null || value === undefined) {
        return Number.NaN;
    }

    return typeof value === "number" ? value : Number(value);
}

function requiredFieldMessage(field) {
    const labels = {
        manufacturer: "fabricante",
        model: "modelo",
        engine: "motorização",
        fuelType: "tipo de combustível"
    };

    return `Informe ${labels[field]}.`;
}
