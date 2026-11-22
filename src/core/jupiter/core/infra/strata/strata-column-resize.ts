import type { ColumnSize } from "#/core/infra/strata/layout";

/**
 * The least a column may be made, in units: narrower than this its header has
 * no room for its controls. A column that declares fewer is never narrowed, nor
 * widened below what it declares.
 */
export const STRATA_MIN_UNITS = 2;
/** The most a column may be made, in units. */
export const STRATA_MAX_UNITS = 5;

/** Which way a column is resized: narrower (-1) or wider (1). */
export type StrataResizeDirection = -1 | 1;

/**
 * A column's size once the user has widened or narrowed it (ADR 0021): the
 * size its route declares, moved by `delta` units, and kept between the least
 * and the most a column may be. A column that is the whole screen is not
 * resized.
 */
export function strataResizedSize(
  declared: ColumnSize | number,
  delta: number,
): number | "full" {
  if (declared === "full") {
    return "full";
  }
  return Math.max(
    Math.min(declared, STRATA_MIN_UNITS),
    Math.min(STRATA_MAX_UNITS, declared + delta),
  );
}

/**
 * The delta after one step in `direction` from `delta`, kept to what the
 * limits allow: the size is as far as it can go already, `delta` is brought
 * back to what it amounts to. A column that is the whole screen has none.
 */
export function strataResizedDelta(
  declared: ColumnSize | number,
  delta: number,
  direction: StrataResizeDirection,
): number {
  if (declared === "full") {
    return 0;
  }
  const current = strataResizedSize(declared, delta);
  const next = strataResizedSize(
    declared,
    (current as number) - declared + direction,
  );
  return (next as number) - declared;
}

/** Whether a step in `direction` would change the column's size. */
export function strataCanResize(
  declared: ColumnSize | number,
  delta: number,
  direction: StrataResizeDirection,
): boolean {
  return (
    declared !== "full" &&
    strataResizedSize(declared, delta) !==
      strataResizedSize(
        declared,
        strataResizedDelta(declared, delta, direction),
      )
  );
}
