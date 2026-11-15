/** What running a command does, which the menu of commands tells apart. */
export enum StrataCommandKind {
  /** Goes to a page, as a link does. */
  NAVIGATE = "navigate",
  /** Does something, as a button of a section does: create, add, archive. */
  ACTION = "action",
  /** Sets a filter of a section, or takes one of its choices off. */
  FILTER = "filter",
  /** An entry of the `⋯` menu of the column. */
  MENU = "menu",
  /**
   * The way along the collection the open item is in: the previous item and
   * the next. Listed first in the column's menu.
   */
  POSITION = "position",
  /**
   * How a section is laid out: collapsed or expanded, split out into a column
   * or folded back. Listed last under the section's title.
   */
  LAYOUT = "layout",
}
