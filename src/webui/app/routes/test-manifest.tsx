import { json } from "@remix-run/node";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { isDevelopment } from "#/core/env";

import { SERVICE_PROPERTIES } from "~/logic/config.server";

export async function loader() {
  if (!isDevelopment(GLOBAL_PROPERTIES.env)) {
    throw new Response(null, { status: 404 });
  }

  return json({
    webApiUrl: SERVICE_PROPERTIES.webApiUrl,
    apiUrl: SERVICE_PROPERTIES.apiUrl,
    mcpUrl: SERVICE_PROPERTIES.mcpUrl,
    webUiUrl: SERVICE_PROPERTIES.webUiUrl,
    publishedUrl: SERVICE_PROPERTIES.publishedUrl,
    docsUrl: SERVICE_PROPERTIES.docsUrl,
    authStrategy: GLOBAL_PROPERTIES.authProvider,
    emailVerificationStrategy: GLOBAL_PROPERTIES.emailVerificationStrategy,
  });
}
