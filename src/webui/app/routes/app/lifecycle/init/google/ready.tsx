import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseQuery } from "zodix";
import {
  decodeGoogleOauthRedirectState,
  isAllowedGoogleOauthCallbackUrl,
} from "@jupiter/core/auth/sub/google/google-oauth-redirect-state.server";

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
    !isAllowedGoogleOauthCallbackUrl(decoded.callbackSuccessUrl) ||
    !isAllowedGoogleOauthCallbackUrl(decoded.callbackFailureUrl)
  ) {
    throw new Response(ReasonPhrases.UNAUTHORIZED, {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  if (query.error !== undefined || query.code === undefined) {
    return redirect(decoded.callbackFailureUrl);
  }

  const successUrl = new URL(decoded.callbackSuccessUrl);
  successUrl.searchParams.set("state", query.state);
  successUrl.searchParams.set("code", query.code);

  return redirect(successUrl.toString());
}
