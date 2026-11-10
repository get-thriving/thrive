import { strataSpecFor } from "#/core/infra/strata/strata-spec-for";
import type { ColumnSpec } from "#/core/infra/strata/layout";

/**
 * The panels the matched routes open, left to right: trunk, branch, leaf,
 * leaflet. Matches that are not panels are left out.
 */
export function strataPathFrom(
  matches: ReadonlyArray<{ id: string; handle: unknown }>,
): ColumnSpec[] {
  const path: ColumnSpec[] = [];
  for (const match of matches) {
    const spec = strataSpecFor(match.id, match.handle);
    if (spec !== null) {
      path.push(spec);
    }
  }
  return path;
}
