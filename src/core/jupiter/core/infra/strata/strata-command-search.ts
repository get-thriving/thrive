/**
 * How well a label answers a search, the lower the better: 0 when it starts
 * with the first word, 1 when a word of it does, 2 when the word is only
 * somewhere inside. `null` when it lacks a word of the search.
 */
function rank(label: string, words: readonly string[]): number | null {
  const lower = label.toLowerCase();
  if (!words.every((word) => lower.includes(word))) {
    return null;
  }
  if (words.length === 0 || lower.startsWith(words[0])) {
    return 0;
  }
  const starts = (word: string) =>
    lower.split(/[^\p{L}\p{N}]+/u).some((part) => part.startsWith(word));
  return words.every(starts) ? 1 : 2;
}

/**
 * Which of some choices a search finds, as the places they are at: a choice is
 * found when its label has every word of the search in it, in any case and in
 * any order. The ones that start with the search come first, then those with a
 * word that starts with it, then the rest, each kept in the order of the
 * choices, so with many tags `pa` has Pasta before Spain. An empty search finds
 * them all, in order.
 */
export function strataCommandSearch(
  labels: readonly string[],
  query: string,
): number[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const ranked: Array<{ at: number; rank: number }> = [];
  labels.forEach((label, at) => {
    const r = rank(label, words);
    if (r !== null) {
      ranked.push({ at, rank: r });
    }
  });
  // `sort` is stable, so equals stay in the order of the choices.
  return ranked.sort((a, b) => a.rank - b.rank).map((entry) => entry.at);
}
