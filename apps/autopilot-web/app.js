import { goToScreen, renderApp } from "./router.js";

const requestedScreen = new URLSearchParams(window.location.search).get("screen");

if (["vehicle-profile", "care-onboarding", "care-cockpit"].includes(requestedScreen)) {
    goToScreen(requestedScreen);
} else {
    renderApp();
}
