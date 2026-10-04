import { ApiError } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseQuery } from "zodix";
import {
  clearAppleOauthState,
  loadAppleOauthState,
} from "@jupiter/core/auth/sub/apple/oauth-state.server";
import { AUTH_TOKEN_NAME } from "@jupiter/core/infra/names";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { getGuestApiClient } from "@jupiter/core/infra/api-clients.server";

import { SERVICE_PROPERTIES } from "~/logic/config.server";
import { emailVerificationVerifyUrl } from "~/routes/app/lifecycle/lifecycle-redirects.server";
import { commitSession, getSession } from "~/sessions";

const APPLE_READY_PATH = "/app/lifecycle/init/apple/ready";

function appleTokenExchangeCallbackUri() {
  return new URL(
    APPLE_READY_PATH,
    GLOBAL_PROPERTIES.hostedGlobalWebUiUrl,
  ).toString();
}

const QuerySchema = z.object({
  state: z.string(),
  code: z.string().optional(),
  user: z.string().optional(),
  error: z.string().optional(),
});

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const query = parseQuery(request, QuerySchema);
  const savedState = await loadAppleOauthState(request.headers.get("Cookie"));

  if (typeof savedState !== "string" || savedState !== query.state) {
    throw new Response(ReasonPhrases.UNAUTHORIZED, {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  if (query.error !== undefined) {
    return redirect("/app/lifecycle/login/local/login", {
      headers: {
        "Set-Cookie": await clearAppleOauthState(
          SERVICE_PROPERTIES.sessionCookieSecure,
        ),
      },
    });
  }

  if (query.code === undefined) {
    throw new Response(ReasonPhrases.BAD_REQUEST, {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const apiClient = await getGuestApiClient(request);
  const callbackUri = appleTokenExchangeCallbackUri();

  try {
    const result = await apiClient.application.initCreateUserOrLoginApple({
      apple_auth_code: query.code,
      callback_uri: callbackUri,
      apple_user_json: query.user ?? null,
    });

    session.set(AUTH_TOKEN_NAME, result.auth_token_ext);

    const headers = new Headers();
    headers.append("Set-Cookie", await commitSession(session));
    headers.append(
      "Set-Cookie",
      await clearAppleOauthState(SERVICE_PROPERTIES.sessionCookieSecure),
    );

    return redirect(emailVerificationVerifyUrl(result.new_user.ref_id), {
      headers,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return redirect("/app/lifecycle/util/user-already-exists", {
        headers: {
          "Set-Cookie": await clearAppleOauthState(
            SERVICE_PROPERTIES.sessionCookieSecure,
          ),
        },
      });
    }

    throw error;
  }
}
