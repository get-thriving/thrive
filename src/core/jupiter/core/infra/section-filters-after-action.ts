import {
  sectionFilterPanelOf,
  withSectionFiltersPreserved,
} from "#/core/infra/section-filters";

/**
 * Where an action that redirects should send the browser so that the layout
 * stays as it was: the section filters of the page the action was posted from
 * (collapsed and split sections included, ADR 0014 and 0021) go with the
 * redirect, as links do.
 *
 * A form posts to the URL of the page it is on, query and all, so the filters
 * are in `requestUrl`. The server does not know which route each panel is
 * drawn by, so it takes them all to be at the page that posted, and carries
 * them to the page itself, to a page under it and to one above it, which are
 * the places where the panel is still on screen or is going to be. Anywhere
 * else the redirect is left as it was. Filters the redirect already has are
 * kept as it has them.
 */
export function withSectionFiltersAfterAction(
  location: string,
  requestUrl: URL,
): string {
  if (!location.startsWith("/") || location.startsWith("//")) {
    return location;
  }
  const target = new URL(location, requestUrl);
  if (!isRelated(target.pathname, requestUrl.pathname)) {
    return location;
  }
  const panelPaths = new Map<string, string>();
  for (const key of requestUrl.searchParams.keys()) {
    const panelId = sectionFilterPanelOf(key);
    if (panelId !== undefined) {
      panelPaths.set(panelId, target.pathname);
    }
  }
  return withSectionFiltersPreserved(
    location,
    requestUrl.searchParams,
    panelPaths,
  );
}

/** Whether one path is the other, or is under it. */
function isRelated(a: string, b: string): boolean {
  const pa = a.replace(/\/+$/, "");
  const pb = b.replace(/\/+$/, "");
  return pa === pb || pa.startsWith(`${pb}/`) || pb.startsWith(`${pa}/`);
}
