import * as Sentry from "@sentry/remix";

import { GLOBAL_PROPERTIES } from "#/core/config-server";
import { isUnexpectedError } from "#/core/infra/errors";
import type {
  TelemetryConfig,
  TelemetryDeployment,
} from "#/core/infra/telemetry/telemetry";
import {
  buildTelemetryDeployment,
  isTelemetryEnabled,
  shouldLogToConsole,
  telemetryEnvironment,
  telemetryRelease,
  TRACES_SAMPLE_RATE,
} from "#/core/infra/telemetry/telemetry";

// Render polls this constantly and it carries no signal.
const UNSAMPLED_ROUTES = ["/healthz"];

let deployment: TelemetryDeployment | null = null;
let enabled = false;

function publicDsn(): string | null {
  return process.env.SENTRY_PUBLIC_DSN ?? null;
}

/**
 * Start reporting from the Node server, and describe the deployment doing it.
 *
 * Called once from each app's config module, next to the startup banner, so
 * that a service says what it is in the logs and in telemetry with one call.
 */
export function prepareTelemetryOnServer(service: string): void {
  if (deployment !== null) {
    return;
  }

  deployment = buildTelemetryDeployment(GLOBAL_PROPERTIES, service);

  const dsn = publicDsn();
  enabled = isTelemetryEnabled(GLOBAL_PROPERTIES.telemetry, dsn);
  if (!enabled || dsn === null) {
    return;
  }

  Sentry.init({
    dsn,
    environment: telemetryEnvironment(deployment),
    release: telemetryRelease(deployment),
    serverName: `${deployment.service}@${deployment.instance}`,
    // Identity is attached deliberately, as an id. The default would add IP
    // addresses, headers and request bodies - and this app holds journals.
    sendDefaultPii: false,
    tracesSampleRate: TRACES_SAMPLE_RATE,
    tracesSampler: (context) => {
      const name = context.name ?? "";
      return UNSAMPLED_ROUTES.some((route) => name.includes(route))
        ? 0
        : TRACES_SAMPLE_RATE;
    },
  });

  Sentry.setTags({
    service: deployment.service,
    universe: deployment.universe,
    env: deployment.env,
    instance: deployment.instance,
    hosting: deployment.hosting,
  });
}

/** What the browser needs to report, for the server to serialise into the page. */
export function buildTelemetryConfig(service: string): TelemetryConfig {
  const dsn = publicDsn();
  return {
    enabled: isTelemetryEnabled(GLOBAL_PROPERTIES.telemetry, dsn),
    dsn,
    deployment: buildTelemetryDeployment(GLOBAL_PROPERTIES, service),
    tracesSampleRate: TRACES_SAMPLE_RATE,
  };
}

export function recordExpectedErrorOnServer(
  error: unknown,
  operation: string,
): void {
  if (shouldLogToConsole(GLOBAL_PROPERTIES.env)) {
    console.info(`Expected error in ${operation}:`, error);
  }
  if (!enabled) {
    return;
  }
  Sentry.addBreadcrumb({
    category: "expected-error",
    level: "info",
    message: `${operation}: ${String(error)}`,
  });
}

export function recordUnexpectedErrorOnServer(
  error: unknown,
  operation: string,
): void {
  // Always logged, in every blend: Render captures stdout, and telemetry is an
  // additional sink rather than a replacement for it.
  console.error(`Unexpected error in ${operation}:`, error);
  if (!enabled) {
    return;
  }
  Sentry.withScope((scope) => {
    scope.setTag("operation", operation);
    Sentry.captureException(error);
  });
}

/**
 * Classify whatever a loader, an action, or the renderer threw, and report only
 * what is ours to fix (see ADR 0012).
 *
 * Remix hands every such failure to the `handleError` export, which makes this
 * the one place that sees all of them.
 */
export function recordErrorOnServer(error: unknown, operation: string): void {
  if (isUnexpectedError(error)) {
    recordUnexpectedErrorOnServer(error, operation);
  } else {
    recordExpectedErrorOnServer(error, operation);
  }
}
