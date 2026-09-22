import { createCookie } from "@remix-run/node";

import { GOOGLE_OAUTH_STATE_COOKIE_NAME } from "#/core/infra/names";

// The cookie security setting is service-level configuration, so callers pass
// it in rather than core reaching into a service's config. No Domain attribute
// is set, which makes the cookie host-only: it goes back to exactly the host
// that served the app, never to the apex domain or a sibling service, and it
// follows whatever host the app is served on.
function googleOauthStateCookie(secure: boolean) {
  return createCookie(GOOGLE_OAUTH_STATE_COOKIE_NAME, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: secure,
  });
}

export async function saveGoogleOauthState(state: string, secure: boolean) {
  return await googleOauthStateCookie(secure).serialize(state);
}

export async function loadGoogleOauthState(cookieHeader: string | null) {
  return await googleOauthStateCookie(false).parse(cookieHeader);
}

export async function clearGoogleOauthState(secure: boolean) {
  return await googleOauthStateCookie(secure).serialize("", {
    maxAge: 0,
  });
}
