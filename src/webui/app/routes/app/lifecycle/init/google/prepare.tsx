import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { saveGoogleOauthState } from "@jupiter/core/auth/sub/google/oauth-state.server";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { isLocal } from "@jupiter/core/env";

import { getGuestApiClient } from "~/api-clients.server";
import { SERVICE_PROPERTIES } from "~/logic/config.server";

const GOOGLE_INIT_CALLBACK_PATH =
  "/app/lifecycle/init/google/create-or-login-user";
const GOOGLE_READY_PATH = "/app/lifecycle/init/google/ready";
const GOOGLE_LOGIN_FAILURE_PATH = "/app/lifecycle/login/local/login";

function googleOAuthRedirectUrls() {
  const callbackSuccessUrl = new URL(
    GOOGLE_INIT_CALLBACK_PATH,
    SERVICE_PROPERTIES.webUiUrl,
  ).toString();
  const callbackFailureUrl = new URL(
    GOOGLE_LOGIN_FAILURE_PATH,
    SERVICE_PROPERTIES.webUiUrl,
  ).toString();

  if (isLocal(GLOBAL_PROPERTIES.env)) {
    const localReadyUrl = new URL(
      GOOGLE_READY_PATH,
      SERVICE_PROPERTIES.webUiUrl,
    ).toString();

    return {
      readyUrl: localReadyUrl,
      callbackSuccessUrl,
      callbackFailureUrl,
    };
  } else {
    const hostedGlobalReadyUrl = new URL(
      GOOGLE_READY_PATH,
      GLOBAL_PROPERTIES.hostedGlobalWebUiUrl,
    ).toString();

    return {
      readyUrl: hostedGlobalReadyUrl,
      callbackSuccessUrl,
      callbackFailureUrl,
    };
  }
}

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const { readyUrl, callbackSuccessUrl, callbackFailureUrl } =
    googleOAuthRedirectUrls();

  const result = await apiClient.auth.authGoogleGetAuthorisationUrl({
    ready_url: readyUrl,
    callback_success_url: callbackSuccessUrl,
    callback_failure_url: callbackFailureUrl,
  });

  return redirect(result.authorisation_url, {
    headers: {
      "Set-Cookie": await saveGoogleOauthState(
        result.state,
        SERVICE_PROPERTIES.sessionCookieSecure,
        SERVICE_PROPERTIES.sessionCookieDomain,
      ),
    },
  });
}
