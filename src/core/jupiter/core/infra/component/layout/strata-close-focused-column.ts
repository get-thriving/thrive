/**
 * Closes the focused column by using the close control the panel itself
 * offers, so its exit animation, its kept filters and the unsaved-changes
 * check all stay the panel's own. With one column open that column is the
 * focused one. Panels nest in the page, so only a control that belongs to the
 * column itself counts, not one of a column inside it. Returns whether there
 * was a control to use.
 */
export function strataCloseFocusedColumn(): boolean {
  const column =
    document.querySelector<HTMLElement>(
      '[data-strata-column][data-focused="true"]',
    ) ?? document.querySelector<HTMLElement>("[data-strata-column]");
  if (column === null) {
    return false;
  }
  const control = [
    ...column.querySelectorAll<HTMLElement>("[data-strata-close]"),
  ].find((candidate) => candidate.closest("[data-strata-column]") === column);
  if (control === undefined) {
    return false;
  }
  control.click();
  return true;
}
