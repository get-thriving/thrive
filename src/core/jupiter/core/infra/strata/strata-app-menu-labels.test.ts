import { describe, expect, it } from "vitest";

import { strataAppMenuLabels } from "#/core/infra/strata/strata-app-menu-labels";

/** No label is the start of another, or two are the same. */
function prefixFree(labels: string[]): boolean {
  return labels.every((label, index) =>
    labels.every(
      (other, otherIndex) => index === otherIndex || !other.startsWith(label),
    ),
  );
}

describe("strataAppMenuLabels", () => {
  it("gives each name its own first letter when it can", () => {
    expect(strataAppMenuLabels(["Todos", "Habits", "Calendar"])).toEqual([
      "t",
      "h",
      "c",
    ]);
  });

  it("gives a name that lost its first letter another letter of its own", () => {
    expect(strataAppMenuLabels(["Todos", "Time Plans", "Tags"])).toEqual([
      "t",
      "i",
      "a",
    ]);
  });

  it("keeps the first letter of every name that has a free one", () => {
    // `Time Plans` takes `i` only if `Inbox Tasks` did not ask for it.
    expect(strataAppMenuLabels(["Time Plans", "Inbox Tasks", "Todos"])).toEqual(
      ["t", "i", "o"],
    );
  });

  it("gives every entry a different letter up to the 26 there are", () => {
    const names = Array.from({ length: 26 }, (_, i) => `Item ${i}`);
    const labels = strataAppMenuLabels(names);
    expect(new Set(labels).size).toBe(26);
    expect(labels.every((label) => label.length === 1)).toBe(true);
  });

  it("makes two-letter labels past the letters, and none starts another", () => {
    const names = Array.from({ length: 44 }, (_, i) => `Entry ${i}`);
    const labels = strataAppMenuLabels(names);
    expect(labels).toHaveLength(44);
    expect(new Set(labels).size).toBe(44);
    expect(prefixFree(labels)).toBe(true);
    // The entries that come first keep a single letter.
    expect(labels.slice(0, 10).every((label) => label.length === 1)).toBe(true);
  });

  it("uses only letters", () => {
    const labels = strataAppMenuLabels(["1 Up", "---", "Todos"]);
    expect(labels.every((label) => /^[a-z]+$/.test(label))).toBe(true);
    expect(prefixFree(labels)).toBe(true);
  });
});
