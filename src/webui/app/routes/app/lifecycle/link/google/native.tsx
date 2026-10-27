import type { ActionFunctionArgs } from "react-router";
import { redirectDocument } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { oauthErrorMessage } from "@jupiter/core/auth/oauth-error-message";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

const SECURITY_PATH = "/app/workspace/account";

const FormSchema = z.object({
  code: z.string(),
});

// The code comes from the Google SDK in the app shell, so there is no redirect and
// no state cookie. The user is already signed in: this only adds a method.
// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  const form = await parseForm(request, FormSchema);
  const apiClient = await getLoggedInApiClient(request);

  try {
    await apiClient.auth.linkGoogleNative({
      google_auth_code: form.code,
    });
  } catch (error) {
    const message = oauthErrorMessage(error);
    if (message === undefined) {
      throw error;
    }

    return redirectDocument(
      `${SECURITY_PATH}?linkError=${encodeURIComponent(message)}`,
    );
  }

  return redirectDocument(`${SECURITY_PATH}?invalidateTopLevel=true`);
}
