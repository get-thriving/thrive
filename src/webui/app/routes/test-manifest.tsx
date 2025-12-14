import { json } from "@remix-run/node";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { isDevelopment } from "#/core/env";

export async function loader() {
  if (!isDevelopment(GLOBAL_PROPERTIES.env)) {
    throw new Response(null, { status: 404 });
  }

  return json({
    webApiUrl: GLOBAL_PROPERTIES.webApiUrl,
    webUiUrl: GLOBAL_PROPERTIES.hostedGlobalWebUiUrl,
    docsUrl: GLOBAL_PROPERTIES.docsUrl,
  });
}
