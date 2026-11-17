import { STRATA_HINT_ALPHABET } from "#/core/infra/strata/strata-hint-labels";

// Things a person can press, follow or type in. A `tabindex` of -1 is left out
// of the last line, as the columns and sections use it to take the focus
// themselves; a button or link keeps its place whatever its `tabindex`.
const INTERACTIVE = [
  "a[href]",
  "button",
  "input:not([type='hidden'])",
  "textarea",
  "select",
  "summary",
  "[contenteditable]:not([contenteditable='false'])",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
  "[role='menuitem']",
  "[role='menuitemcheckbox']",
  "[role='menuitemradio']",
  "[role='checkbox']",
  "[role='radio']",
  "[role='switch']",
  "[role='combobox']",
  "[tabindex]:not([tabindex='-1'])",
  // A card that is picked: it is the target, not the link in it.
  "[data-strata-selectable]",
].join(", ");

// Where the targets are: the columns, and not the rail, the top bar or the
// footer around them, which have keys and menus of their own.
const COLUMN = "[data-strata-column]";

// Not offered: what is disabled, what is inert, and the hints themselves.
const EXCLUDED =
  ":disabled, [aria-disabled='true'], [inert], [data-strata-hints]";

// The links in a picked card are not offered apart from it: choosing the card
// is the way to pick it.
const IN_SELECTABLE = "[data-strata-selectable]";

// Three letters is as many as a label gets.
const MAX_TARGETS = STRATA_HINT_ALPHABET.length ** 3;

// Too small to be seen, or to be hit: the visually hidden inputs of a form.
const MIN_SIDE_PX = 4;

function isShown(element: HTMLElement): boolean {
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility({
      checkVisibilityCSS: true,
      visibilityProperty: true,
    });
  }
  return element.getClientRects().length > 0;
}

/**
 * Whether something is in the window and on top at one of a few points of it,
 * so what is under a dialog, a peek or a spine, scrolled out of its column, or
 * clipped away is not offered. The element itself, or what is in it, has to be
 * what is hit.
 */
function isReachable(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const left = Math.max(rect.left, 0);
  const top = Math.max(rect.top, 0);
  const right = Math.min(rect.right, window.innerWidth);
  const bottom = Math.min(rect.bottom, window.innerHeight);
  if (right - left < MIN_SIDE_PX || bottom - top < MIN_SIDE_PX) {
    return false;
  }
  // The middle, and just inside the corner: a link that wraps over two lines
  // has nothing in the middle of its box.
  const points: [number, number][] = [
    [(left + right) / 2, (top + bottom) / 2],
    [left + 2, top + 2],
  ];
  return points.some(([x, y]) => {
    const hit = document.elementFromPoint(x, y);
    return hit !== null && (hit === element || element.contains(hit));
  });
}

/**
 * The things on screen that hint mode offers, in the order they are in the
 * page: what a person could click or type in, in a column, that is shown, not
 * disabled, and not covered by something else.
 */
export function strataHintTargets(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(INTERACTIVE))
    .filter(
      (element) =>
        element.closest(COLUMN) !== null &&
        element.closest(EXCLUDED) === null &&
        !(element.matches("a[href]") && element.closest(IN_SELECTABLE)) &&
        isShown(element) &&
        isReachable(element),
    )
    .slice(0, MAX_TARGETS);
}
