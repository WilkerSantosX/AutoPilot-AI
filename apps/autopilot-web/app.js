import { goToScreen, renderApp } from "./router.js";

const requestedScreen = new URLSearchParams(window.location.search).get("screen");

if (requestedScreen === "vehicle-profile") {
    goToScreen("vehicle-profile");
} else {
    renderApp();
}
