/** Where the layout puts a column, in pixels from the window's left edge. */
export interface ColumnPlacement {
  left: number;
  width: number;
  /** Folded to a spine the user can click to bring back. */
  folded: boolean;
}
