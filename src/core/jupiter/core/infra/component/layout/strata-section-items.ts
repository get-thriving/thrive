const ITEM = "[data-strata-item]";
const OWNER = "[data-strata-section], [data-strata-column]";

/**
 * The items of a list in `scope`, a section, the single section of a split
 * column, or a column that has no sections, in the order they are on the page.
 * An item is what a list marks with `data-strata-item`: one entry of it, which
 * `j` and `k` move between and `↵` opens. Only items that are shown count, so a
 * collapsed section has none, and only the scope's own, not those of a section
 * or a column nested in it.
 */
export function strataSectionItems(scope: HTMLElement): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>(ITEM)).filter(
    (item) =>
      item.closest(OWNER) === scope &&
      (typeof item.checkVisibility !== "function" ||
        item.checkVisibility({
          checkVisibilityCSS: true,
          visibilityProperty: true,
        })),
  );
}

/**
 * The item the keyboard focus is on, if it is on one itself: not on something
 * inside it, such as a link, which keeps its own keys.
 */
export function strataFocusedItem(): HTMLElement | null {
  const active = document.activeElement;
  return active instanceof HTMLElement && active.matches(ITEM) ? active : null;
}
