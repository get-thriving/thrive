import type { StrataLabel } from "#/core/infra/strata/strata-label";
import { strataEntityName } from "#/core/infra/strata/strata-entity-name";
import { strataLastSegment } from "#/core/infra/strata/strata-last-segment";

/**
 * The label of the route of an entity: its name, found in what the route
 * loaded by the id the url ends with (`strataEntityName`), or, when it has none
 * or the data is not there, what it is and its id (`Habit 3`), which `noun` says.
 */
export function strataEntityLabel(noun: string): StrataLabel {
  return ({ loaderData, pathname }) => {
    const id = strataLastSegment(pathname);
    return strataEntityName(loaderData, id) ?? `${noun} ${id}`.trim();
  };
}
