import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseQuery } from "zodix";
import { isAllowedOauthCallbackUrl } from "@jupiter/core/auth/oauth-callback-url.server";
import { decodeGoogleOauthRedirectState } from "@jupiter/core/auth/sub/google/google-oauth-redirect-state.server";

import { SERVICE_PROPERTIES } from "~/logic/config.server";

const QuerySchema = z.object({
  state: z.string(),
  code: z.string().optional(),
  error: z.string().optional(),
});

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const query = parseQuery(request, QuerySchema);
  const decoded = decodeGoogleOauthRedirectState(query.state);

  if (decoded === null) {
    throw new Response(ReasonPhrases.UNAUTHORIZED, {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  if (
    !isAllowedOauthCallbackUrl(
      decoded.callbackSuccessUrl,
      SERVICE_PROPERTIES.webUiUrl,
    ) ||
    !isAllowedOauthCallbackUrl(
      decoded.callbackFailureUrl,
      SERVICE_PROPERTIES.webUiUrl,
    )
  ) {
    throw new Response(ReasonPhrases.UNAUTHORIZED, {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  if (query.error !== undefined || query.code === undefined) {
    return redirect(decoded.callbackFailureUrl, StatusCodes.MOVED_TEMPORARILY);
  }

  const successUrl = new URL(decoded.callbackSuccessUrl);
  successUrl.searchParams.set("state", query.state);
  successUrl.searchParams.set("code", query.code);

  return redirect(successUrl.toString(), StatusCodes.MOVED_TEMPORARILY);
}
