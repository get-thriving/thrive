import { useContext } from "react";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import type { StrataPlacedSlot } from "#/core/infra/strata/strata-layout-for";
import type { StrataLevel } from "#/core/infra/strata/strata-level";

interface UseStrataColumn {
  /** Whether this panel is laid out as a column, rather than as it always was. */
  active: boolean;
  column: StrataPlacedSlot | null;
  /** Where the columns start, for the frame to use before it is placed. */
  offsetLeft: number;
  /** Whether the panel may slide when it moves. */
  animate: boolean;
  focus: () => void;
}

/**
 * Lets a panel take its place among the Strata columns (ADR 0020). There is
 * one panel per level on the open path, so the level says which one it is.
 */
export function useStrataColumn(level: StrataLevel): UseStrataColumn {
  const api = useContext(StrataColumnsContext);
  const active = api !== null;

  return {
    active,
    column: active && api !== null ? api.columnFor(level) : null,
    offsetLeft: api?.offsetLeft ?? 0,
    animate: api?.animate ?? false,
    focus: () => api?.focus(level),
  };
}
