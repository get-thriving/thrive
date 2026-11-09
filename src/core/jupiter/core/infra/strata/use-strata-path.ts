import { useMatches } from "react-router";

import { strataPathFrom } from "#/core/infra/strata/strata-path-from";
import type { PanelSpec } from "#/core/infra/strata/units";

/** The panels the current URL opens, for the Strata unit layout. */
export function useStrataPath(): PanelSpec[] {
  return strataPathFrom(useMatches());
}
