/**
 * When the pages of a time plan need their data loaded again.
 *
 * A time plan is one page with a lot hanging off it - the plan, its
 * activities, the calendar of its period, the list of every plan around it -
 * and panels that open on top of all that. Remix reloads everything on screen
 * whenever the query string changes, which a panel does just by opening, so
 * the pages say for themselves what actually makes their data stale.
 */
import type { Params, ShouldRevalidateFunction } from "@remix-run/react";

// A deliberate "load it all again", which nothing here stands in the way of.
const INVALIDATE_TOP_LEVEL_PARAM = "invalidateTopLevel";

// The time plan pages are keyed on the ids in their paths - which plan, which
// activity - and on nothing at all in the query string, which only carries
// how the plan is being looked at and which of its panels is open. Moving
// between two URLs of the same page is therefore no reason to load that page
// again.
//
// Opening a panel is the expensive case. A panel says which event of the
// calendar it was opened from, or where a new one would go, in the query, and
// a query string that isn't the one the page came in with is all it takes for
// Remix to reload every route already on screen. Clicking an event on a time
// plan's calendar was reloading the whole plan, the calendar of its period
// and the list of every time plan, all of it queueing in front of the panel
// that was actually asked for.
export function ignoringTimePlanQueryChanges(
  inner: ShouldRevalidateFunction,
): ShouldRevalidateFunction {
  return (args) => {
    if (
      // An action - and the revalidation that follows one - always gets
      // through, as does anything asking for the top level again.
      args.formMethod === undefined &&
      !args.nextUrl.searchParams.has(INVALIDATE_TOP_LEVEL_PARAM) &&
      // Another plan, or another activity, is other data.
      sameRouteParams(args.currentParams, args.nextParams) &&
      // useRevalidator() asks with the URL the page is already on; that's a
      // request for fresh data rather than a move to somewhere else.
      urlWithoutHash(args.currentUrl) !== urlWithoutHash(args.nextUrl)
    ) {
      return false;
    }

    return inner(args);
  };
}

function urlWithoutHash(url: URL): string {
  return `${url.pathname}${url.search}`;
}

function sameRouteParams(
  currentParams: Params<string>,
  nextParams: Params<string>,
): boolean {
  const keys = new Set([
    ...Object.keys(currentParams),
    ...Object.keys(nextParams),
  ]);

  for (const key of keys) {
    if (currentParams[key] !== nextParams[key]) {
      return false;
    }
  }

  return true;
}
