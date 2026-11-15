/** One command in the `⋯` menu of a column's header. */
export interface ColumnMenuEntry {
  /** The id of the menu item, which tests and links find it by. */
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  /** A command that destroys something, drawn in the danger colour. */
  danger?: boolean;
  /** Set apart from the entries before it by a divider. */
  divided?: boolean;
}
