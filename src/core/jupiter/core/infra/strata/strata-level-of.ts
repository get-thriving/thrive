import { DisplayType } from "#/core/infra/component/use-nested-entities";
import type { StrataLevel } from "#/core/infra/strata/strata-level";

/** The panel level a route's `handle` declares, or null when it is no panel. */
export function strataLevelOf(handle: unknown): StrataLevel | null {
  if (typeof handle !== "object" || handle === null) {
    return null;
  }
  if (!("displayType" in handle)) {
    return null;
  }
  switch (handle.displayType) {
    case DisplayType.TRUNK:
    case DisplayType.BRANCH:
    case DisplayType.LEAF:
    case DisplayType.LEAFLET:
    case DisplayType.TOOL:
      return handle.displayType;
    default:
      return null;
  }
}
