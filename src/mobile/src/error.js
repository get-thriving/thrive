import { prepareTelemetry, recordLaunchFailure } from "./telemetry";

/**
 * The error page is reached two ways.
 *
 * The shell sends the user here when its own handover fails, having already
 * reported why, and marks the navigation so this page stays quiet. Capacitor
 * also sends the user here by itself, through the `errorPath` in
 * `capacitor.config.ts`, whenever the WebView cannot load a URL - including
 * after a successful handover, once the WebUI is the thing that failed to
 * load. Nothing in JavaScript observes that second case, so without this the
 * most common way the app breaks for a real user leaves no trace at all.
 */

const ALREADY_REPORTED_PARAM = "reported";

prepareTelemetry();

if (!new URLSearchParams(window.location.search).has(ALREADY_REPORTED_PARAM)) {
  recordLaunchFailure(
    new Error("The WebView could not load the app"),
    "webview-load",
  );
}
