import type { ColumnKind } from "#/core/infra/component/layout/column-kind";

/** What a column asks of the layout, in pixels. */
export interface ColumnSpec {
  kind: ColumnKind;
  /** The width it keeps when it is not the one that takes the leftover room. */
  width: number;
  /** The least it can be squeezed to before columns to its left fold. */
  minWidth: number;
}
