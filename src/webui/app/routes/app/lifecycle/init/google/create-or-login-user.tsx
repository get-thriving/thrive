import { ApiError } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseQuery } from "zodix";
import {
  clearGoogleOauthState,
  loadGoogleOauthState,
} from "@jupiter/core/auth/sub/google/oauth-state.server";
import { AUTH_TOKEN_NAME } from "@jupiter/core/infra/names";
import { SERVICE_PROPERTIES } from "@jupiter/core/config-server";

import { getGuestApiClient } from "~/api-clients.server";
import { emailVerificationVerifyUrl } from "~/routes/app/lifecycle/lifecycle-redirects.server";
import { commitSession, getSession } from "~/sessions";

const GOOGLE_INIT_CALLBACK_PATH =
  "/app/lifecycle/init/google/create-or-login-user";

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
    return redirect("/app/lifecycle/login/local/login", {
      headers: { "Set-Cookie": await clearGoogleOauthState() },
    });
  }

  if (query.code === undefined) {
    throw new Response(ReasonPhrases.BAD_REQUEST, {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const apiClient = await getGuestApiClient(request);
  const callbackUri = new URL(
    GOOGLE_INIT_CALLBACK_PATH,
    SERVICE_PROPERTIES.webUiUrl,
  ).toString();

  try {
    const result = await apiClient.application.initCreateUserOrLoginGoogle({
      google_auth_code: query.code,
      callback_uri: callbackUri,
    });

    session.set(AUTH_TOKEN_NAME, result.auth_token_ext);

    const headers = new Headers();
    headers.append("Set-Cookie", await commitSession(session));
    headers.append("Set-Cookie", await clearGoogleOauthState());

    return redirect(emailVerificationVerifyUrl(result.new_user.ref_id), {
      headers,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return redirect("/app/lifecycle/util/user-already-exists", {
        headers: { "Set-Cookie": await clearGoogleOauthState() },
      });
    }

    throw error;
  }
}
