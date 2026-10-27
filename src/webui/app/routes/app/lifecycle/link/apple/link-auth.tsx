import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseQuery } from "zodix";
import {
  clearAppleOauthState,
  loadAppleOauthState,
} from "@jupiter/core/auth/sub/apple/oauth-state.server";
import { oauthErrorMessage } from "@jupiter/core/auth/oauth-error-message";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

import { SERVICE_PROPERTIES } from "~/logic/config.server";

const SECURITY_PATH = "/app/workspace/account";
const APPLE_READY_PATH = "/app/lifecycle/init/apple/ready";

function tokenExchangeCallbackUri() {
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

// Links the Apple account the user just proved they control to the account they
// are signed in to. Unlike signing in, this never creates or switches users.
// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const query = parseQuery(request, QuerySchema);
  const savedState = await loadAppleOauthState(request.headers.get("Cookie"));

  if (typeof savedState !== "string" || savedState !== query.state) {
    throw new Response(ReasonPhrases.UNAUTHORIZED, {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const clearState = {
    "Set-Cookie": await clearAppleOauthState(
      SERVICE_PROPERTIES.sessionCookieSecure,
    ),
  };

  if (query.error !== undefined) {
    return redirect(SECURITY_PATH, { headers: clearState });
  }

  if (query.code === undefined) {
    throw new Response(ReasonPhrases.BAD_REQUEST, {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const apiClient = await getLoggedInApiClient(request);

  try {
    await apiClient.auth.linkApple({
      apple_auth_code: query.code,
      callback_uri: tokenExchangeCallbackUri(),
      apple_user_json: query.user ?? null,
    });
  } catch (error) {
    const message = oauthErrorMessage(error);
    if (message === undefined) {
      throw error;
    }

    return redirect(
      `${SECURITY_PATH}?linkError=${encodeURIComponent(message)}`,
      {
        headers: clearState,
      },
    );
  }

  return redirect(SECURITY_PATH, { headers: clearState });
}
