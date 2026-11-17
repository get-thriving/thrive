const LETTERS = "abcdefghijklmnopqrstuvwxyz";

/**
 * The letters that start the two-letter labels when there are more entries
 * than letters, rarest first: they are what a name is least likely to want
 * for itself.
 */
const PREFIXES = "zxjqvkwyfbgphumdtc";

/** The letters of a name, in order and without repeats. */
function lettersOf(name: string): string[] {
  const letters = name.toLowerCase().replace(/[^a-z]/g, "");
  return Array.from(new Set(letters));
}

/**
 * Hands out one letter from `pool` to each name, as near to the name as it can
 * be: every name gets its first letter if nobody has it, and those left out get
 * the next letter of their own name, and then whichever is left. `taken` has
 * the letters that are not free. Returns the letter of each name, in order.
 */
function assignLetters(names: readonly string[], pool: string): string[] {
  const free = new Set(pool.split(""));
  const result: (string | null)[] = names.map(() => null);
  // The first letters go first, so a name that was going to be `t` is not
  // pushed off it by the `i` of the one before it.
  names.forEach((name, index) => {
    const initial = lettersOf(name)[0];
    if (initial !== undefined && free.has(initial)) {
      result[index] = initial;
      free.delete(initial);
    }
  });
  names.forEach((name, index) => {
    if (result[index] !== null) {
      return;
    }
    const letter = lettersOf(name).find((candidate) => free.has(candidate));
    if (letter !== undefined) {
      result[index] = letter;
      free.delete(letter);
    }
  });
  const rest = Array.from(free);
  return result.map((letter) => letter ?? rest.shift() ?? "");
}

/**
 * The letters to type for each entry of the menu of apps and pages, in order,
 * so that no label is the start of another: typing one that is whole goes
 * straight there. They are made from the names, so `t` is Todos and `h` is
 * Habits, which is why the first entries are the ones that keep to one letter.
 * Up to 26 entries all have one; beyond that, enough of the rarest letters
 * start two-letter labels for the rest, and the entries that come first keep
 * their single letter.
 */
export function strataAppMenuLabels(names: readonly string[]): string[] {
  if (names.length <= LETTERS.length) {
    return assignLetters(names, LETTERS);
  }
  // `p` prefixes give up `p` single letters and make 26 pairs each.
  const prefixes = Math.ceil((names.length - LETTERS.length) / 25);
  const prefixLetters = PREFIXES.slice(0, prefixes);
  const singlePool = LETTERS.split("")
    .filter((letter) => !prefixLetters.includes(letter))
    .join("");
  const singles = names.slice(0, singlePool.length);
  const doubles = names.slice(singlePool.length);
  const singleLabels = assignLetters(singles, singlePool);
  // The pairs are handed out prefix by prefix, the second letter by name.
  const doubleLabels: string[] = [];
  for (let at = 0; at < doubles.length; at += LETTERS.length) {
    const chunk = doubles.slice(at, at + LETTERS.length);
    const prefix = prefixLetters[at / LETTERS.length];
    for (const second of assignLetters(chunk, LETTERS)) {
      doubleLabels.push(prefix + second);
    }
  }
  return [...singleLabels, ...doubleLabels];
}
