import { PassThrough, Readable } from "stream";

import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import {
  ENV_HEADER,
  HOSTING_HEADER,
  INSTANCE_HEADER,
  UNIVERSE_HEADER,
  VERSION_HEADER,
  AUTH_TOKEN_NAME,
} from "@jupiter/core/infra/names";
import { getHosting } from "#/core/universe";
import { registerApiClients } from "@jupiter/core/infra/api-clients.server";

import { SERVICE_PROPERTIES } from "~/logic/config.server";
import { getSession } from "~/sessions";

// Single fetch aborts a data stream after this long (it defaults to 4950ms).
// The document render gets a little longer, so React's own abort doesn't fire
// first and cut a stream that is still within its budget.

// Tell core how this service builds an API client: it has sessions, and its
// frontdoor is carried in a cookie.
registerApiClients({
  webApiServerUrl: SERVICE_PROPERTIES.webApiServerUrl,
  readsFrontDoorCookie: true,
  getAuthToken: async (request) => {
    const session = await getSession(request.headers.get("Cookie"));
    if (session === undefined || !session.has(AUTH_TOKEN_NAME)) {
      return undefined;
    }
    return session.get(AUTH_TOKEN_NAME);
  },
  loginPath: "/app/lifecycle/login/local/login",
});

export const streamTimeout = 5000;

const ABORT_DELAY = streamTimeout + 1000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false;
    let done = false;

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          const body = new PassThrough();

          // Say the encoding outright. Left to guess, the browser can read the
          // UTF-8 bytes as Latin-1 - "·" arrives as "Â·" - and every page with
          // a character outside ASCII then fails to hydrate.
          responseHeaders.set("Content-Type", "text/html; charset=utf-8");
          responseHeaders.set(UNIVERSE_HEADER, GLOBAL_PROPERTIES.universe);
          responseHeaders.set(ENV_HEADER, GLOBAL_PROPERTIES.env);
          responseHeaders.set(INSTANCE_HEADER, GLOBAL_PROPERTIES.instance);
          responseHeaders.set(
            HOSTING_HEADER,
            getHosting(GLOBAL_PROPERTIES.universe),
          );
          responseHeaders.set(VERSION_HEADER, GLOBAL_PROPERTIES.version);
          responseHeaders.set("X-Frame-Options", "DENY");

          done = true;

          resolve(
            new Response(
              Readable.toWeb(body) as globalThis.ReadableStream<Uint8Array>,
              {
                headers: responseHeaders,
                status: didError ? 500 : responseStatusCode,
              },
            ),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          done = true;
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          done = true;

          console.error(error);
        },
      },
    );

    setTimeout(() => {
      if (!done) {
        abort();
      }
    }, ABORT_DELAY);
  });
}
