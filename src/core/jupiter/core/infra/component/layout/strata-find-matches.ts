import { strataFindRanges } from "#/core/infra/strata/strata-find-ranges";

// More than this is more than anyone steps through, and a lot to paint.
const MAX_MATCHES = 1000;

// Text that is not for reading, or that is not part of what is searched: the
// find bar itself and the hint labels.
const SKIPPED =
  "script, style, noscript, template, textarea, [aria-hidden='true'], [data-strata-find], [data-strata-hints]";

/**
 * Whether the text in an element is on screen to be read: the element is
 * shown, and it is in an open column, not in the rail or the top bar, nor in a
 * column folded to a spine.
 */
function isSearchable(element: Element, shown: Map<Element, boolean>): boolean {
  const known = shown.get(element);
  if (known !== undefined) {
    return known;
  }
  const searchable =
    element.closest("[data-strata-column]") !== null &&
    element.closest(SKIPPED) === null &&
    (typeof element.checkVisibility !== "function" ||
      element.checkVisibility({
        checkVisibilityCSS: true,
        visibilityProperty: true,
      }));
  shown.set(element, searchable);
  return searchable;
}

/**
 * Every place the query is in the text of the open columns, in the order of
 * the page, as ranges to mark. It looks inside one piece of text at a time, so
 * a phrase that runs from one element into the next is not found. Text that is
 * hidden, collapsed or folded away is not searched.
 */
export function strataFindMatches(query: string): Range[] {
  if (query.trim() === "") {
    return [];
  }
  const matches: Range[] = [];
  const shown = new Map<Element, boolean>();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (
    let node = walker.nextNode();
    node !== null && matches.length < MAX_MATCHES;
    node = walker.nextNode()
  ) {
    const ranges = strataFindRanges(node.nodeValue ?? "", query);
    if (ranges.length === 0) {
      continue;
    }
    const parent = node.parentElement;
    if (parent === null || !isSearchable(parent, shown)) {
      continue;
    }
    for (const { start, end } of ranges) {
      const range = document.createRange();
      range.setStart(node, start);
      range.setEnd(node, end);
      if (range.getClientRects().length > 0) {
        matches.push(range);
      }
    }
  }
  return matches;
}
