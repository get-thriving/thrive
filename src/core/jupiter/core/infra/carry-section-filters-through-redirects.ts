import type { MiddlewareFunction } from "react-router";

import { withSectionFiltersAfterAction } from "#/core/infra/section-filters-after-action";

/**
 * Route middleware for the root route: an action that redirects keeps the
 * layout of the page it was posted from, as links do (ADR 0014, ADR 0021). The
 * section filters in the URL of the request, such as the sections that are
 * collapsed or split out, are added to the redirect's `Location`. This is here
 * once so that no action has to remember to do it.
 */
export const carrySectionFiltersThroughRedirects: MiddlewareFunction<
  Response
> = async ({ request }, next) => {
  const response = await next();
  const location = response.headers.get("Location");
  if (
    request.method === "GET" ||
    request.method === "HEAD" ||
    location === null ||
    response.status < 300 ||
    response.status > 399
  ) {
    return response;
  }
  const carried = withSectionFiltersAfterAction(location, new URL(request.url));
  if (carried === location) {
    return response;
  }
  const headers = new Headers(response.headers);
  headers.set("Location", carried);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
