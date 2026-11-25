import { strataSelectEnd } from "#/core/infra/component/layout/strata-select-end";
import { forgetNavPosition } from "#/core/infra/nav-restoration";
import type { StrataScrollKeyAction } from "#/core/infra/strata/strata-scroll-key";

/**
 * What the scroller of a column says its position is kept under: the scroll key
 * of its panel (`nav-restoration.ts`).
 */
export const STRATA_NAV_KEY_ATTRIBUTE = "data-strata-nav-key";

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

/** Unmarks what `j` and `k` were last on in a column (`data-strata-remembered`). */
export function strataClearRemembered(column: Element): void {
  column.querySelectorAll("[data-strata-remembered]").forEach((el) => {
    if (el.closest("[data-strata-column]") === column) {
      el.removeAttribute("data-strata-remembered");
    }
  });
}

/** Whether a column holds more than fits, so it has a top and a bottom. */
export function strataColumnScrolls(column: Element): boolean {
  const scroller = strataColumnScroller(column);
  return scroller !== null && scroller.scrollHeight > scroller.clientHeight;
}

/**
 * Scrolls a column to its top or its bottom, in one jump: a list can be
 * thousands of pixels long, and a slow scroll over it is not what a key to the
 * end is for. Returns whether the column had something to scroll. At its top
 * the column has no place of its own kept for `j` and `k` to go on from: they
 * start from the first section or item, as when it was new.
 */
export function strataScrollColumn(
  column: Element,
  to: StrataScrollKeyAction,
): boolean {
  const scroller = strataColumnScroller(column);
  if (scroller === null) {
    return false;
  }
  if (to === "top") {
    const key = scroller.getAttribute(STRATA_NAV_KEY_ATTRIBUTE);
    if (key !== null) {
      forgetNavPosition(key);
    }
    strataClearRemembered(column);
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
  if (column === null || !strataScrollColumn(column, to)) {
    return false;
  }
  // The selection goes to the end the column was scrolled to, so `j` and `k`
  // go on from there and not from where they were.
  strataSelectEnd(column, to);
  return true;
}
