/**
 * The letters hint labels are made of: the home row first, then the ones near
 * it. None is a letter the keys of the columns use, as in hint mode they are
 * all taken by the labels.
 */
export const STRATA_HINT_ALPHABET = "sadfjklewcmpgh";

/**
 * Labels for `count` hints, all of the same length: one letter while they fit
 * in the alphabet, then two, then three. They are handed out in order, so the
 * hints that come one after another share their first letter, and typing it
 * narrows the screen down to a cluster.
 */
export function strataHintLabels(
  count: number,
  alphabet: string = STRATA_HINT_ALPHABET,
): string[] {
  if (alphabet.length < 2) {
    throw new Error("Hint labels need an alphabet of at least two letters");
  }
  if (count <= 0) {
    return [];
  }
  const base = alphabet.length;
  let length = 1;
  for (let capacity = base; capacity < count; capacity *= base) {
    length += 1;
  }
  return Array.from({ length: count }, (_, index) => {
    let label = "";
    let rest = index;
    for (let place = 0; place < length; place += 1) {
      label = alphabet[rest % base] + label;
      rest = Math.floor(rest / base);
    }
    return label;
  });
}

/** Which hints are still in play after some letters, and the one chosen. */
export interface StrataHintProgress {
  /** Indices of the labels that start with what was typed. */
  matching: number[];
  /** The index of the hint the typed letters name in full, if they do. */
  chosen: number | null;
}

/**
 * What the letters typed so far leave of the hints. A hint is chosen once what
 * was typed is its whole label and no other label goes on from there.
 */
export function strataHintProgress(
  labels: readonly string[],
  typed: string,
): StrataHintProgress {
  const matching = labels.flatMap((label, index) =>
    label.startsWith(typed) ? [index] : [],
  );
  const chosen =
    matching.length === 1 && labels[matching[0]] === typed ? matching[0] : null;
  return { matching, chosen };
}
