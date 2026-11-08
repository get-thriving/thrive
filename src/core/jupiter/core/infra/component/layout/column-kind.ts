/**
 * The levels of the Strata column layout (ADR 0019), left to right. The number
 * is the order the columns sit in.
 */
export enum ColumnKind {
  TRUNK = 0,
  BRANCH = 1,
  LEAF = 2,
  LEAFLET = 3,
}
