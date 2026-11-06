import { describe, expect, it } from "vitest";

import { moveItem } from "#/core/common/move-item";

describe("moveItem", () => {
  it("moves an item up", () => {
    expect(moveItem(["a", "b", "c"], 2, -1)).toEqual(["a", "c", "b"]);
  });

  it("moves an item down", () => {
    expect(moveItem(["a", "b", "c"], 0, 1)).toEqual(["b", "a", "c"]);
  });

  it("leaves the list alone at either end", () => {
    const items = ["a", "b", "c"];

    expect(moveItem(items, 0, -1)).toBe(items);
    expect(moveItem(items, 2, 1)).toBe(items);
  });

  it("leaves the list alone for an index that is not in it", () => {
    const items = ["a", "b"];

    expect(moveItem(items, -1, 1)).toBe(items);
    expect(moveItem(items, 5, -1)).toBe(items);
  });

  it("does not change the list it was given", () => {
    const items = ["a", "b", "c"];

    moveItem(items, 1, 1);

    expect(items).toEqual(["a", "b", "c"]);
  });
});
