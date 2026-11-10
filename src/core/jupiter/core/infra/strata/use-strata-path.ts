import { useMatches } from "react-router";

import { strataPathFrom } from "#/core/infra/strata/strata-path-from";
import type { ColumnSpec } from "#/core/infra/strata/layout";

/** The panels the current URL opens, for the Strata unit layout. */
export function useStrataPath(): ColumnSpec[] {
  return strataPathFrom(useMatches());
}
