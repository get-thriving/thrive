import { createCookie } from "@remix-run/node";

import { NIGHT_MODE_COOKIE_NAME } from "#/core/infra/names";
import { readBooleanCookie } from "#/core/infra/night-mode";

// The cookie security setting is service-level configuration, so callers pass
// it in rather than core reaching into a service's config. No Domain attribute
// is set, which makes the cookie host-only: it goes back to exactly the host
// that served the app, never to the apex domain or a sibling service, and it
// follows whatever host the app is served on.
function nightModeCookie(secure: boolean) {
  return createCookie(NIGHT_MODE_COOKIE_NAME, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: secure,
  });
}

export async function saveNightModePreference(
  useNightMode: boolean,
  secure: boolean,
) {
  return await nightModeCookie(secure).serialize(useNightMode);
}

export async function clearNightModePreference(secure: boolean) {
  return await nightModeCookie(secure).serialize("", {
    maxAge: 0,
  });
}

export function loadNightModePreference(
  cookieHeader: string | null,
): boolean | null {
  return readBooleanCookie(cookieHeader, NIGHT_MODE_COOKIE_NAME);
}
