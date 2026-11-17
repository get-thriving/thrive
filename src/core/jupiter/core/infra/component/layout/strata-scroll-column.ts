import type { StrataScrollKeyAction } from "#/core/infra/strata/strata-scroll-key";

/**
 * What scrolls in a column: the part of its panel under the header, marked
 * `data-strata-scroll`. Panels nest in the page, so only one that belongs to the
 * column itself counts, not one of a column inside it.
 */
export function strataColumnScroller(column: Element): HTMLElement | null {
  return (
    [...column.querySelectorAll<HTMLElement>("[data-strata-scroll]")].find(
      (candidate) => candidate.closest("[data-strata-column]") === column,
    ) ?? null
  );
}

/** Whether a column holds more than fits, so it has a top and a bottom. */
export function strataColumnScrolls(column: Element): boolean {
  const scroller = strataColumnScroller(column);
  return scroller !== null && scroller.scrollHeight > scroller.clientHeight;
}

/**
 * Scrolls a column to its top or its bottom, in one jump: a list can be
 * thousands of pixels long, and a slow scroll over it is not what a key to the
 * end is for. Returns whether the column had something to scroll.
 */
export function strataScrollColumn(
  column: Element,
  to: StrataScrollKeyAction,
): boolean {
  const scroller = strataColumnScroller(column);
  if (scroller === null) {
    return false;
  }
  scroller.scrollTo({
    left: 0,
    top: to === "top" ? 0 : scroller.scrollHeight,
    behavior: "instant",
  });
  return true;
}

/**
 * Scrolls the focused column, or the only one when there is a lone column,
 * which is not marked as focused. Returns whether there was a column with
 * something to scroll.
 */
export function strataScrollFocusedColumn(to: StrataScrollKeyAction): boolean {
  const column =
    document.querySelector<HTMLElement>(
      '[data-strata-column][data-focused="true"]',
    ) ?? document.querySelector<HTMLElement>("[data-strata-column]");
  return column !== null && strataScrollColumn(column, to);
}
