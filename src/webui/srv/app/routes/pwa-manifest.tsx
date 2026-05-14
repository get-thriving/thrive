import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  GLOBAL_PROPERTIES,
  SERVICE_PROPERTIES,
} from "@jupiter/core/config-server";
import { inferPlatformAndDistribution } from "@jupiter/core/frontdoor.server";
import { getPublicName } from "#/core/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const name = getPublicName(GLOBAL_PROPERTIES);

  const { platform } = inferPlatformAndDistribution(
    request.headers.get("User-Agent"),
  );

  const startUrl = new URL(
    "http://example.com" + SERVICE_PROPERTIES.pwaStartUrl,
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
