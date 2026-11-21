import type { MiddlewareFunction } from "react-router";
import { describe, expect, it } from "vitest";

import { carrySectionFiltersThroughRedirects } from "#/core/infra/carry-section-filters-through-redirects";

type Args = Parameters<MiddlewareFunction<Response>>[0];

/** What a form posts: the data request of the page it is on, and that page's URL. */
function postedFrom(page: string, search: string): Args {
  return {
    request: new Request(`http://thrive.test${page}.data${search}`, {
      method: "POST",
    }),
    url: new URL(`http://thrive.test${page}${search}`),
  } as unknown as Args;
}

function redirectTo(location: string, status = 302) {
  return async () =>
    new Response(null, { status, headers: { Location: location } });
}

describe("carrySectionFiltersThroughRedirects", () => {
  it("carries the filters of the page posted from, which is a data request", async () => {
    const response = await carrySectionFiltersThroughRedirects(
      postedFrom("/app/workspace/apps/todos/new", "?todos%5Bview%5D=board"),
      redirectTo("/app/workspace/apps/todos/7"),
    );

    expect(response?.headers.get("Location")).toBe(
      "/app/workspace/apps/todos/7?todos%5Bview%5D=board",
    );
  });

  it("carries them back to the list, as when a todo is updated", async () => {
    const response = await carrySectionFiltersThroughRedirects(
      postedFrom("/app/workspace/apps/todos/7", "?todos%5Bview%5D=board"),
      redirectTo("/app/workspace/apps/todos"),
    );

    expect(response?.headers.get("Location")).toBe(
      "/app/workspace/apps/todos?todos%5Bview%5D=board",
    );
  });

  it("leaves a redirect somewhere else alone", async () => {
    const response = await carrySectionFiltersThroughRedirects(
      postedFrom("/app/workspace/apps/todos/new", "?todos%5Bview%5D=board"),
      redirectTo("/app/workspace/apps/habits"),
    );

    expect(response?.headers.get("Location")).toBe(
      "/app/workspace/apps/habits",
    );
  });

  it("leaves what is not a redirect alone", async () => {
    const response = await carrySectionFiltersThroughRedirects(
      postedFrom("/app/workspace/apps/todos/new", "?todos%5Bview%5D=board"),
      async () => new Response("ok", { status: 200 }),
    );

    expect(response?.status).toBe(200);
    expect(response?.headers.get("Location")).toBeNull();
  });
});
