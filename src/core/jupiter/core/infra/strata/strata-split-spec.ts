import type { UnitSize } from "#/core/infra/strata/layout";

/**
 * A section which can come out of its column and stand as a column of its own
 * (ADR 0021), or one of a panel's views (its history, say). The section or the
 * panel registers it while it is on screen.
 */
export interface StrataSplitSpec {
  /** The section's or view's id, which is also what the URL keeps. */
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
  /**
   * A view of the panel rather than a section of it: it has no place inline, so
   * its column is closed with `×` and not folded back with `⇤`.
   */
  view?: boolean;
}
