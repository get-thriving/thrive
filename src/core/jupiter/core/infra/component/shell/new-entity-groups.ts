import type { WorkspaceFeature } from "@jupiter/webapi-client";

import { NEW_ENTITY_CATALOG } from "#/core/infra/component/shell/new-entity-catalog";
import type { NewEntityGroup } from "#/core/infra/component/shell/new-entity-group";

/** What decides which kinds of item the menu has. */
export interface NewEntityInput {
  /**
   * Whether an app that is gated on workspace features is available, as the
   * rail decides it: when any of them is.
   */
  isAvailable: (features: WorkspaceFeature[]) => boolean;
}

/**
 * The menu of new items that `n` opens (ADR 0021): the kinds of item the
 * workspace can create, by app, in the order of the rail. An app whose features
 * are not available to the workspace is left out, as it is from the rail.
 */
export function newEntityGroups(input: NewEntityInput): NewEntityGroup[] {
  return NEW_ENTITY_CATALOG.filter(
    (group) =>
      group.features === undefined || input.isAvailable(group.features),
  );
}
