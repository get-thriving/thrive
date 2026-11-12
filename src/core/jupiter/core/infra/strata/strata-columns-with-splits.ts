import type { ColumnSpec } from "#/core/infra/strata/layout";
import type { StrataSplitSpec } from "#/core/infra/strata/strata-split-spec";

const SPLIT_PREFIX = "split:";

/** The key a split's column has, apart from the route columns' keys. */
export function strataSplitKey(splitId: string): string {
  return `${SPLIT_PREFIX}${splitId}`;
}

/** The split a split column's key is for; null for any other key. */
export function strataSplitIdOf(key: string): string | null {
  return key.startsWith(SPLIT_PREFIX) ? key.slice(SPLIT_PREFIX.length) : null;
}

/**
 * The columns for a path with some of its sections split out. Each split
 * column goes right after the route column it comes from, in the order they
 * were opened; a parent with a split out may need less room than with the
 * section inline, so its size follows (the smallest any of its splits asks for).
 * A view of the panel is one of them, of the kind that has no section to go
 * back into.
 */
export function strataColumnsWithSplits(
  path: ColumnSpec[],
  splits: ReadonlyMap<string, StrataSplitSpec>,
  active: string[],
): ColumnSpec[] {
  const columns: ColumnSpec[] = [];
  for (const column of path) {
    const mine = active
      .map((id) => splits.get(id))
      .filter(
        (split): split is StrataSplitSpec =>
          split !== undefined && split.parentKey === column.key,
      );
    const parentSizes = mine
      .map((split) => split.parentSize)
      .filter((size): size is NonNullable<typeof size> => size !== undefined);
    columns.push(
      parentSizes.length > 0
        ? { ...column, size: Math.min(...parentSizes) as 1 | 2 | 3 }
        : column,
    );
    for (const split of mine) {
      columns.push({
        key: strataSplitKey(split.id),
        kind: split.view === true ? "view" : "split",
        size: split.size,
        grow: split.grow,
      });
    }
  }
  return columns;
}
