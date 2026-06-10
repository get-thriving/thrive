import { PassThrough, Readable } from "stream";

import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream } from "react-dom/server";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import {
  ENV_HEADER,
  HOSTING_HEADER,
  INSTANCE_HEADER,
  UNIVERSE_HEADER,
  VERSION_HEADER,
} from "@jupiter/core/infra/names";
import { getHosting } from "#/core/universe";

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false;
    let done = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");
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
