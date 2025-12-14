import { json } from "@remix-run/node";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { isDevelopment } from "#/core/env";
import { Hosting } from "@jupiter/webapi-client";

export async function loader() {
  if (!isDevelopment(GLOBAL_PROPERTIES.env)) {
    throw new Response(null, { status: 404 });
  }

  let webApiServerUrl = "";
  if (
    GLOBAL_PROPERTIES.hosting === Hosting.LOCAL ||
    GLOBAL_PROPERTIES.hosting === Hosting.SELF_HOSTED
  ) {
    webApiServerUrl = GLOBAL_PROPERTIES.localOrSelfHostedWebApiServerUrl;
  } else if (GLOBAL_PROPERTIES.hosting === Hosting.HOSTED_GLOBAL) {
    webApiServerUrl = GLOBAL_PROPERTIES.hostedGlobalWebApiServerUrl;
  } else {
    throw new Error("Unknown hosting: " + GLOBAL_PROPERTIES.hosting);
  }

  return json({
    webApiUrl: webApiServerUrl,
    webUiUrl: GLOBAL_PROPERTIES.hostedGlobalWebUiUrl,
    docsUrl: GLOBAL_PROPERTIES.docsUrl,
  });
}
