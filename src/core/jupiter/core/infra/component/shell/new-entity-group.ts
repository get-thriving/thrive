import type { WorkspaceFeature } from "@jupiter/webapi-client";

import type { NewEntityEntry } from "#/core/infra/component/shell/new-entity-entry";

/** The kinds of item of one app or area, under its name. */
export interface NewEntityGroup {
  title: string;
  /** Left out of the menu unless one of these is available to the workspace. */
  features?: WorkspaceFeature[];
  entries: NewEntityEntry[];
}
