import { redirectDocument } from "@remix-run/node";
import { clearGoogleOauthState } from "@jupiter/core/auth/sub/google/oauth-state.server";
import { AUTH_TOKEN_NAME } from "@jupiter/core/infra/names";

import { SERVICE_PROPERTIES } from "~/logic/config.server";
import { destroySession, getSession } from "~/sessions";

const LOGIN_URL = "/app/lifecycle/login/local/login";

export async function logoutAndRedirectToLogin(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset(AUTH_TOKEN_NAME);

  const headers = new Headers();
  headers.append("Set-Cookie", await destroySession(session));
  headers.append(
    "Set-Cookie",
    await clearGoogleOauthState(SERVICE_PROPERTIES.sessionCookieSecure),
  );

  return redirectDocument(LOGIN_URL, { headers });
}
