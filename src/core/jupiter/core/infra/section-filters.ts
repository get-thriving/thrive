/**
 * Section filters that live in the URL.
 *
 * Every panel that shows a SectionActions with filters names itself with a
 * panel id, and every filter in it with a filter name. The choice made in a
 * filter is kept in the query string as `panel[filter]=value` - repeated for
 * filters that take many values - so that a page can be linked to, reloaded,
 * or come back to from one of its panels just as it was being looked at.
 *
 * Pages load everything and filter on the client, so a change in these
 * params is never a reason to load a page's data again. The helpers here say
 * which params are filters, and teach `shouldRevalidate` to look past them.
 */
import type { ShouldRevalidateFunction } from "react-router";

// A deliberate "load it all again", which nothing here stands in the way of.
const INVALIDATE_TOP_LEVEL_PARAM = "invalidateTopLevel";

const PANEL_ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FILTER_NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SECTION_FILTER_PARAM_RE =
  /^([a-z0-9]+(?:-[a-z0-9]+)*)\[([a-z0-9]+(?:-[a-z0-9]+)*)\]$/;

/** The query param a filter of a panel is kept in. */
export function sectionFilterParam(
  panelId: string,
  filterName: string,
): string {
  if (!PANEL_ID_RE.test(panelId)) {
    throw new Error(`Invalid section filter panel id "${panelId}"`);
  }
  if (!FILTER_NAME_RE.test(filterName)) {
    throw new Error(`Invalid section filter name "${filterName}"`);
  }
  return `${panelId}[${filterName}]`;
}

/** The panel a query param holds a filter for, if it holds one at all. */
export function sectionFilterPanelOf(param: string): string | undefined {
  const match = SECTION_FILTER_PARAM_RE.exec(param);
  return match === null ? undefined : match[1];
}

export function isSectionFilterParam(param: string): boolean {
  return SECTION_FILTER_PARAM_RE.test(param);
}

/** The query string without any of the section filters, sorted for comparing. */
export function searchWithoutSectionFilters(search: URLSearchParams): string {
  const entries = Array.from(search.entries()).filter(
    ([key]) => !isSectionFilterParam(key),
  );
  entries.sort(([ka, va], [kb, vb]) =>
    ka === kb ? va.localeCompare(vb) : ka.localeCompare(kb),
  );
  return new URLSearchParams(entries).toString();
}

/**
 * Copies the filters of the panels in `panelPaths` from `currentSearch` onto
 * `to`, for those panels which are still on screen where `to` leads - that is,
 * whose path `to` is at or under. Filters `to` already says something about
 * are left as `to` has them.
 */
export function withSectionFiltersPreserved(
  to: string,
  currentSearch: URLSearchParams,
  panelPaths: ReadonlyMap<string, string>,
): string {
  if (!to.startsWith("/") || to.startsWith("//")) {
    // Relative or off-site links are left alone.
    return to;
  }

  const target = new URL(to, "http://thrive.invalid");
  const keysAlreadyInTarget = new Set(target.searchParams.keys());
  let changed = false;

  for (const [key, value] of currentSearch.entries()) {
    if (keysAlreadyInTarget.has(key)) {
      continue;
    }
    const panelId = sectionFilterPanelOf(key);
    if (panelId === undefined) {
      continue;
    }
    const panelPath = panelPaths.get(panelId);
    if (
      panelPath === undefined ||
      !isPathAtOrUnder(target.pathname, panelPath)
    ) {
      continue;
    }
    target.searchParams.append(key, value);
    changed = true;
  }

  if (!changed) {
    return to;
  }

  return `${target.pathname}${target.search}${target.hash}`;
}

function isPathAtOrUnder(pathname: string, prefix: string): boolean {
  const cleanPrefix = prefix.replace(/\/+$/, "");
  const cleanPathname = pathname.replace(/\/+$/, "");
  return (
    cleanPathname === cleanPrefix || cleanPathname.startsWith(`${cleanPrefix}/`)
  );
}

/**
 * Wraps a `shouldRevalidate` so that moving to a URL which differs from the
 * current one only in section filters doesn't load anything again. Pages load
 * all their data and filter on the client, so the filters are never a reason
 * to go back to the server.
 *
 * Actions, and the revalidation that follows them, always get through, as do
 * `useRevalidator()` calls (which ask with the URL the page is already on) and
 * anything asking for the top level to be loaded again.
 */
export function ignoringSectionFilterChanges(
  inner: ShouldRevalidateFunction,
): ShouldRevalidateFunction {
  return (args) => {
    if (
      args.formMethod === undefined &&
      !args.nextUrl.searchParams.has(INVALIDATE_TOP_LEVEL_PARAM) &&
      urlWithoutHash(args.currentUrl) !== urlWithoutHash(args.nextUrl) &&
      searchWithoutSectionFilters(args.currentUrl.searchParams) ===
        searchWithoutSectionFilters(args.nextUrl.searchParams) &&
      noSharedParamChanged(args.currentParams, args.nextParams)
    ) {
      // Either the very same page with other filters, or a panel opening or
      // closing below this one (params only appear or disappear). A route on
      // screen in both places keeps its own params, so none of those changed.
      return false;
    }

    return inner(args);
  };
}

function noSharedParamChanged(
  currentParams: Record<string, string | undefined>,
  nextParams: Record<string, string | undefined>,
): boolean {
  for (const [key, value] of Object.entries(currentParams)) {
    if (key in nextParams && nextParams[key] !== value) {
      return false;
    }
  }
  return true;
}

function urlWithoutHash(url: URL): string {
  return `${url.pathname}${url.search}`;
}
