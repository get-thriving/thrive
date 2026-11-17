/**
 * A control a column's own header carries, found by its marker: `[data-strata-
 * close]` for what closes it, `[data-strata-menu]` for its menu. Panels nest in
 * the page, so only one that belongs to the column itself counts, not one of a
 * column inside it.
 */
export function strataColumnControl(
  column: Element,
  selector: string,
): HTMLElement | null {
  return (
    [...column.querySelectorAll<HTMLElement>(selector)].find(
      (candidate) => candidate.closest("[data-strata-column]") === column,
    ) ?? null
  );
}
