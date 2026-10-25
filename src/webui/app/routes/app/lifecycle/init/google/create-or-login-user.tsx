import { ApiError } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseQuery } from "zodix";
import {
  clearGoogleOauthState,
  loadGoogleOauthState,
} from "@jupiter/core/auth/sub/google/oauth-state.server";
import { oauthReturnToFromUrl } from "@jupiter/core/auth/oauth-return-to";
import { AUTH_TOKEN_NAME } from "@jupiter/core/infra/names";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { isLocal } from "@jupiter/core/env";
import { getGuestApiClient } from "@jupiter/core/infra/api-clients.server";

import { SERVICE_PROPERTIES } from "~/logic/config.server";
import { emailVerificationVerifyUrl } from "~/routes/app/lifecycle/lifecycle-redirects.server";
import { commitSession, getSession } from "~/sessions";

const GOOGLE_READY_PATH = "/app/lifecycle/init/google/ready";

function googleTokenExchangeCallbackUri() {
  const readyRoot = isLocal(GLOBAL_PROPERTIES.env)
    ? SERVICE_PROPERTIES.webUiUrl
    : GLOBAL_PROPERTIES.hostedGlobalWebUiUrl;

  return new URL(GOOGLE_READY_PATH, readyRoot).toString();
}

const QuerySchema = z.object({
  state: z.string(),
  code: z.string().optional(),
  error: z.string().optional(),
});

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const query = parseQuery(request, QuerySchema);
  const savedState = await loadGoogleOauthState(request.headers.get("Cookie"));

  if (typeof savedState !== "string" || savedState !== query.state) {
    throw new Response(ReasonPhrases.UNAUTHORIZED, {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  if (query.error !== undefined) {
    const returnTo = oauthReturnToFromUrl(request.url);
    return redirect(
      returnTo === undefined
        ? "/app/lifecycle/login/local/login"
        : `/app/lifecycle/login/local/login?returnTo=${encodeURIComponent(returnTo)}`,
      {
        headers: {
          "Set-Cookie": await clearGoogleOauthState(
            SERVICE_PROPERTIES.sessionCookieSecure,
          ),
        },
      },
    );
  }

  if (query.code === undefined) {
    throw new Response(ReasonPhrases.BAD_REQUEST, {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const apiClient = await getGuestApiClient(request);
  const callbackUri = googleTokenExchangeCallbackUri();

  try {
    const result = await apiClient.application.initCreateUserOrLoginGoogle({
      google_auth_code: query.code,
      callback_uri: callbackUri,
    });

    session.set(AUTH_TOKEN_NAME, result.auth_token_ext);

    const headers = new Headers();
    headers.append("Set-Cookie", await commitSession(session));
    headers.append(
      "Set-Cookie",
      await clearGoogleOauthState(SERVICE_PROPERTIES.sessionCookieSecure),
    );

    // Back to the consent page the user came from, once they are verified.
    const returnTo = oauthReturnToFromUrl(request.url);
    return redirect(
      returnTo !== undefined && result.new_user.verified
        ? returnTo
        : emailVerificationVerifyUrl(result.new_user.ref_id),
      { headers },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return redirect("/app/lifecycle/util/user-already-exists", {
        headers: {
          "Set-Cookie": await clearGoogleOauthState(
            SERVICE_PROPERTIES.sessionCookieSecure,
          ),
        },
      });
    }

    throw error;
  }
}
