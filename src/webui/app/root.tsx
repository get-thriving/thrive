import { CssBaseline, ThemeProvider } from "@mui/material";
import type { LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "@remix-run/react";
import { SnackbarProvider } from "notistack";
import { StrictMode, useMemo } from "react";
import { EnvBanner } from "@jupiter/core/infra/component/env-banner";
import { serverToClientGlobalProperties } from "@jupiter/core/config-client";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { buildTelemetryConfig } from "@jupiter/core/infra/telemetry/telemetry.server";
import { TelemetryConfigScript } from "@jupiter/core/infra/telemetry/telemetry-config-script";
import { getPublicName } from "#/core/utils";
import {
  ApplyColorSchemeScript,
  buildTheme,
  htmlColorSchemeStyle,
  useSystemNightMode,
} from "@jupiter/core/infra/component/color-scheme";
import { OS_NIGHT_MODE_COOKIE_NAME } from "@jupiter/core/infra/names";
import { readBooleanCookie } from "@jupiter/core/infra/night-mode";
import {
  loadNightModePreference,
  saveNightModePreference,
} from "@jupiter/core/infra/night-mode.server";
import { isWorkspacePath } from "@jupiter/core/infra/routes";

import { getGuestApiClient } from "~/api-clients.server";
import { SERVICE_PROPERTIES } from "~/logic/config.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const inWorkspace = isWorkspacePath(url.pathname);

  let userNightMode: boolean | null = null;
  const headers = new Headers();

  if (inWorkspace) {
    try {
      const apiClient = await getGuestApiClient(request);
      const result = await apiClient.users.webUiSettingsLoad({});
      userNightMode = result.web_ui_settings.use_night_mode;
      headers.append(
        "Set-Cookie",
        await saveNightModePreference(
          userNightMode,
          SERVICE_PROPERTIES.sessionCookieSecure,
          SERVICE_PROPERTIES.sessionCookieDomain,
        ),
      );
    } catch {
      // Not authenticated or settings missing — last stored preference, then OS.
      userNightMode = loadNightModePreference(cookieHeader);
    }
  }

  return json(
    {
      globalProperties: serverToClientGlobalProperties(GLOBAL_PROPERTIES),
      telemetryConfig: buildTelemetryConfig("webui"),
      userNightMode,
      osNightModeHint: readBooleanCookie(
        cookieHeader,
        OS_NIGHT_MODE_COOKIE_NAME,
      ),
    },
    headers.has("Set-Cookie") ? { headers } : undefined,
  );
}

export function meta({ data }: { data: SerializeFrom<typeof loader> }) {
  return [
    { charset: "utf-8" },
    { title: getPublicName(data.globalProperties) },
  ];
}

export function links() {
  return [{ rel: "manifest", href: "/pwa-manifest" }];
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
}) => {
  if (nextUrl.searchParams.has("invalidateTopLevel")) {
    return true;
  }
  // Cross the workspace boundary (login ↔ workspace) so theme source switches.
  return (
    isWorkspacePath(currentUrl.pathname) !== isWorkspacePath(nextUrl.pathname)
  );
};

export default function Root() {
  const loaderData = useLoaderData<typeof loader>();

  const systemNightMode = useSystemNightMode(loaderData.osNightModeHint);
  const effectiveNightMode = loaderData.userNightMode ?? systemNightMode;
  const theme = useMemo(
    () => buildTheme(effectiveNightMode),
    [effectiveNightMode],
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={htmlColorSchemeStyle(effectiveNightMode)}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <ApplyColorSchemeScript />
        <TelemetryConfigScript config={loaderData.telemetryConfig} />
        <Meta />
        <Links />
      </head>
      <body>
        <StrictMode>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <CssBaseline enableColorScheme />
              <EnvBanner env={loaderData.globalProperties.env} />
              <Outlet />
            </SnackbarProvider>
          </ThemeProvider>
        </StrictMode>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
