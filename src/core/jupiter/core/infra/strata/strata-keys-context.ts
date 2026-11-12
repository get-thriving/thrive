/**
 * What decides which keys work right now, as the footer needs to know it: what
 * has the keyboard focus, whether something has taken the keys, and what there
 * is to go through. It is read from the page, and the rule that turns it into
 * keys (`strataFooterKeys`) does not look at the page.
 */
export interface StrataKeysContext {
  /**
   * What took the keys, if something did: hint mode, the map, or the find
   * field.
   */
  overlay: "hints" | "map" | "find" | null;
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
  /**
   * How many items the list at the focus has: the one the focus is in, or the
   * one a key would go into.
   */
  items: number;
  /** How many places the map could jump to. */
  targets: number;
}
