import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { saveGoogleOauthState } from "@jupiter/core/auth/sub/google/oauth-state.server";
import { oauthReturnToFromUrl } from "@jupiter/core/auth/oauth-return-to";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { isLocal } from "@jupiter/core/env";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

import { SERVICE_PROPERTIES } from "~/logic/config.server";

const GOOGLE_INIT_CALLBACK_PATH = "/app/lifecycle/link/google/link-auth";
const GOOGLE_READY_PATH = "/app/lifecycle/init/google/ready";
const GOOGLE_LOGIN_FAILURE_PATH = "/app/workspace/account";

function googleOAuthRedirectUrls(returnTo: string | undefined) {
  const callbackSuccessUrl = new URL(
    GOOGLE_INIT_CALLBACK_PATH,
    SERVICE_PROPERTIES.webUiUrl,
  );
  const callbackFailureUrl = new URL(
    GOOGLE_LOGIN_FAILURE_PATH,
    SERVICE_PROPERTIES.webUiUrl,
  );
  if (returnTo !== undefined) {
    // The way back to the consent page rides along both outcomes.
    callbackSuccessUrl.searchParams.set("returnTo", returnTo);
    callbackFailureUrl.searchParams.set("returnTo", returnTo);
  }

  if (isLocal(GLOBAL_PROPERTIES.env)) {
    const localReadyUrl = new URL(
      GOOGLE_READY_PATH,
      SERVICE_PROPERTIES.webUiUrl,
    ).toString();

    return {
      readyUrl: localReadyUrl,
      callbackSuccessUrl: callbackSuccessUrl.toString(),
      callbackFailureUrl: callbackFailureUrl.toString(),
    };
  } else {
    const hostedGlobalReadyUrl = new URL(
      GOOGLE_READY_PATH,
      GLOBAL_PROPERTIES.hostedGlobalWebUiUrl,
    ).toString();

    return {
      readyUrl: hostedGlobalReadyUrl,
      callbackSuccessUrl: callbackSuccessUrl.toString(),
      callbackFailureUrl: callbackFailureUrl.toString(),
    };
  }
}

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { readyUrl, callbackSuccessUrl, callbackFailureUrl } =
    googleOAuthRedirectUrls(oauthReturnToFromUrl(request.url));

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
      ),
    },
  });
}
