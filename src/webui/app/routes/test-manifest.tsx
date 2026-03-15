import { json } from "@remix-run/node";
import {
  GLOBAL_PROPERTIES,
  SERVICE_PROPERTIES,
} from "@jupiter/core/config-server";
import { isDevelopment } from "#/core/env";

export async function loader() {
  if (!isDevelopment(GLOBAL_PROPERTIES.env)) {
    throw new Response(null, { status: 404 });
  }

  return json({
    webApiUrl: SERVICE_PROPERTIES.webApiUrl,
    apiUrl: SERVICE_PROPERTIES.apiUrl,
    mcpUrl: SERVICE_PROPERTIES.mcpUrl,
    webUiUrl: SERVICE_PROPERTIES.webUiUrl,
    docsUrl: SERVICE_PROPERTIES.docsUrl,
  });
}
