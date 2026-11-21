/**
 * What decides which keys work right now, as the footer needs to know it: what
 * has the keyboard focus, whether something has taken the keys, and what there
 * is to go through. It is read from the page, and the rule that turns it into
 * keys (`strataFooterKeys`) does not look at the page.
 */
export interface StrataKeysContext {
  /**
   * What took the keys, if something did: hint mode, the map, the menu of apps,
   * the menu of new items, the menu of commands (which is searching a filter's many choices, or not),
   * the find field, or the search dialog (with the focus in its query, or on
   * one of its results).
   */
  overlay:
    | "hints"
    | "map"
    | "find"
    | "apps"
    | "new"
    | "commands"
    | "commands-search"
    | "search"
    | "search-results"
    | null;
  /**
   * Where the user is typing: in a field, which `Escape` leaves, or in a dialog
   * or a menu laid over the columns, which have their own way out.
   */
  typing: "field" | "layer" | null;
  /**
   * What has the keyboard focus in the focused column: the column itself, one
   * of its sections, or an item of a list.
   */
  focus: "column" | "section" | "item";
  /** How many columns are open, split columns included. */
  columns: number;
  /** The focused column is a section split out into a column of its own. */
  split: boolean;
  /** How many sections the focused column has in its stack. */
  sections: number;
  /** The section the focus is in can be collapsed: it is not the fixed one. */
  collapsible: boolean;
  /** The section the focus is in can be split out into a column. */
  splittable: boolean;
  /**
   * How many items the list at the focus has: the one the focus is in, or the
   * one a key would go into.
   */
  items: number;
  /**
   * The section or column that `e` goes into has a note, or anything else that
   * can be written in, of its own, and no list: `e` goes into that.
   */
  editable: boolean;
  /** How many places the map could jump to. */
  targets: number;
  /** The focused column holds more than fits, so it has a top and a bottom. */
  scrolls: boolean;
  /**
   * The focused column is an item with a place in a collection, so `o` and `p`
   * go to the one before and after it.
   */
  position: boolean;
  /** The focused column has a menu, which `.` opens. */
  menu: boolean;
  /**
   * The focused column has actions of its own, in its header or in the header
   * of a section, so the menu of commands has something to list.
   */
  commands: boolean;
  /** The focused column has a close control, which `Escape` uses. */
  closable: boolean;
}
