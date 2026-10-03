import { CssBaseline, ThemeProvider } from "@mui/material";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { Links, Meta, Outlet, Scripts, useLoaderData } from "react-router";
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
import interFontCss from "@fontsource-variable/inter/wght.css?url";
import interItalicFontCss from "@fontsource-variable/inter/wght-italic.css?url";
import frauncesFontCss from "@fontsource-variable/fraunces/wght.css?url";
import { OS_NIGHT_MODE_COOKIE_NAME } from "@jupiter/core/infra/names";
import { readBooleanCookie } from "@jupiter/core/infra/night-mode";
import type { LoaderDataOf } from "@jupiter/core/infra/component/use-loader-data-for-animation";

export async function loader({ request }: LoaderFunctionArgs) {
  return {
    globalProperties: serverToClientGlobalProperties(GLOBAL_PROPERTIES),
    osNightModeHint: readBooleanCookie(
      request.headers.get("Cookie"),
      OS_NIGHT_MODE_COOKIE_NAME,
    ),
  };
}

export function meta({
  loaderData,
}: {
  loaderData: LoaderDataOf<typeof loader>;
}) {
  return [{ title: getPublicName(loaderData.globalProperties) }];
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
        {/* In the document rather than in `meta`: a route's `meta` replaces
            its parents' rather than adding to them, so the many routes that
            set a title would drop this. First in <head> so it falls inside the
            bytes a browser reads looking for an encoding. */}
        <meta charSet="utf-8" />
        {/* MUI's styled engine inserts this into <head> on load if it's
            missing, which happens before hydration and makes it fail. Render it
            ourselves so the server and client markup match. */}
        <meta name="emotion-insertion-point" content="" />
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
      </body>
    </html>
  );
}
