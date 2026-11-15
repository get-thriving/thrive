import { describe, expect, it } from "vitest";

import { withSectionFiltersAfterAction } from "#/core/infra/section-filters-after-action";

const url = (path: string) => new URL(path, "http://thrive.invalid");

const SPLIT = "habit%5Bsplit%5D=habit-inbox-tasks";
const COLLAPSED = "habit%5Bcollapsed%5D=habit-note";

describe("withSectionFiltersAfterAction", () => {
  it("brings the filters back to the same page", () => {
    expect(
      withSectionFiltersAfterAction(
        "/habits/12",
        url(`/habits/12?${SPLIT}&${COLLAPSED}`),
      ),
    ).toBe(`/habits/12?${SPLIT}&${COLLAPSED}`);
  });

  it("brings them to a page under it, and to one above it", () => {
    const from = url(`/time-plans/1/activities/5?${SPLIT}`);
    expect(
      withSectionFiltersAfterAction("/time-plans/1/activities/5/x", from),
    ).toBe(`/time-plans/1/activities/5/x?${SPLIT}`);
    expect(withSectionFiltersAfterAction("/time-plans/1", from)).toBe(
      `/time-plans/1?${SPLIT}`,
    );
  });

  it("leaves a redirect to somewhere unrelated as it was", () => {
    expect(
      withSectionFiltersAfterAction("/chores", url(`/habits/12?${SPLIT}`)),
    ).toBe("/chores");
    expect(
      withSectionFiltersAfterAction("/habits/13", url(`/habits/12?${SPLIT}`)),
    ).toBe("/habits/13");
  });

  it("keeps what the redirect already says about a filter", () => {
    expect(
      withSectionFiltersAfterAction(
        "/habits/12?habit%5Bsplit%5D=habit-note",
        url(`/habits/12?${SPLIT}`),
      ),
    ).toBe("/habits/12?habit%5Bsplit%5D=habit-note");
  });

  it("keeps the other params of the redirect and its hash", () => {
    expect(
      withSectionFiltersAfterAction(
        "/habits/12?view=a#top",
        url(`/habits/12?${SPLIT}`),
      ),
    ).toBe(`/habits/12?view=a&${SPLIT}#top`);
  });

  it("does not carry params that are not section filters", () => {
    expect(
      withSectionFiltersAfterAction(
        "/habits/12",
        url("/habits/12?returnTo=%2Fx&invalidateTopLevel=1"),
      ),
    ).toBe("/habits/12");
  });

  it("leaves a page with no filters, and off-site redirects, alone", () => {
    expect(withSectionFiltersAfterAction("/habits/12", url("/habits/12"))).toBe(
      "/habits/12",
    );
    expect(
      withSectionFiltersAfterAction(
        "https://example.com/habits/12",
        url(`/habits/12?${SPLIT}`),
      ),
    ).toBe("https://example.com/habits/12");
  });
});
