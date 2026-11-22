import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  forgetNavPosition,
  loadNavPosition,
  saveNavPosition,
} from "#/core/infra/nav-restoration";

function stubStorage(): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal("window", {
    sessionStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
    },
  });
  return store;
}

describe("nav restoration", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = stubStorage();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("gives back what was saved for a column", () => {
    saveNavPosition("habit-1", { section: "streak", item: "/a/b" });
    expect(loadNavPosition("habit-1")).toEqual({
      section: "streak",
      item: "/a/b",
    });
  });

  it("keeps each column's own", () => {
    saveNavPosition("habit-1", { section: "streak", item: null });
    expect(loadNavPosition("habit-2")).toBeNull();
  });

  it("forgets", () => {
    saveNavPosition("habit-1", { section: "streak", item: null });
    forgetNavPosition("habit-1");
    expect(loadNavPosition("habit-1")).toBeNull();
  });

  it("takes what it cannot read for nothing", () => {
    store.set("nav:habit-1", "not json");
    expect(loadNavPosition("habit-1")).toBeNull();
    store.set("nav:habit-1", "3");
    expect(loadNavPosition("habit-1")).toBeNull();
  });
});
