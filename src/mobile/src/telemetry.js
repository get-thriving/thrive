import { Capacitor } from "@capacitor/core";
import * as Sentry from "@sentry/browser";

/**
 * Reporting for the native shell, which is a launcher and nothing more.
 *
 * The shell shows a splash, then navigates the WebView to the hosted WebUI.
 * Once that navigation succeeds the WebUI's own reporting takes over and this
 * page is gone. So the only thing this module exists to report is the shell
 * failing to hand over - an app that will not start, which is the worst thing
 * that can happen to a mobile user and, until now, the thing nobody could see.
 *
 * It reports under its own `service` tag so a launch failure is never confused
 * with a failure inside the app (see ADR 0012).
 */

const PLACEHOLDER_DSN = "FAKEFAKE";

let prepared = false;

function isEnabled() {
  const dsn = window.SENTRY_PUBLIC_DSN;
  return (
    window.TELEMETRY === "sentry" &&
    typeof dsn === "string" &&
    dsn !== "" &&
    dsn !== PLACEHOLDER_DSN
  );
}

export function prepareTelemetry() {
  if (prepared || !isEnabled()) {
    return;
  }

  prepared = true;

  Sentry.init({
    dsn: window.SENTRY_PUBLIC_DSN,
    environment: `${window.UNIVERSE}-${window.ENV}`,
    // The store pins which build a user is on, so a launch failure correlates
    // with the shipped version rather than with whatever the WebUI is serving.
    release: `thrive@${window.CLIENT_VERSION}`,
    sendDefaultPii: false,
    // The shell is three files and one navigation. There is no journey here
    // worth a transaction, only whether the handover happened.
    tracesSampleRate: 0,
    // Every launch of the app would otherwise open and immediately abandon a
    // session lasting about a second, which says nothing and is billed per
    // launch. The session that means anything starts once the WebUI loads.
    integrations: (defaults) =>
      defaults.filter((integration) => integration.name !== "BrowserSession"),
  });

  Sentry.setTags({
    service: "mobile-shell",
    universe: window.UNIVERSE,
    env: window.ENV,
    app_platform: Capacitor.getPlatform(),
    client_version: window.CLIENT_VERSION,
  });
}

/**
 * The shell could not hand over to the WebUI.
 *
 * Always unexpected: there is no such thing as a launch the user meant to fail.
 * A device that is simply offline lands here too, which is intended - a spike
 * of these is how an outage in the hosted WebUI first becomes visible on mobile.
 */
export function recordLaunchFailure(error, operation) {
  console.error(`Unexpected error in ${operation}:`, error);
  if (!prepared) {
    return;
  }
  Sentry.withScope((scope) => {
    scope.setTag("operation", operation);
    Sentry.captureException(
      error instanceof Error ? error : new Error(String(error)),
    );
  });
}
