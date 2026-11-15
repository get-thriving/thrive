/** What a trunk title needs of a destination on the rail. */
interface StrataTrunkTitleEntry {
  label: string;
  to: string;
}

/**
 * The title of a trunk's column: the name of the rail entry whose place it is
 * in, the longest one that its path is under (`Habits` for the list of habits
 * and for the stacks beside it). A trunk no entry covers is just the list.
 */
export function strataTrunkTitle(
  pathname: string,
  entries: readonly StrataTrunkTitleEntry[],
): string {
  let best: StrataTrunkTitleEntry | null = null;
  for (const entry of entries) {
    const under = pathname === entry.to || pathname.startsWith(`${entry.to}/`);
    if (under && (best === null || entry.to.length > best.to.length)) {
      best = entry;
    }
  }
  return best?.label ?? "List";
}
