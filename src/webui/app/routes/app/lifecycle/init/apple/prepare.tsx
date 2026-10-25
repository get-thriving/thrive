import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { saveAppleOauthState } from "@jupiter/core/auth/sub/apple/oauth-state.server";
import { oauthReturnToFromUrl } from "@jupiter/core/auth/oauth-return-to";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { getGuestApiClient } from "@jupiter/core/infra/api-clients.server";

import { SERVICE_PROPERTIES } from "~/logic/config.server";

const APPLE_INIT_CALLBACK_PATH =
  "/app/lifecycle/init/apple/create-or-login-user";
const APPLE_READY_PATH = "/app/lifecycle/init/apple/ready";
const APPLE_LOGIN_FAILURE_PATH = "/app/lifecycle/login/local/login";

function appleOAuthRedirectUrls(returnTo: string | undefined) {
  const callbackSuccessUrl = new URL(
    APPLE_INIT_CALLBACK_PATH,
    SERVICE_PROPERTIES.webUiUrl,
  );
  const callbackFailureUrl = new URL(
    APPLE_LOGIN_FAILURE_PATH,
    SERVICE_PROPERTIES.webUiUrl,
  );
  if (returnTo !== undefined) {
    // The way back to the consent page rides along both outcomes.
    callbackSuccessUrl.searchParams.set("returnTo", returnTo);
    callbackFailureUrl.searchParams.set("returnTo", returnTo);
  }
  // Apple only accepts an HTTPS redirect URI on a registered domain, so the
  // ready URL is the hosted global one even when this WebUI is local.
  const readyUrl = new URL(
    APPLE_READY_PATH,
    GLOBAL_PROPERTIES.hostedGlobalWebUiUrl,
  ).toString();

  return {
    readyUrl,
    callbackSuccessUrl: callbackSuccessUrl.toString(),
    callbackFailureUrl: callbackFailureUrl.toString(),
  };
}

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const { readyUrl, callbackSuccessUrl, callbackFailureUrl } =
    appleOAuthRedirectUrls(oauthReturnToFromUrl(request.url));

  const result = await apiClient.auth.authAppleGetAuthorisationUrl({
    ready_url: readyUrl,
    callback_success_url: callbackSuccessUrl,
    callback_failure_url: callbackFailureUrl,
  });

  return redirect(result.authorisation_url, {
    headers: {
      "Set-Cookie": await saveAppleOauthState(
        result.state,
        SERVICE_PROPERTIES.sessionCookieSecure,
      ),
    },
  });
}
