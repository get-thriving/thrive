import type { StrataMapColumn } from "#/core/infra/strata/strata-map-column";

/** Something the map jumps to, and so has a label. */
export type StrataMapTarget =
  | { kind: "column"; columnKey: string }
  | { kind: "section"; columnKey: string; sectionId: string };

/**
 * What the map can jump to, in the order it is drawn: each column, and right
 * after it the sections of its stack. Labels are handed out in this order, so
 * a column and its sections share a first letter, and typing it narrows the
 * map down to that column.
 */
export function strataMapTargets(
  columns: readonly StrataMapColumn[],
): StrataMapTarget[] {
  return columns.flatMap((column) => [
    { kind: "column" as const, columnKey: column.key },
    ...column.sections.map((section) => ({
      kind: "section" as const,
      columnKey: column.key,
      sectionId: section.id,
    })),
  ]);
}
