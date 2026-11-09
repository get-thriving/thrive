/**
 * What a route says about its panel in the Strata unit layout: S is 2 units,
 * M is 3, L is 5, and FULL is the whole screen. A panel that may grow takes spare units, one size at most.
 * Routes put it on their `handle`, next to `displayType`; a route without one
 * gets the fallback for its display type (see `strataSpecFor`).
 */
export interface StrataHandle {
  size: "S" | "M" | "L" | "FULL";
  grow?: boolean;
}
