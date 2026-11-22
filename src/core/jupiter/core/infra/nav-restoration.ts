/**
 * Where the keyboard was in a column, which section and which item of a list,
 * kept for the column as its scroll is (`scroll-restoration.ts`), so that `j`
 * and `k` go on from there when the column is back, and do not start from the
 * top again (ADR 0021).
 */
export interface NavPosition {
  /** The id of the section the focus was in; null for a column with none. */
  section: string | null;
  /** What names the item of the list the focus was on, if it was on one. */
  item: string | null;
}

export function saveNavPosition(location: string, position: NavPosition) {
  try {
    window.sessionStorage.setItem(`nav:${location}`, JSON.stringify(position));
  } catch {
    // Storage is not there, or full: the position is not kept, nothing more.
  }
}

export function forgetNavPosition(location: string) {
  try {
    window.sessionStorage.removeItem(`nav:${location}`);
  } catch {
    // As above.
  }
}

export function loadNavPosition(location: string): NavPosition | null {
  try {
    const stored = window.sessionStorage.getItem(`nav:${location}`);
    if (stored === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    const { section, item } = parsed as Record<string, unknown>;
    return {
      section: typeof section === "string" ? section : null,
      item: typeof item === "string" ? item : null,
    };
  } catch {
    return null;
  }
}
