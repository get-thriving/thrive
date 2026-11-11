/** Where a match is in a piece of text: from `start` up to, not with, `end`. */
export interface StrataFindRange {
  start: number;
  end: number;
}

function escapeForRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Every place `query` is in `text`, whatever the case, one after another and
 * without overlap. A query of nothing but space finds nothing, as one that is
 * empty does.
 */
export function strataFindRanges(
  text: string,
  query: string,
): StrataFindRange[] {
  if (query.trim() === "") {
    return [];
  }
  const pattern = new RegExp(escapeForRegExp(query), "gi");
  return Array.from(text.matchAll(pattern), (found) => ({
    start: found.index,
    end: found.index + found[0].length,
  }));
}

/**
 * The index of the match a step from `current` lands on, going round at the
 * ends. `null` when there is no match to go to.
 */
export function strataFindStep(
  current: number,
  count: number,
  direction: "next" | "previous",
): number | null {
  if (count <= 0) {
    return null;
  }
  return direction === "next"
    ? (current + 1) % count
    : (current - 1 + count) % count;
}
