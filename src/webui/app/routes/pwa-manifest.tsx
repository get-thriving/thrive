import { Hosting } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { inferPlatformAndDistribution } from "@jupiter/core/frontdoor.server";
import { getHosting } from "#/core/universe";

export async function loader({ request }: LoaderFunctionArgs) {
  let name = "";
  if (getHosting(GLOBAL_PROPERTIES.universe) === Hosting.HOSTED_GLOBAL) {
    name = GLOBAL_PROPERTIES.title;
  } else if (getHosting(GLOBAL_PROPERTIES.universe) === Hosting.SELF_HOSTED) {
    name = `${GLOBAL_PROPERTIES.title} - ${GLOBAL_PROPERTIES.instance}`;
  } else {
    name = GLOBAL_PROPERTIES.title;
  }

  const { platform } = inferPlatformAndDistribution(
    request.headers.get("User-Agent"),
  );

  const startUrl = new URL(
    "http://example.com" + GLOBAL_PROPERTIES.pwaStartUrl,
  );
  startUrl.searchParams.set("clientVersion", GLOBAL_PROPERTIES.version);
  startUrl.searchParams.set("appPlatform", platform);

  return json({
    name: name,
    short_name: name,
    start_url: `${startUrl.pathname}${startUrl.search}`,
    display: "standalone",
    icons: [
      {
        src: "logo.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  });
}
