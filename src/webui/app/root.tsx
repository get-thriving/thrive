import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
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

import { getGuestApiClient } from "~/api-clients.server";

function buildTheme(useNightMode: boolean) {
  return createTheme({
    palette: {
      mode: useNightMode ? "dark" : "light",
      primary: {
        main: "#3F51B5",
        light: "#7986CB",
        dark: "#303F9F",
      },
      secondary: {
        main: "#FF4081",
        light: "#FF79B0",
        dark: "#C60055",
      },
      ...(!useNightMode && {
        divider: "#E0E0E0",
        text: {
          primary: "#212121",
          secondary: "#757575",
          disabled: "#BDBDBD",
        },
      }),
    },
    typography: {
      fontFamily: '"Helvetica", "Arial", sans-serif',
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  let useNightMode = false;
  try {
    const apiClient = await getGuestApiClient(request);
    const result = await apiClient.users.webUiSettingsLoad({});
    useNightMode = result.web_ui_settings.use_night_mode;
  } catch {
    // Not authenticated or settings not found - use default light mode
  }

  return json({
    globalProperties: serverToClientGlobalProperties(GLOBAL_PROPERTIES),
    useNightMode,
  });
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

export const shouldRevalidate: ShouldRevalidateFunction = ({ nextUrl }) => {
  return nextUrl.searchParams.has("invalidateTopLevel");
};

export default function Root() {
  const loaderData = useLoaderData<typeof loader>();
  const theme = useMemo(
    () => buildTheme(loaderData.useNightMode),
    [loaderData.useNightMode],
  );
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <StrictMode>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <CssBaseline />
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
