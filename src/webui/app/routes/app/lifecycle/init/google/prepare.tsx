import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { saveGoogleOauthState } from "@jupiter/core/auth/sub/google/oauth-state.server";
import { SERVICE_PROPERTIES } from "@jupiter/core/config-server";

import { getGuestApiClient } from "~/api-clients.server";

const GOOGLE_INIT_CALLBACK_PATH =
  "/app/lifecycle/init/google/create-or-login-user";

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const callbackUri = new URL(
    GOOGLE_INIT_CALLBACK_PATH,
    SERVICE_PROPERTIES.webUiUrl,
  ).toString();

  const result = await apiClient.auth.authGoogleGetAuthorisationUrl({
    callback_uri: callbackUri,
  });

  return redirect(result.authorisation_url, {
    headers: {
      "Set-Cookie": await saveGoogleOauthState(result.state),
    },
  });
}
