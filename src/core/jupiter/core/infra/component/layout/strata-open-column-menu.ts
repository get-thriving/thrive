import { strataColumnControl } from "#/core/infra/component/layout/strata-column-control";

/**
 * Opens the `⋯` menu of the focused column, by pressing the button the panel
 * has for it. With one column open that column is the focused one. Returns
 * whether the column had a menu.
 */
export function strataOpenColumnMenu(): boolean {
  const column =
    document.querySelector<HTMLElement>(
      '[data-strata-column][data-focused="true"]',
    ) ?? document.querySelector<HTMLElement>("[data-strata-column]");
  if (column === null) {
    return false;
  }
  const button = strataColumnControl(column, "[data-strata-menu]");
  if (button === null) {
    return false;
  }
  button.click();
  return true;
}
