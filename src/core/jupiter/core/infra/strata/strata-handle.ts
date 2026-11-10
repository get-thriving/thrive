/**
 * What a route says about its panel in the Strata layout: S is 1 unit, M is 2,
 * B is 3, and FULL is the whole screen. A panel that may grow takes spare
 * units, one at a time, rightmost first. Routes put it on their `handle`, next
 * to `displayType`; a route without one gets the fallback for its display type
 * (see `strataSpecFor`).
 */
export interface StrataHandle {
  size: "S" | "M" | "B" | "FULL";
  grow?: boolean;
}
