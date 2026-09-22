import { redirectDocument } from "@remix-run/node";
import { clearGoogleOauthState } from "@jupiter/core/auth/sub/google/oauth-state.server";
import {
  AUTH_TOKEN_NAME,
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
  NIGHT_MODE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "@jupiter/core/infra/names";
import { clearNightModePreference } from "@jupiter/core/infra/night-mode.server";

import { SERVICE_PROPERTIES } from "~/logic/config.server";
import { destroySession, getSession } from "~/sessions";

const LOGIN_URL = "/app/lifecycle/login/local/login";

// Cookies used to carry an explicit Domain, and a browser keeps such a cookie
// alongside the host-only one we set now. Expiring the host-only cookie leaves
// the older one in place - and still logged in - so logout expires both. The
// domain to clear is the host being browsed, which is what the old cookies were
// pinned to. Can go once no one holds a cookie from before that change.
function clearLegacyDomainScopedCookie(request: Request, name: string): string {
  const host = new URL(request.url).hostname;
  const attributes = [
    `${name}=`,
    "Path=/",
    `Domain=${host}`,
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "SameSite=Lax",
  ];
  if (SERVICE_PROPERTIES.sessionCookieSecure) {
    attributes.push("Secure");
  }
  return attributes.join("; ");
}

export async function logoutAndRedirectToLogin(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset(AUTH_TOKEN_NAME);

  const headers = new Headers();
  headers.append("Set-Cookie", await destroySession(session));
  headers.append(
    "Set-Cookie",
    await clearGoogleOauthState(SERVICE_PROPERTIES.sessionCookieSecure),
  );
  headers.append(
    "Set-Cookie",
    await clearNightModePreference(SERVICE_PROPERTIES.sessionCookieSecure),
  );

  for (const name of [
    SESSION_COOKIE_NAME,
    GOOGLE_OAUTH_STATE_COOKIE_NAME,
    NIGHT_MODE_COOKIE_NAME,
  ]) {
    headers.append("Set-Cookie", clearLegacyDomainScopedCookie(request, name));
  }

  return redirectDocument(LOGIN_URL, { headers });
}
