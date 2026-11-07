import { UiStyle } from "@jupiter/webapi-client";
import { createCookie } from "react-router";

import { UI_STYLE_COOKIE_NAME } from "#/core/infra/names";

// Same shape as the night mode cookie: service-level `secure` is passed in, and
// no Domain attribute is set, so the cookie stays host-only.
function uiStyleCookie(secure: boolean) {
  return createCookie(UI_STYLE_COOKIE_NAME, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: secure,
  });
}

export async function saveUiStylePreference(uiStyle: UiStyle, secure: boolean) {
  return await uiStyleCookie(secure).serialize(uiStyle);
}

export async function clearUiStylePreference(secure: boolean) {
  return await uiStyleCookie(secure).serialize("", { maxAge: 0 });
}

export async function loadUiStylePreference(
  cookieHeader: string | null,
): Promise<UiStyle | null> {
  // `createCookie` stores the value as base64 JSON, so it has to read it back.
  const value = await uiStyleCookie(false).parse(cookieHeader);
  return Object.values(UiStyle).includes(value as UiStyle)
    ? (value as UiStyle)
    : null;
}
