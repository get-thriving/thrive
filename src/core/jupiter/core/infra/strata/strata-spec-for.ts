import { DisplayType } from "#/core/infra/component/use-nested-entities";
import type { StrataHandle } from "#/core/infra/strata/strata-handle";
import type { StrataLevel } from "#/core/infra/strata/strata-level";
import { strataLevelOf } from "#/core/infra/strata/strata-level-of";
import type { PanelSize, PanelSpec } from "#/core/infra/strata/units";

const SIZE_UNITS: Record<StrataHandle["size"], PanelSize> = {
  S: 2,
  M: 3,
  L: 5,
  FULL: "full",
};

/** For a route with no `strata` on its handle: a leaf or leaflet is small. */
const FALLBACKS: Record<StrataLevel, StrataHandle> = {
  [DisplayType.TRUNK]: { size: "M" },
  [DisplayType.BRANCH]: { size: "M" },
  [DisplayType.LEAF]: { size: "S" },
  [DisplayType.LEAFLET]: { size: "S" },
  [DisplayType.TOOL]: { size: "M" },
};

function isStrataHandle(value: unknown): value is StrataHandle {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const { size, grow } = value as Record<string, unknown>;
  return (
    (size === "S" || size === "M" || size === "L" || size === "FULL") &&
    (grow === undefined || typeof grow === "boolean")
  );
}

/**
 * The panel a matched route makes in the unit layout, or null when it is not a
 * panel (the root, the workspace shell and the like). `key` is the match id.
 */
export function strataSpecFor(key: string, handle: unknown): PanelSpec | null {
  const level = strataLevelOf(handle);
  if (level === null) {
    return null;
  }
  const declared = (handle as { strata?: unknown }).strata;
  const strata = isStrataHandle(declared) ? declared : FALLBACKS[level];
  return {
    key,
    size: SIZE_UNITS[strata.size],
    grow: strata.grow ?? false,
  };
}
