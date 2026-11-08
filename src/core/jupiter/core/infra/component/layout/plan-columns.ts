import { ColumnKind } from "#/core/infra/component/layout/column-kind";
import type { ColumnPlacement } from "#/core/infra/component/layout/column-placement";
import type { ColumnSpec } from "#/core/infra/component/layout/column-spec";
import { strataColumns } from "#/core/infra/component/strata-tokens";

/**
 * Lay out the open columns side by side in the room there is (ADR 0019).
 *
 * Every column keeps its own width except one, which takes whatever is left:
 * the leaflet if there is one, otherwise the trunk, so with only a list and a
 * leaf open the list fills the window as it did before columns. When the
 * columns do not fit, the oldest fold to spines. `forcedFrom` is the first
 * column to show, set when the user clicks a spine; the row then runs past the
 * window edge rather than fold something else.
 */
export function planColumns(
  specs: Record<string, ColumnSpec>,
  available: number,
  offsetLeft: number,
  forcedFrom: number | null,
): Record<string, ColumnPlacement> {
  const entries = Object.entries(specs).sort(([, a], [, b]) => a.kind - b.kind);
  const count = entries.length;
  if (count === 0) {
    return {};
  }

  const leafletIndex = entries.findIndex(
    ([, s]) => s.kind === ColumnKind.LEAFLET,
  );
  const trunkIndex = entries.findIndex(([, s]) => s.kind === ColumnKind.TRUNK);
  const flexIndex =
    leafletIndex >= 0 ? leafletIndex : trunkIndex >= 0 ? trunkIndex : count - 1;

  function effectiveFlex(from: number): number {
    // A folded flex column hands the job to the newest one.
    return from > flexIndex ? count - 1 : flexIndex;
  }

  function needed(from: number): number {
    const flex = effectiveFlex(from);
    let total = from * strataColumns.spine;
    for (let i = from; i < count; i++) {
      const spec = entries[i][1];
      total += i === flex ? spec.minWidth : spec.width;
    }
    return total;
  }

  let from = 0;
  if (forcedFrom !== null) {
    from = Math.min(Math.max(forcedFrom, 0), count - 1);
  } else {
    while (from < count - 1 && needed(from) > available) {
      from += 1;
    }
  }

  const flex = effectiveFlex(from);
  let fixedTotal = from * strataColumns.spine;
  for (let i = from; i < count; i++) {
    if (i !== flex) {
      fixedTotal += entries[i][1].width;
    }
  }

  const result: Record<string, ColumnPlacement> = {};
  let left = offsetLeft;
  entries.forEach(([id, spec], i) => {
    if (i < from) {
      result[id] = { left, width: strataColumns.spine, folded: true };
      left += strataColumns.spine;
      return;
    }
    const width =
      i === flex ? Math.max(spec.minWidth, available - fixedTotal) : spec.width;
    result[id] = { left, width, folded: false };
    left += width;
  });
  return result;
}
