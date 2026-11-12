import { strataFocusedItem } from "#/core/infra/component/layout/strata-section-items";

/**
 * Takes the keyboard focus from an item back up to the section it is in, or to
 * its column when it is not in one that can take it, so the keys that move
 * between sections work again. Says whether the focus was on an item at all;
 * if not, nothing happens.
 *
 * Only for an item in the focused column (or alone on the screen). An item that
 * was opened keeps the browser's focus while its page takes the layout's, in a
 * column to its right: there `Escape` is that column's to close.
 */
export function strataLeaveItem(): boolean {
  const item = strataFocusedItem();
  if (item === null) {
    return false;
  }
  const column = item.closest<HTMLElement>("[data-strata-column]");
  if (
    column === null ||
    (column.dataset.focused !== "true" &&
      document.querySelectorAll("[data-strata-column]").length > 1)
  ) {
    return false;
  }
  const home =
    item.closest<HTMLElement>("[data-strata-section][tabindex]") ?? column;
  home.focus({ preventScroll: true });
  return true;
}
