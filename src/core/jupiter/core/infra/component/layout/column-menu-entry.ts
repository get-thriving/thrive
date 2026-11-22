/** One command in the `⋯` menu of a column's header. */
export interface ColumnMenuEntry {
  /** The id of the menu item, which tests and links find it by. */
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  /** A command that destroys something, drawn in the danger colour. */
  danger?: boolean;
  /** The key that does the same, shown at the right of the entry. */
  hint?: string;
  /** Set apart from the entries before it by a divider. */
  divided?: boolean;
}
