import type { TelemetryConfig } from "#/core/infra/telemetry/telemetry";
import { TELEMETRY_CONFIG_GLOBAL } from "#/core/infra/telemetry/telemetry";

/**
 * Hand the browser the telemetry configuration before any of the app's own
 * JavaScript runs.
 *
 * `entry.client` initialises reporting at module scope so that a failure during
 * hydration is still caught, which is earlier than any loader data is
 * available. An inline script in `<head>` is the only thing that runs earlier
 * still. Everything here is public by construction - a browser DSN and the
 * deployment's own name.
 */
export function TelemetryConfigScript({ config }: { config: TelemetryConfig }) {
  const script = `window.${TELEMETRY_CONFIG_GLOBAL}=${JSON.stringify(
    config,
  ).replace(/</g, "\\u003c")};`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
