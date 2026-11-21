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
 * the places where the panel is still on screen or is going to be. A page that
 * makes an entity (`new`, `new-from-wish`) goes to the entity it made, which is
 * next to it, so that counts too: the list the user came from stays as it was.
 * Anywhere else the redirect is left as it was. Filters the redirect already
 * has are kept as it has them.
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

/**
 * Whether the page redirected to is the page posted from, is under it or above
 * it, or is next to a page that makes an entity, which is where that goes.
 * Two other pages next to each other are not related: the filters of an entity's
 * panel are about that entity.
 */
function isRelated(target: string, page: string): boolean {
  const pt = target.replace(/\/+$/, "");
  const pp = page.replace(/\/+$/, "");
  return (
    pt === pp ||
    pt.startsWith(`${pp}/`) ||
    pp.startsWith(`${pt}/`) ||
    (makesAnEntity(pp) && parentOf(pt) === parentOf(pp))
  );
}

/** `.../new`, `.../new-from-wish`: the pages that make an entity. */
function makesAnEntity(path: string): boolean {
  const last = path.slice(path.lastIndexOf("/") + 1);
  return last === "new" || last.startsWith("new-");
}

function parentOf(path: string): string {
  return path.slice(0, path.lastIndexOf("/"));
}
