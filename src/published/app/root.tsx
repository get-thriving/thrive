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
import { getPublicName } from "#/core/utils";
import {
  ApplyColorSchemeScript,
  htmlColorSchemeStyle,
  useSystemNightMode,
} from "@jupiter/core/infra/component/color-scheme";
import { buildTheme } from "@jupiter/core/infra/component/theme";
import interFontCss from "@fontsource-variable/inter/wght.css";
import interItalicFontCss from "@fontsource-variable/inter/wght-italic.css";
import frauncesFontCss from "@fontsource-variable/fraunces/wght.css";
import { OS_NIGHT_MODE_COOKIE_NAME } from "@jupiter/core/infra/names";
import { readBooleanCookie } from "@jupiter/core/infra/night-mode";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    globalProperties: serverToClientGlobalProperties(GLOBAL_PROPERTIES),
    osNightModeHint: readBooleanCookie(
      request.headers.get("Cookie"),
      OS_NIGHT_MODE_COOKIE_NAME,
    ),
  });
}

export function meta({ data }: { data: SerializeFrom<typeof loader> }) {
  return [
    { charset: "utf-8" },
    { title: getPublicName(data.globalProperties) },
  ];
}

export function links() {
  return [
    { rel: "stylesheet", href: interFontCss },
    { rel: "stylesheet", href: interItalicFontCss },
    { rel: "stylesheet", href: frauncesFontCss },
  ];
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export default function Root() {
  const loaderData = useLoaderData<typeof loader>();

  const systemNightMode = useSystemNightMode(loaderData.osNightModeHint);
  const theme = useMemo(() => buildTheme(systemNightMode), [systemNightMode]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={htmlColorSchemeStyle(systemNightMode)}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <ApplyColorSchemeScript />
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
