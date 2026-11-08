import { LeafPanelExpansionState } from "#/core/infra/leaf-panel-expansion";
import { strataColumns } from "#/core/infra/component/strata-tokens";

// Past the leaf's own max, for the two larger states.
const LARGE_LEAF_WIDTH = 720;
// More than any window has, so the columns to its left fold away.
const FULL_LEAF_WIDTH = 4000;

/** What a leaf's expansion state asks of the column layout (ADR 0019). */
export function leafColumnWidth(
  expansionState: LeafPanelExpansionState,
): number {
  switch (expansionState) {
    case LeafPanelExpansionState.SMALL:
      return strataColumns.leaf.default;
    case LeafPanelExpansionState.MEDIUM:
      return strataColumns.leaf.max;
    case LeafPanelExpansionState.LARGE:
      return LARGE_LEAF_WIDTH;
    case LeafPanelExpansionState.FULL:
      return FULL_LEAF_WIDTH;
  }
}
