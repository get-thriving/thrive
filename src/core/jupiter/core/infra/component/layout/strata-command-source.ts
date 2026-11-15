import type { StrataCommand } from "#/core/infra/component/layout/strata-command";

/**
 * Something on screen that has commands: the actions of a section, or the
 * header of a column. It says where it is, so the menu can tell which column
 * and section its commands are for, and gives its commands when asked, as
 * they are by then.
 */
export interface StrataCommandSource {
  /** Where it is drawn; null while it is not. */
  element: () => Element | null;
  commands: () => StrataCommand[];
}
