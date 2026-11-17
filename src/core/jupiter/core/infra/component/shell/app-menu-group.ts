import type { AppMenuEntry } from "#/core/infra/component/shell/app-menu-entry";

/**
 * A run of entries in the menu of apps and pages. A section is drawn apart from
 * the others, with a rule between them; a group is a heading inside one.
 */
export interface AppMenuGroup {
  /** The section it belongs to. */
  section: "apps" | "pages" | "account";
  /** Its heading, if it has one. */
  title: string | null;
  entries: AppMenuEntry[];
}
