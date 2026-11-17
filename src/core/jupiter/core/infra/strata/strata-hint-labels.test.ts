import { describe, expect, it } from "vitest";

import {
  STRATA_HINT_ALPHABET,
  strataHintLabels,
  strataHintProgress,
} from "#/core/infra/strata/strata-hint-labels";

describe("strataHintLabels", () => {
  it("has none for nothing", () => {
    expect(strataHintLabels(0)).toEqual([]);
  });

  it("is one letter while the hints fit in the alphabet", () => {
    const labels = strataHintLabels(STRATA_HINT_ALPHABET.length);
    expect(labels).toHaveLength(STRATA_HINT_ALPHABET.length);
    expect(labels.every((label) => label.length === 1)).toBe(true);
  });

  it("is two letters, for all of them, as soon as it is one too many", () => {
    const labels = strataHintLabels(STRATA_HINT_ALPHABET.length + 1);
    expect(labels.every((label) => label.length === 2)).toBe(true);
  });

  it("is three letters past the square of the alphabet", () => {
    const size = STRATA_HINT_ALPHABET.length;
    expect(
      strataHintLabels(size * size).every((label) => label.length === 2),
    ).toBe(true);
    expect(
      strataHintLabels(size * size + 1).every((label) => label.length === 3),
    ).toBe(true);
  });

  it("never gives the same label twice", () => {
    for (const count of [1, 14, 15, 196, 197, 500]) {
      const labels = strataHintLabels(count);
      expect(new Set(labels).size).toBe(count);
    }
  });

  it("only uses letters of the alphabet", () => {
    for (const label of strataHintLabels(300)) {
      for (const letter of label) {
        expect(STRATA_HINT_ALPHABET).toContain(letter);
      }
    }
  });

  it("hands them out so that neighbours share their first letter", () => {
    const labels = strataHintLabels(20, "abc");
    expect(labels.slice(0, 3).map((label) => label[0])).toEqual([
      "a",
      "a",
      "a",
    ]);
    expect(labels[0]).toBe("aaa");
    expect(labels[1]).toBe("aab");
  });

  it("needs an alphabet to make labels from", () => {
    expect(() => strataHintLabels(3, "a")).toThrow();
  });
});

describe("strataHintProgress", () => {
  const labels = ["ss", "sa", "as", "aa"];

  it("keeps every hint before anything is typed", () => {
    expect(strataHintProgress(labels, "")).toEqual({
      matching: [0, 1, 2, 3],
      chosen: null,
    });
  });

  it("narrows to the hints that start with what was typed", () => {
    expect(strataHintProgress(labels, "s")).toEqual({
      matching: [0, 1],
      chosen: null,
    });
  });

  it("chooses the hint a whole label names", () => {
    expect(strataHintProgress(labels, "as")).toEqual({
      matching: [2],
      chosen: 2,
    });
  });

  it("leaves nothing for a letter that starts no label", () => {
    expect(strataHintProgress(labels, "x")).toEqual({
      matching: [],
      chosen: null,
    });
  });

  it("needs the letter even for a single hint", () => {
    expect(strataHintProgress(["s"], "")).toEqual({
      matching: [0],
      chosen: null,
    });
    expect(strataHintProgress(["s"], "s")).toEqual({
      matching: [0],
      chosen: 0,
    });
  });
});
