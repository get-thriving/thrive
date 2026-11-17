/** A status in a column's header, such as `● published`. */
export interface ColumnChip {
  id: string;
  label: string;
  /** What clicking it does, said for the pointer and for screen readers. */
  title: string;
  /** Drawn in the colour of what is good news, with a dot before it. */
  live?: boolean;
  onClick: () => void;
}
