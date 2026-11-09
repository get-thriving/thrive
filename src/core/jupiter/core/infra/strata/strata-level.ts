import type { DisplayType } from "#/core/infra/component/use-nested-entities";

/**
 * The route display types that are panels of the unit layout: the open path is
 * trunk, branch, leaf, leaflet, and a tool page stands where a trunk would.
 */
export type StrataLevel =
  | DisplayType.TRUNK
  | DisplayType.BRANCH
  | DisplayType.LEAF
  | DisplayType.LEAFLET
  | DisplayType.TOOL;
