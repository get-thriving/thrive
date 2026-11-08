import { useContext, useLayoutEffect } from "react";

import type { ColumnKind } from "#/core/infra/component/layout/column-kind";
import type { ColumnPlacement } from "#/core/infra/component/layout/column-placement";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface UseStrataColumn {
  /** Whether this panel is laid out as a column, rather than as it always was. */
  active: boolean;
  placement: ColumnPlacement | null;
  /** Where the columns start, for the frame to use before it is placed. */
  offsetLeft: number;
  unfold: () => void;
}

/**
 * Lets a panel take its place among the Strata columns (ADR 0019). `id` is
 * unique per level, as there is one trunk, one branch and so on open at a time.
 */
export function useStrataColumn(
  id: string,
  kind: ColumnKind,
  width: number,
  minWidth: number,
): UseStrataColumn {
  const api = useContext(StrataColumnsContext);
  const isBigScreen = useBigScreen();
  const active = api !== null && isBigScreen;

  const register = api?.register;
  const unregister = api?.unregister;

  // Leaving the layout is its own effect, so a column that only changes width
  // does not count as a column that closed.
  useLayoutEffect(() => {
    if (!active || unregister === undefined) {
      return;
    }
    return () => unregister(id);
  }, [active, unregister, id]);

  useLayoutEffect(() => {
    if (!active || register === undefined) {
      return;
    }
    register(id, { kind, width, minWidth });
  }, [active, register, id, kind, width, minWidth]);

  return {
    active,
    placement: active && api !== null ? api.placementFor(id) : null,
    offsetLeft: api?.offsetLeft ?? 0,
    unfold: () => api?.unfold(id),
  };
}
