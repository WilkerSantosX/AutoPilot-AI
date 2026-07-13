import { renderLanding } from "./screens/landingScreen.js";

import {
    renderQuestionScreen,
    bindQuestionScreenEvents
} from "./screens/questionScreen.js";

import {
    renderHeroScreen,
    bindHeroScreenEvents
} from "./screens/HeroScreen.js";

import {
    renderCockpitScreen,
    bindCockpitScreenEvents
} from "./screens/CockpitScreen.js";

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

        case "questionnaire":
            app.innerHTML = renderQuestionScreen();

            bindQuestionScreenEvents({
                onComplete: (answers) => {
                    AppState.answers = answers;
                    goToScreen("hero");
                }
            });
            break;

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
                  
        default:
            AppState.currentScreen = "landing";
            renderApp();
            break;
    }
}

export function goToScreen(screenName) {
    AppState.currentScreen = screenName;
    renderApp();
}