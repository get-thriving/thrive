import { createCookie } from "react-router";

import { APPLE_OAUTH_STATE_COOKIE_NAME } from "#/core/infra/names";

// The cookie security setting is service-level configuration, so callers pass
// it in rather than core reaching into a service's config. No Domain attribute
// is set, which makes the cookie host-only: it goes back to exactly the host
// that served the app, never to the apex domain or a sibling service, and it
// follows whatever host the app is served on.
function appleOauthStateCookie(secure: boolean) {
  return createCookie(APPLE_OAUTH_STATE_COOKIE_NAME, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: secure,
  });
}

export async function saveAppleOauthState(state: string, secure: boolean) {
  return await appleOauthStateCookie(secure).serialize(state);
}

export async function loadAppleOauthState(cookieHeader: string | null) {
  return await appleOauthStateCookie(false).parse(cookieHeader);
}

export async function clearAppleOauthState(secure: boolean) {
  return await appleOauthStateCookie(secure).serialize("", {
    maxAge: 0,
  });
}
