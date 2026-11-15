import { RAIL_DESTINATIONS } from "#/core/infra/component/shell/rail-destinations";
import type { StrataLabel } from "#/core/infra/strata/strata-label";
import { strataTrunkTitle } from "#/core/infra/strata/strata-trunk-title";

/**
 * The label of the first column of an app: the name of its place on the rail,
 * which is also the title of the column, so `Habits` is said once, for the list
 * of habits and the stacks beside it.
 */
export const strataTrunkLabel: StrataLabel = ({ pathname }) =>
  strataTrunkTitle(pathname, RAIL_DESTINATIONS);
