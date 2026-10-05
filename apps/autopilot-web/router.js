import { renderLanding } from "./screens/landingScreen.js";
import { loadVehicleProfile } from "./vehicle/vehicleStorage.js";
import { isVehicleProfile } from "./vehicle/vehicleModel.js";
import { Questions } from "./data/questions.js";
import { renderCareOnboardingScreen, bindCareOnboardingScreenEvents } from "./screens/CareOnboardingScreen.js";

import {
    renderQuestionScreen,
    bindQuestionScreenEvents,
    resetQuestionScreen
} from "./screens/questionScreen.js";

import {
    renderHeroScreen,
    bindHeroScreenEvents
} from "./screens/HeroScreen.js";

import {
    renderCockpitScreen,
    bindCockpitScreenEvents
} from "./screens/CockpitScreen.js";

import {
    renderVehicleProfileScreen,
    bindVehicleProfileScreenEvents
} from "./screens/VehicleProfileScreen.js";

export const AppState = {
    currentScreen: "landing",
    answers: {},
    answerVehicleId: null
};

export function renderApp() {
    const app = document.getElementById("app");

    if (!app) {
        console.error("Elemento #app não encontrado.");
        return;
    }

    switch (AppState.currentScreen) {
        case "care-onboarding": {
            const vehicle = loadVehicleProfile();
            if (!vehicle.ok || !vehicle.profile) {
                goToScreen("vehicle-profile");
                return;
            }
            app.innerHTML = renderCareOnboardingScreen(vehicle.profile);
            bindCareOnboardingScreenEvents(vehicle.profile);
            break;
        }
        case "landing":
            renderLanding({
                onStartDiagnosis: () => {
                    goToScreen("questionnaire");
                }
            });
            break;

        case "questionnaire": {
            const vehicle = loadVehicleProfile();
            if (!vehicle.ok || !vehicle.profile) {
                goToScreen("vehicle-profile");
                return;
            }
            AppState.answerVehicleId = vehicle.profile.id;
            app.innerHTML = renderQuestionScreen(vehicle.profile);

            bindQuestionScreenEvents({
                onChooseOther: () => goToScreen("vehicle-profile"),
                onComplete: (answers) => {
                    AppState.answers = answers;
                    goToScreen("hero");
                }
            });
            break;
        }

        case "hero": {
            if (!loadSessionContext()) return;
            app.innerHTML = renderHeroScreen();

            bindHeroScreenEvents({
                onComplete: () => {
                    if (AppState.currentScreen === "hero") goToScreen("cockpit");
                }
            });
            break;
        }

        case "cockpit": {
            const context = loadSessionContext();
            if (!context) return;
            app.innerHTML = renderCockpitScreen(context);

            bindCockpitScreenEvents();
            break;
        }

        case "vehicle-profile":
            app.innerHTML = renderVehicleProfileScreen();
            bindVehicleProfileScreenEvents({
                onSaved: () => goToScreen("questionnaire")
            });
            break;

        default:
            AppState.currentScreen = "landing";
            renderApp();
            break;
    }
}

export function goToScreen(screenName) {
    if (["questionnaire", "vehicle-profile", "landing"].includes(screenName)) {
        resetQuestionScreen();
        AppState.answers = {};
        AppState.answerVehicleId = null;
    }
    AppState.currentScreen = screenName;
    renderApp();
}

function loadSessionContext() {
    const vehicle = loadVehicleProfile();
    if (!vehicle.ok || !isVehicleProfile(vehicle.profile)) {
        goToScreen("vehicle-profile");
        return null;
    }
    const answers = AppState.answers;
    const complete = answers && typeof answers === "object" && !Array.isArray(answers)
        && Questions.every(question => {
            const answer = answers[question.id];
            return answer?.questionId === question.id
                && question.options.includes(answer.value)
                && (question.type !== "vehicle" || answer.value === "Usar este veículo")
                && typeof answer.answeredAt === "string"
                && !Number.isNaN(Date.parse(answer.answeredAt));
        });
    if (AppState.answerVehicleId !== vehicle.profile.id || !complete) {
        goToScreen("questionnaire");
        return null;
    }
    return { profile: vehicle.profile, answers };
}
