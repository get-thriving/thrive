import type { SlotState } from "#/core/infra/strata/layout";

/** A section of a column, as the map lists it. */
export interface StrataMapSection {
  /** The section's id, which is its DOM id. */
  id: string;
  title: string;
}

/** One open column, as the map shows it. */
export interface StrataMapColumn {
  /** The column's key in the layout. */
  key: string;
  /** What the column is: its role, or the section a split column holds. */
  label: string;
  /** The route column whose subject it is; a split shares it. */
  subject: number;
  focused: boolean;
  state: SlotState;
  /**
   * The sections of its stack, in the order they are on the page. A split
   * column has none: its one section is the column.
   */
  sections: StrataMapSection[];
}
