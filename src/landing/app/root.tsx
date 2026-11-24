import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "~/landing.css";

import { StrataColorVariables } from "@jupiter/core/infra/component/strata-color-variables";
import { strataColors } from "@jupiter/core/infra/component/strata-tokens";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import favicon from "@assets/jupiter.ico";

import { ColorSchemeScript } from "~/components/color-scheme-script";

export function links() {
  return [{ rel: "icon", href: favicon }];
}

export function Layout(props: { children: React.ReactNode }) {
  return (
    // Dark until the script below has asked the device, which is before the
    // first paint, so a visitor on a light device never sees it.
    <html
      lang="en"
      data-color-scheme="dark"
      suppressHydrationWarning
      style={{ backgroundColor: strataColors.ground }}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <StrataColorVariables />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        {props.children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
