import { useContext } from "react";
import { UNSAFE_RouteContext, useMatches } from "react-router";

import { strataMatchLabel } from "#/core/infra/strata/strata-match-label";

/**
 * What the route this component is rendered by calls its panel (the `label` of
 * its `handle`), or null when it says none or cannot say yet. A panel that is
 * not one entity (a list, a page that makes one) is titled by it.
 */
export function useRouteLabel(): string | null {
  const route = useContext(UNSAFE_RouteContext);
  const matches = useMatches();
  const own = route.matches[route.matches.length - 1]?.route.id;
  const match = matches.find((candidate) => candidate.id === own);
  return match === undefined ? null : strataMatchLabel(match);
}
