import { describe, expect, it } from "vitest";

import { strataCommandSearch } from "#/core/infra/strata/strata-command-search";

const TAGS = [
  "Copii",
  "Colinde",
  "Programming-Languages",
  "No-Frills",
  "Pizza",
];

describe("strataCommandSearch", () => {
  it("finds every choice for an empty search", () => {
    expect(strataCommandSearch(TAGS, "")).toEqual([0, 1, 2, 3, 4]);
    expect(strataCommandSearch(TAGS, "   ")).toEqual([0, 1, 2, 3, 4]);
  });

  it("finds the choices that have the text in them, in any case", () => {
    expect(strataCommandSearch(TAGS, "co")).toEqual([0, 1]);
    expect(strataCommandSearch(TAGS, "PIZ")).toEqual([4]);
    expect(strataCommandSearch(TAGS, "lang")).toEqual([2]);
  });

  it("wants every word, in any order", () => {
    const labels = ["Healthy food", "Food court", "Healthy"];
    expect(strataCommandSearch(labels, "food healthy")).toEqual([0]);
    expect(strataCommandSearch(labels, "healthy")).toEqual([0, 2]);
  });

  it("finds nothing when nothing has it", () => {
    expect(strataCommandSearch(TAGS, "zzz")).toEqual([]);
  });

  it("puts what starts with the search first, then words that start with it, then the rest", () => {
    const labels = ["Spain", "Amusement-Park", "Pasta", "Japan", "Park"];
    expect(strataCommandSearch(labels, "pa")).toEqual([2, 4, 1, 0, 3]);
  });

  it("keeps the order of the choices within a rank", () => {
    expect(strataCommandSearch(["b a", "a", "a b"], "a")).toEqual([1, 2, 0]);
    expect(strataCommandSearch(["x", "y", "z"], "")).toEqual([0, 1, 2]);
  });
});
