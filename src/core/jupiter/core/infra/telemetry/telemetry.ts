import { Env, JupiterTelemetry } from "@jupiter/webapi-client";
import { useEffect } from "react";

import { getHosting } from "#/core/universe";
import type { GlobalPropertiesClient } from "#/core/config-client";
import type { GlobalPropertiesServer } from "#/core/config-server";
import { isUnexpectedError } from "#/core/infra/errors";

/**
 * Which process, in which deployment, is emitting telemetry. Mirrors
 * `TelemetryDeployment` on the Python side so an issue from the WebUI and one
 * from the WebAPI describe themselves the same way (see ADR 0012).
 */
export interface TelemetryDeployment {
  service: string;
  universe: string;
  env: string;
  instance: string;
  hosting: string;
  version: string;
}

/** What the browser needs in order to report, serialised into the page. */
export interface TelemetryConfig {
  enabled: boolean;
  dsn: string | null;
  deployment: TelemetryDeployment;
  tracesSampleRate: number;
}

/** The global the server writes and `entry.client` reads before hydrating. */
export const TELEMETRY_CONFIG_GLOBAL = "__JUPITER_TELEMETRY__";

/** Enough of a trace to follow a request, without any of what it carried. */
export const TRACES_SAMPLE_RATE = 0.1;

/** The placeholder DSN every `Config.project` ships with. */
const PLACEHOLDER_DSN = "FAKEFAKE";

export function buildTelemetryDeployment(
  globalProperties: GlobalPropertiesServer | GlobalPropertiesClient,
  service: string,
): TelemetryDeployment {
  return {
    service,
    universe: globalProperties.universe,
    env: globalProperties.env,
    instance: globalProperties.instance,
    hosting: getHosting(globalProperties.universe),
    version: globalProperties.version,
  };
}

/** Separates production from staging and from each preview deploy. */
export function telemetryEnvironment(deployment: TelemetryDeployment): string {
  return `${deployment.universe}-${deployment.env}`;
}

/** Attributes a regression to a version. */
export function telemetryRelease(deployment: TelemetryDeployment): string {
  return `thrive@${deployment.version}`;
}

export function isTelemetryEnabled(
  telemetry: JupiterTelemetry,
  dsn: string | null,
): boolean {
  return (
    telemetry === JupiterTelemetry.SENTRY &&
    dsn !== null &&
    dsn !== "" &&
    // Sending to the placeholder would fail on every request and drown the logs.
    dsn !== PLACEHOLDER_DSN
  );
}

/**
 * Whether to keep the local console noisy. In production the console is nobody's
 * debugger, so an expected error stays quiet there and only telemetry sees it.
 */
export function shouldLogToConsole(env: Env): boolean {
  return env !== Env.PRODUCTION;
}

/**
 * How the browser reports, once it knows how.
 *
 * Route error boundaries render on the server as well as in the browser, so
 * they must not pull the browser SDK into the server bundle. `entry.client`
 * registers the real reporter here after it initialises; until then, and
 * always during SSR, reporting is a no-op. This mirrors the current-telemetry
 * accessor on the Python side.
 */
export interface TelemetryReporter {
  recordUnexpectedError(error: unknown, operation: string): void;
  bindActor(userRefId: string | null): void;
}

let reporter: TelemetryReporter | null = null;

export function setTelemetryReporter(theReporter: TelemetryReporter): void {
  reporter = theReporter;
}

export function recordUnexpectedError(error: unknown, operation: string): void {
  reporter?.recordUnexpectedError(error, operation);
}

/**
 * Attach whoever is using the page to everything it reports - as a ref id,
 * never a name or an email address.
 */
export function useBindTelemetryActor(userRefId: string | null): void {
  useEffect(() => {
    reporter?.bindActor(userRefId);
  }, [userRefId]);
}

/**
 * Report what a route error boundary is about to render, if it is ours to fix.
 *
 * A boundary renders both kinds of failure: a missing entity or a denied grant
 * is the app working correctly and must stay quiet, while anything else is a
 * defect. Reporting from here rather than from each route means every boundary
 * in the app is covered by construction.
 */
export function useReportRouteError(error: unknown, operation: string): void {
  useEffect(() => {
    if (error === undefined || error === null) {
      return;
    }
    if (!isUnexpectedError(error)) {
      return;
    }
    recordUnexpectedError(error, operation);
  }, [error, operation]);
}
