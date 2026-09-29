import type { ShouldRevalidateFunctionArgs } from "react-router";
import { describe, expect, it, vi } from "vitest";

import {
  ignoringSectionFilterChanges,
  isSectionFilterParam,
  searchWithoutSectionFilters,
  sectionFilterPanelOf,
  sectionFilterParam,
  withSectionFiltersPreserved,
} from "#/core/infra/section-filters";

const BIG_PLANS = "/app/workspace/apps/big-plans";

function args(
  from: string,
  to: string,
  overrides: Partial<ShouldRevalidateFunctionArgs> = {},
): ShouldRevalidateFunctionArgs {
  return {
    currentUrl: new URL(from, "https://app.get-thriving.com"),
    currentParams: {},
    nextUrl: new URL(to, "https://app.get-thriving.com"),
    nextParams: {},
    defaultShouldRevalidate: true,
    ...overrides,
  } as ShouldRevalidateFunctionArgs;
}

function guarded() {
  const inner = vi.fn(() => true);
  return { inner, shouldRevalidate: ignoringSectionFilterChanges(inner) };
}

function q(filters: Record<string, string | string[]>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    for (const v of Array.isArray(value) ? value : [value]) {
      params.append(key, v);
    }
  }
  return `?${params.toString()}`;
}

describe("sectionFilterParam", () => {
  it("names a filter by its panel and its name", () => {
    expect(sectionFilterParam("big-plans", "view")).toBe("big-plans[view]");
  });

  it("refuses ids which would not read back", () => {
    expect(() => sectionFilterParam("Big Plans", "view")).toThrow();
    expect(() => sectionFilterParam("big-plans", "vi[ew]")).toThrow();
  });

  it("reads the panel back out of the param", () => {
    expect(sectionFilterPanelOf("big-plans[view]")).toBe("big-plans");
    expect(sectionFilterPanelOf("timeEventRefId")).toBeUndefined();
    expect(isSectionFilterParam("time-plan[group-visibility]")).toBe(true);
    expect(isSectionFilterParam("invalidateTopLevel")).toBe(false);
  });
});

describe("searchWithoutSectionFilters", () => {
  it("drops filters and ignores ordering", () => {
    expect(
      searchWithoutSectionFilters(
        new URLSearchParams("b=2&big-plans%5Bview%5D=list&a=1"),
      ),
    ).toBe(searchWithoutSectionFilters(new URLSearchParams("a=1&b=2")));
  });
});

describe("withSectionFiltersPreserved", () => {
  const panelPaths = new Map([
    ["big-plans", BIG_PLANS],
    ["big-plan", `${BIG_PLANS}/1`],
  ]);
  const current = new URLSearchParams(
    q({
      "big-plans[view]": "list",
      "big-plans[tags]": ["t1", "t2"],
      "big-plan[inbox-tasks-view]": "list",
      other: "x",
    }),
  );

  it("carries the filters of a panel into a panel opened under it", () => {
    const to = withSectionFiltersPreserved(
      `${BIG_PLANS}/2`,
      current,
      panelPaths,
    );
    const url = new URL(to, "https://x");
    expect(url.pathname).toBe(`${BIG_PLANS}/2`);
    expect(url.searchParams.get("big-plans[view]")).toBe("list");
    expect(url.searchParams.getAll("big-plans[tags]")).toEqual(["t1", "t2"]);
    // The panel of the other big plan won't be on screen there.
    expect(url.searchParams.has("big-plan[inbox-tasks-view]")).toBe(false);
    // Non-filter params are the link's own business.
    expect(url.searchParams.has("other")).toBe(false);
  });

  it("carries them back when closing a panel", () => {
    const url = new URL(
      withSectionFiltersPreserved(BIG_PLANS, current, panelPaths),
      "https://x",
    );
    expect(url.searchParams.get("big-plans[view]")).toBe("list");
  });

  it("leaves links to elsewhere alone", () => {
    expect(
      withSectionFiltersPreserved(
        "/app/workspace/apps/big-plans-archive",
        current,
        panelPaths,
      ),
    ).toBe("/app/workspace/apps/big-plans-archive");
    expect(
      withSectionFiltersPreserved("/app/workspace", current, panelPaths),
    ).toBe("/app/workspace");
    expect(withSectionFiltersPreserved("new", current, panelPaths)).toBe("new");
  });

  it("keeps what the link already says about a filter", () => {
    const url = new URL(
      withSectionFiltersPreserved(
        `${BIG_PLANS}/2?big-plans%5Bview%5D=timeline#here`,
        current,
        panelPaths,
      ),
      "https://x",
    );
    expect(url.searchParams.getAll("big-plans[view]")).toEqual(["timeline"]);
    expect(url.hash).toBe("#here");
  });
});

describe("ignoringSectionFilterChanges", () => {
  it("doesn't reload a page when only its filters change", () => {
    const { shouldRevalidate, inner } = guarded();
    expect(
      shouldRevalidate(
        args(BIG_PLANS, `${BIG_PLANS}${q({ "big-plans[view]": "list" })}`),
      ),
    ).toBe(false);
    expect(inner).not.toHaveBeenCalled();
  });

  it("doesn't reload a page when a panel opens under it without its filters", () => {
    const { shouldRevalidate } = guarded();
    expect(
      shouldRevalidate(
        args(
          `${BIG_PLANS}${q({ "big-plans[view]": "list" })}`,
          `${BIG_PLANS}/1`,
          {
            nextParams: { id: "1" },
          },
        ),
      ),
    ).toBe(false);
  });

  it("asks when a param shared by both places changed", () => {
    const { shouldRevalidate, inner } = guarded();
    expect(
      shouldRevalidate(
        args(`${BIG_PLANS}/1${q({ "big-plan[x]": "y" })}`, `${BIG_PLANS}/2`, {
          currentParams: { id: "1" },
          nextParams: { id: "2" },
        }),
      ),
    ).toBe(true);
    expect(inner).toHaveBeenCalled();
  });

  it("asks when anything other than a filter changed", () => {
    const { shouldRevalidate, inner } = guarded();
    shouldRevalidate(args(BIG_PLANS, `${BIG_PLANS}?page=2`));
    expect(inner).toHaveBeenCalled();
  });

  it("lets actions, revalidator calls and top level reloads through", () => {
    const { shouldRevalidate, inner } = guarded();
    const filtered = `${BIG_PLANS}${q({ "big-plans[view]": "list" })}`;
    shouldRevalidate(args(BIG_PLANS, filtered, { formMethod: "POST" }));
    shouldRevalidate(args(filtered, filtered));
    shouldRevalidate(args(BIG_PLANS, `${filtered}&invalidateTopLevel=true`));
    expect(inner).toHaveBeenCalledTimes(3);
  });
});
