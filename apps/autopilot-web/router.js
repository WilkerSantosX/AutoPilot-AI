import { renderLanding } from "./screens/landingScreen.js";
import { loadVehicleProfile } from "./vehicle/vehicleStorage.js";

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
    answers: {}
};

export function renderApp() {
    const app = document.getElementById("app");

    if (!app) {
        console.error("Elemento #app não encontrado.");
        return;
    }

    switch (AppState.currentScreen) {
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

        case "hero":
            app.innerHTML = renderHeroScreen();

            bindHeroScreenEvents({
                onComplete: () => {
                    goToScreen("cockpit");
                }
            });
            break;

        case "cockpit":
            app.innerHTML = renderCockpitScreen({
                userName: "Wilker",
                vehicleName: "Renault Clio 2001 RT 1.0 16V"
            });

            bindCockpitScreenEvents();
            break;

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
    if (screenName === "questionnaire") {
        resetQuestionScreen();
        AppState.answers = {};
    }
    AppState.currentScreen = screenName;
    renderApp();
}
