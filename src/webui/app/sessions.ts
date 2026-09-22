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
      // No Domain attribute, so the cookie is host-only: the browser sends it
      // back to exactly the host that served the app and to nothing else. That
      // is narrower than naming a domain - a cookie with `Domain=x` also goes
      // to every subdomain of x - and it follows whatever host the app is
      // actually served on, which a configured URL cannot do for per-PR
      // preview hosts.
      secrets: [SERVICE_PROPERTIES.sessionCookieSecret],
    },
  });

export { getSession, commitSession, destroySession };
