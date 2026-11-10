import type { UnitSize } from "#/core/infra/strata/layout";

/**
 * A section which can come out of its column and stand as a column of its own
 * (ADR 0021). The section registers it while it is on screen.
 */
export interface StrataSplitSpec {
  /** The section's id, which is also what the URL keeps. */
  id: string;
  /** Key of the route column the section is in. */
  parentKey: string;
  /** The section's title, which the split column is named by. */
  title: string;
  /** Units the split column takes. */
  size: UnitSize;
  /** May take spare units, like a route column that grows. */
  grow?: boolean;
  /**
   * The size its parent has while this one is split out of it, for a parent
   * which needs less room without the section inline.
   */
  parentSize?: UnitSize;
}
