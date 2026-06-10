import { createCookie } from "@remix-run/node";

import { GOOGLE_OAUTH_STATE_COOKIE_NAME } from "#/core/infra/names";

// The cookie security setting and domain are service-level configuration, so
// callers pass them in rather than core reaching into a service's config. The
// domain pins the cookie to the WebUI host (e.g. app.get-thriving.com) so it is
// never shared with the apex domain or sibling services.
function googleOauthStateCookie(secure: boolean, domain?: string) {
  return createCookie(GOOGLE_OAUTH_STATE_COOKIE_NAME, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: secure,
    domain: domain,
  });
}

export async function saveGoogleOauthState(
  state: string,
  secure: boolean,
  domain?: string,
) {
  return await googleOauthStateCookie(secure, domain).serialize(state);
}

export async function loadGoogleOauthState(cookieHeader: string | null) {
  return await googleOauthStateCookie(false).parse(cookieHeader);
}

export async function clearGoogleOauthState(secure: boolean, domain?: string) {
  return await googleOauthStateCookie(secure, domain).serialize("", {
    maxAge: 0,
  });
}
