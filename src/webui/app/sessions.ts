import type { AuthTokenExt } from "@jupiter/webapi-client";
import { createCookieSessionStorage } from "@remix-run/node";
import { SESSION_COOKIE_NAME } from "@jupiter/core/infra/names";

import { SERVICE_PROPERTIES } from "~/logic/config.server";

export class SessionInfoNotFoundError extends Error {
  constructor() {
    super("Session info not found");
  }
}

export interface SessionInfo {
  authTokenExt: AuthTokenExt;
}

export interface SessionFlashInfo {
  error: string;
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: SESSION_COOKIE_NAME,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax", // Not strict because of https://github.com/oauth2-proxy/oauth2-proxy/issues/830
      secure: SERVICE_PROPERTIES.sessionCookieSecure,
      // Pin to the WebUI host (e.g. app.get-thriving.com) so the session is
      // never shared with the apex domain or other subdomains. Undefined in
      // local dev yields a host-only cookie.
      domain: SERVICE_PROPERTIES.sessionCookieDomain,
      secrets: [SERVICE_PROPERTIES.sessionCookieSecret],
    },
  });

export { getSession, commitSession, destroySession };
