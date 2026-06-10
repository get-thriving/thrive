import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { SerializeFrom } from "@remix-run/node";
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
import { StrictMode, useEffect, useMemo, useState } from "react";
import { EnvBanner } from "@jupiter/core/infra/component/env-banner";
import { serverToClientGlobalProperties } from "@jupiter/core/config-client";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { getPublicName } from "#/core/utils";

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
    ...(useNightMode && {
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              border: "1px solid rgba(255, 255, 255, 0.12)",
            },
          },
        },
      },
    }),
  });
}

export async function loader() {
  return json({
    globalProperties: serverToClientGlobalProperties(GLOBAL_PROPERTIES),
  });
}

export function meta({ data }: { data: SerializeFrom<typeof loader> }) {
  return [
    { charset: "utf-8" },
    { title: getPublicName(data.globalProperties) },
  ];
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export default function Root() {
  const loaderData = useLoaderData<typeof loader>();

  // Guests have no stored preference - infer night mode from the OS.
  const osPrefersDark =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  const [systemNightMode, setSystemNightMode] = useState(osPrefersDark);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemNightMode(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemNightMode(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const theme = useMemo(() => buildTheme(systemNightMode), [systemNightMode]);

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
