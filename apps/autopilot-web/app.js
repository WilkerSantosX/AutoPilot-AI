import { goToScreen, renderApp } from "./router.js";

const requestedScreen = new URLSearchParams(window.location.search).get("screen");

if (["vehicle-profile", "care-onboarding"].includes(requestedScreen)) {
    goToScreen(requestedScreen);
} else {
    renderApp();
}
