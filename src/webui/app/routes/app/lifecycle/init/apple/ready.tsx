import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm } from "zodix";
import { isAllowedOauthCallbackUrl } from "@jupiter/core/auth/oauth-callback-url.server";
import { decodeAppleOauthRedirectState } from "@jupiter/core/auth/sub/apple/apple-oauth-redirect-state.server";

import { SERVICE_PROPERTIES } from "~/logic/config.server";

const FormSchema = z.object({
  state: z.string(),
  code: z.string().optional(),
  error: z.string().optional(),
  user: z.string().optional(),
});

// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  const form = await parseForm(request, FormSchema);
  const decoded = decodeAppleOauthRedirectState(form.state);

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

  if (form.error !== undefined || form.code === undefined) {
    return redirect(decoded.callbackFailureUrl, StatusCodes.SEE_OTHER);
  }

  const successUrl = new URL(decoded.callbackSuccessUrl);
  successUrl.searchParams.set("state", form.state);
  successUrl.searchParams.set("code", form.code);
  if (form.user !== undefined) {
    successUrl.searchParams.set("user", form.user);
  }

  return redirect(successUrl.toString(), StatusCodes.SEE_OTHER);
}
