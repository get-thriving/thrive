import { useLocation, useMatches } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { useEffect } from "react";

import type { TelemetryConfig } from "#/core/infra/telemetry/telemetry";
import {
  setTelemetryReporter,
  TELEMETRY_CONFIG_GLOBAL,
  telemetryEnvironment,
  telemetryRelease,
} from "#/core/infra/telemetry/telemetry";

declare global {
  interface Window {
    __JUPITER_TELEMETRY__?: TelemetryConfig;
  }
}

let prepared = false;

/**
 * Start reporting from the browser.
 *
 * Called from `entry.client` before hydration, so an error thrown while
 * hydrating is still caught. The configuration comes from a global the server
 * wrote into the page, because the DSN is a deploy-time value and a client
 * bundle has no other way to learn one.
 */
export function prepareTelemetryInBrowser(): void {
  if (prepared || typeof window === "undefined") {
    return;
  }

  const config = window[TELEMETRY_CONFIG_GLOBAL];
  if (config === undefined || !config.enabled || config.dsn === null) {
    return;
  }

  prepared = true;

  Sentry.init({
    dsn: config.dsn,
    environment: telemetryEnvironment(config.deployment),
    release: telemetryRelease(config.deployment),
    // A browser DSN is public, so the page is a bad place to be generous.
    // Identity is attached deliberately, as an id, by `bindTelemetryActor`.
    sendDefaultPii: false,
    tracesSampleRate: config.tracesSampleRate,
    integrations: [
      Sentry.browserTracingIntegration({
        useEffect,
        useLocation,
        useMatches,
      }),
    ],
  });

  Sentry.setTags({
    service: config.deployment.service,
    universe: config.deployment.universe,
    env: config.deployment.env,
    instance: config.deployment.instance,
    hosting: config.deployment.hosting,
  });

  setTelemetryReporter({
    recordUnexpectedError(error: unknown, operation: string): void {
      Sentry.withScope((scope) => {
        scope.setTag("operation", operation);
        Sentry.captureException(error);
      });
    },
    bindActor(userRefId: string | null): void {
      Sentry.setUser(userRefId === null ? null : { id: userRefId });
    },
  });
}

/**
 * Note a hydration mismatch that the app recovers from by itself.
 *
 * These are self-healing - `entry.client` reloads into the render-fix route and
 * the user lands where they meant to. They are worth a breadcrumb so a later
 * failure has the context, but raising an issue for each one would bury the
 * failures nobody recovers from.
 */
export function recordHandledHydrationFailure(message: string): void {
  if (!prepared) {
    return;
  }
  Sentry.addBreadcrumb({
    category: "hydration",
    level: "warning",
    message,
  });
}
