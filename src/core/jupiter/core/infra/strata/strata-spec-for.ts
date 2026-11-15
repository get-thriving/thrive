import { DisplayType } from "#/core/infra/component/use-nested-entities";
import type { StrataHandle } from "#/core/infra/strata/strata-handle";
import type { StrataLevel } from "#/core/infra/strata/strata-level";
import { strataLevelOf } from "#/core/infra/strata/strata-level-of";
import type { ColumnSize, ColumnSpec } from "#/core/infra/strata/layout";

const SIZE_UNITS: Record<StrataHandle["size"], ColumnSize> = {
  S: 1,
  M: 2,
  B: 3,
  FULL: "full",
};

/** For a route with no `strata` on its handle. */
const FALLBACKS: Record<StrataLevel, StrataHandle> = {
  [DisplayType.TRUNK]: { size: "B" },
  [DisplayType.BRANCH]: { size: "B" },
  [DisplayType.LEAF]: { size: "M" },
  [DisplayType.LEAFLET]: { size: "M" },
  [DisplayType.TOOL]: { size: "B" },
};

function isStrataHandle(value: unknown): value is StrataHandle {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const { size, grow } = value as Record<string, unknown>;
  return (
    (size === "S" || size === "M" || size === "B" || size === "FULL") &&
    (grow === undefined || typeof grow === "boolean")
  );
}

/**
 * The panel a matched route makes in the unit layout, or null when it is not a
 * panel (the root, the workspace shell and the like). `key` is the match id.
 */
export function strataSpecFor(key: string, handle: unknown): ColumnSpec | null {
  const level = strataLevelOf(handle);
  if (level === null) {
    return null;
  }
  const declared = (handle as { strata?: unknown }).strata;
  const strata = isStrataHandle(declared) ? declared : FALLBACKS[level];
  return {
    key,
    kind: "route",
    size: SIZE_UNITS[strata.size],
    grow: strata.grow ?? false,
  };
}
