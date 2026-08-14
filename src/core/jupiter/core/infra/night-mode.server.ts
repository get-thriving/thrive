import { createCookie } from "@remix-run/node";

import { NIGHT_MODE_COOKIE_NAME } from "#/core/infra/names";
import { readBooleanCookie } from "#/core/infra/night-mode";

function nightModeCookie(secure: boolean, domain?: string) {
  return createCookie(NIGHT_MODE_COOKIE_NAME, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: secure,
    domain: domain,
  });
}

export async function saveNightModePreference(
  useNightMode: boolean,
  secure: boolean,
  domain?: string,
) {
  return await nightModeCookie(secure, domain).serialize(useNightMode);
}

export async function clearNightModePreference(
  secure: boolean,
  domain?: string,
) {
  return await nightModeCookie(secure, domain).serialize("", {
    maxAge: 0,
  });
}

export function loadNightModePreference(
  cookieHeader: string | null,
): boolean | null {
  return readBooleanCookie(cookieHeader, NIGHT_MODE_COOKIE_NAME);
}
