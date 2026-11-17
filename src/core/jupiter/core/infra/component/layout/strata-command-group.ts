import type { StrataCommand } from "#/core/infra/component/layout/strata-command";

/** The commands that belong under one title, a section's or the column's. */
export interface StrataCommandGroup {
  title: string;
  commands: StrataCommand[];
  /**
   * They are the entries of the `⋯` menu of the column, which are rarely
   * wanted, so the menu of commands keeps them apart, last, in a column of
   * their own.
   */
  menu: boolean;
}
