import { CssBaseline, ThemeProvider } from "@mui/material";
import type {
  LoaderFunctionArgs,
  MiddlewareFunction,
  ShouldRevalidateFunction,
} from "react-router";
import { Links, Meta, Outlet, Scripts, useLoaderData } from "react-router";
import { SnackbarProvider } from "notistack";
import { StrictMode, useEffect } from "react";
import { EnvBanner } from "@jupiter/core/infra/component/env-banner";
import { serverToClientGlobalProperties } from "@jupiter/core/config-client";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { getPublicName } from "#/core/utils";
import {
  buildStrataTheme,
  STRATA_APP_BACKGROUND,
} from "@jupiter/core/infra/component/strata-theme";
import { isWorkspacePath } from "@jupiter/core/infra/routes";
import plexSans400Css from "@fontsource/ibm-plex-sans/400.css?url";
import plexSans400ItalicCss from "@fontsource/ibm-plex-sans/400-italic.css?url";
import plexSans500Css from "@fontsource/ibm-plex-sans/500.css?url";
import plexSans600Css from "@fontsource/ibm-plex-sans/600.css?url";
import plexMono400Css from "@fontsource/ibm-plex-mono/400.css?url";
import plexMono500Css from "@fontsource/ibm-plex-mono/500.css?url";
import plexSerif400Css from "@fontsource/ibm-plex-serif/400.css?url";
import plexSerif500Css from "@fontsource/ibm-plex-serif/500.css?url";
import type { LoaderDataOf } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { getGuestApiClient } from "@jupiter/core/infra/api-clients.server";
import { carrySectionFiltersThroughRedirects } from "@jupiter/core/infra/carry-section-filters-through-redirects";

const THEME = buildStrataTheme();

export const middleware: MiddlewareFunction<Response>[] = [
  carrySectionFiltersThroughRedirects,
];

export async function loader({ request, url }: LoaderFunctionArgs) {
  let useExpandedRail = false;

  if (isWorkspacePath(url.pathname)) {
    try {
      const apiClient = await getGuestApiClient(request);
      const result = await apiClient.users.webUiSettingsLoad({});
      useExpandedRail = result.web_ui_settings.use_expanded_rail;
    } catch {
      // Not authenticated or settings missing: the default.
    }
  }

  return {
    globalProperties: serverToClientGlobalProperties(GLOBAL_PROPERTIES),
    useExpandedRail,
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
    { rel: "stylesheet", href: plexSans400Css },
    { rel: "stylesheet", href: plexSans400ItalicCss },
    { rel: "stylesheet", href: plexSans500Css },
    { rel: "stylesheet", href: plexSans600Css },
    { rel: "stylesheet", href: plexMono400Css },
    { rel: "stylesheet", href: plexMono500Css },
    { rel: "stylesheet", href: plexSerif400Css },
    { rel: "stylesheet", href: plexSerif500Css },
    { rel: "manifest", href: "/pwa-manifest" },
  ];
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
}) => {
  if (nextUrl.searchParams.has("invalidateTopLevel")) {
    return true;
  }
  // Cross the workspace boundary (login ↔ workspace) so the user's settings load.
  return (
    isWorkspacePath(currentUrl.pathname) !== isWorkspacePath(nextUrl.pathname)
  );
};

export default function Root() {
  const loaderData = useLoaderData<typeof loader>();

  // Effects only run once hydration has committed, so this tells the itests
  // when clicks and fills stop getting lost to it.
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ colorScheme: "dark", backgroundColor: STRATA_APP_BACKGROUND }}
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
        <Meta />
        <Links />
      </head>
      <body>
        <StrictMode>
          <ThemeProvider theme={THEME}>
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
