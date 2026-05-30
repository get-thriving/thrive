import { createCookie } from "@remix-run/node";

import { SERVICE_PROPERTIES } from "#/core/config-server";
import { GOOGLE_OAUTH_STATE_COOKIE_NAME } from "#/core/infra/names";

const googleOauthStateCookie = createCookie(GOOGLE_OAUTH_STATE_COOKIE_NAME, {
  httpOnly: true,
  maxAge: 60 * 10,
  path: "/",
  sameSite: "lax",
  secure: SERVICE_PROPERTIES.sessionCookieSecure,
});

export async function saveGoogleOauthState(state: string) {
  return await googleOauthStateCookie.serialize(state);
}

export async function loadGoogleOauthState(cookieHeader: string | null) {
  return await googleOauthStateCookie.parse(cookieHeader);
}
