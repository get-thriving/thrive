/** Where an open item is among the items of its collection. */
export interface StrataPosition {
  /** Index of the open item in the paths that were given, from 0. */
  index: number;
  /** Its place in its collection, from 1, as it is said: `12` of `63`. */
  number: number;
  /** How many items the collection holds, after its filters. */
  total: number;
  /** Index, in the paths, of the item before it, or null at the start. */
  previous: number | null;
  /** Index, in the paths, of the item after it, or null at the end. */
  next: number | null;
}

function trimmed(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/** The path an item's is under: `/habits/12` is under `/habits`. */
export function strataParentPath(path: string): string {
  return trimmed(path).replace(/\/[^/]*$/, "");
}

/**
 * Where the item that is open is among the items of its collection, in the
 * order they are shown (ADR 0021). `paths` is the path each item leads to, in
 * that order, and `current` the path of the page. The open item is the one whose
 * path the page is at or under (a leaflet under an item leaves it open), the
 * longest if there are several. Null when none is: the item was reached from
 * somewhere else, as from a search, and has no collection to be a place in.
 *
 * A list can show more than one kind of thing (the habits list has today's
 * inbox tasks among its habits), so the collection of the open item is the
 * items under the same path as it, not all of them. There is no wrapping
 * round: the first has no previous, the last no next.
 */
export function strataPosition(
  paths: readonly string[],
  current: string,
): StrataPosition | null {
  const now = trimmed(current);
  let index = -1;
  let length = -1;
  paths.forEach((path, at) => {
    const own = trimmed(path);
    if (
      own.length > length &&
      (now === own || now.startsWith(own === "/" ? "/" : `${own}/`))
    ) {
      index = at;
      length = own.length;
    }
  });
  if (index < 0) {
    return null;
  }
  const parent = strataParentPath(paths[index]);
  const siblings: number[] = [];
  paths.forEach((path, at) => {
    if (strataParentPath(path) === parent) {
      siblings.push(at);
    }
  });
  const place = siblings.indexOf(index);
  return {
    index,
    number: place + 1,
    total: siblings.length,
    previous: place > 0 ? siblings[place - 1] : null,
    next: place < siblings.length - 1 ? siblings[place + 1] : null,
  };
}
