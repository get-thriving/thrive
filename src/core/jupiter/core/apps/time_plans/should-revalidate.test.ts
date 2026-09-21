import type { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { describe, expect, it, vi } from "vitest";

import { ignoringTimePlanQueryChanges } from "#/core/apps/time_plans/should-revalidate";

const PLAN = "/app/workspace/apps/time-plans/2790";
const CALENDAR_VIEW = "timePlanView=calendar&timePlanGrouping=merged";

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
  return {
    inner: inner,
    shouldRevalidate: ignoringTimePlanQueryChanges(inner),
  };
}

describe("ignoringTimePlanQueryChanges", () => {
  it("doesn't reload the plan when an event on its calendar opens a panel", () => {
    const { shouldRevalidate, inner } = guarded();
    expect(
      shouldRevalidate(
        args(
          `${PLAN}?${CALENDAR_VIEW}`,
          `${PLAN}/24818?timeEventRefId=74784&${CALENDAR_VIEW}`,
          {
            currentParams: { id: "2790" },
            nextParams: { id: "2790" },
          },
        ),
      ),
    ).toEqual(false);
    expect(inner).not.toHaveBeenCalled();
  });

  it("doesn't reload the plan when a panel closes again", () => {
    const { shouldRevalidate } = guarded();
    expect(
      shouldRevalidate(
        args(
          `${PLAN}/24818?timeEventRefId=74784&${CALENDAR_VIEW}`,
          `${PLAN}?${CALENDAR_VIEW}`,
          {
            currentParams: { id: "2790" },
            nextParams: { id: "2790" },
          },
        ),
      ),
    ).toEqual(false);
  });

  it("doesn't reload the plan when the view or the grouping changes", () => {
    const { shouldRevalidate } = guarded();
    expect(
      shouldRevalidate(
        args(`${PLAN}?timePlanView=list`, `${PLAN}?timePlanView=calendar`, {
          currentParams: { id: "2790" },
          nextParams: { id: "2790" },
        }),
      ),
    ).toEqual(false);
  });

  it("doesn't reload the list of plans while a panel of one of them opens", () => {
    const { shouldRevalidate } = guarded();
    expect(
      shouldRevalidate(
        args(
          `${PLAN}?${CALENDAR_VIEW}`,
          `${PLAN}/24818?timeEventRefId=74784&${CALENDAR_VIEW}`,
        ),
      ),
    ).toEqual(false);
  });

  it("loads another plan", () => {
    const { shouldRevalidate, inner } = guarded();
    expect(
      shouldRevalidate(
        args(
          `${PLAN}?${CALENDAR_VIEW}`,
          `/app/workspace/apps/time-plans/2791?${CALENDAR_VIEW}`,
          {
            currentParams: { id: "2790" },
            nextParams: { id: "2791" },
          },
        ),
      ),
    ).toEqual(true);
    expect(inner).toHaveBeenCalled();
  });

  it("loads another activity's panel", () => {
    const { shouldRevalidate } = guarded();
    expect(
      shouldRevalidate(
        args(
          `${PLAN}/24818?${CALENDAR_VIEW}`,
          `${PLAN}/24819?${CALENDAR_VIEW}`,
          {
            currentParams: { id: "2790", activityId: "24818" },
            nextParams: { id: "2790", activityId: "24819" },
          },
        ),
      ),
    ).toEqual(true);
  });

  it("gets out of the way of a revalidation asked for by name", () => {
    const { shouldRevalidate, inner } = guarded();
    expect(
      shouldRevalidate(
        args(`${PLAN}?${CALENDAR_VIEW}`, `${PLAN}?${CALENDAR_VIEW}`, {
          currentParams: { id: "2790" },
          nextParams: { id: "2790" },
        }),
      ),
    ).toEqual(true);
    expect(inner).toHaveBeenCalled();
  });

  it("gets out of the way of an action and what follows it", () => {
    const { shouldRevalidate } = guarded();
    expect(
      shouldRevalidate(
        args(`${PLAN}/24818?${CALENDAR_VIEW}`, `${PLAN}?${CALENDAR_VIEW}`, {
          currentParams: { id: "2790" },
          nextParams: { id: "2790" },
          formMethod: "POST",
          formAction: `${PLAN}/24818`,
        }),
      ),
    ).toEqual(true);
  });

  it("gets out of the way of a page asking for the top level again", () => {
    const { shouldRevalidate } = guarded();
    expect(
      shouldRevalidate(
        args(
          `${PLAN}?${CALENDAR_VIEW}`,
          `${PLAN}?${CALENDAR_VIEW}&invalidateTopLevel=true`,
          {
            currentParams: { id: "2790" },
            nextParams: { id: "2790" },
          },
        ),
      ),
    ).toEqual(true);
  });

  it("leaves the last word to the one it wraps", () => {
    const inner = vi.fn(() => false);
    const shouldRevalidate = ignoringTimePlanQueryChanges(inner);
    expect(
      shouldRevalidate(
        args(
          `${PLAN}?${CALENDAR_VIEW}`,
          `/app/workspace/apps/time-plans/2791`,
          {
            currentParams: { id: "2790" },
            nextParams: { id: "2791" },
          },
        ),
      ),
    ).toEqual(false);
    expect(inner).toHaveBeenCalled();
  });
});
