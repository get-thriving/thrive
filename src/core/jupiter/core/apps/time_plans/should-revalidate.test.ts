import type { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { describe, expect, it, vi } from "vitest";

import {
  ignoringTimePlanQueryChanges,
  TIME_PLAN_ACTIVITY_OWNED_PARAMS,
  TIME_PLAN_OWNED_PARAMS,
  TIME_PLANS_OWNED_PARAMS,
} from "#/core/apps/time_plans/should-revalidate";

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

function guarded(ownedParams: ReadonlyArray<string>) {
  const inner = vi.fn(() => true);
  return {
    inner: inner,
    shouldRevalidate: ignoringTimePlanQueryChanges(inner, ownedParams),
  };
}

describe("ignoringTimePlanQueryChanges", () => {
  // React Router hands every route of a match the params of the whole chain,
  // so a panel three levels down shows up in what the list of plans is asked
  // about. These tests spell those params out the way Remix really does.

  it("doesn't reload the plan when an event on its calendar opens a panel", () => {
    const { shouldRevalidate, inner } = guarded(TIME_PLAN_OWNED_PARAMS);
    expect(
      shouldRevalidate(
        args(
          `${PLAN}?${CALENDAR_VIEW}`,
          `${PLAN}/24818?timeEventRefId=74784&${CALENDAR_VIEW}`,
          {
            currentParams: { id: "2790" },
            nextParams: { id: "2790", activityId: "24818" },
          },
        ),
      ),
    ).toEqual(false);
    expect(inner).not.toHaveBeenCalled();
  });

  it("doesn't reload the plan when a panel closes again", () => {
    const { shouldRevalidate } = guarded(TIME_PLAN_OWNED_PARAMS);
    expect(
      shouldRevalidate(
        args(
          `${PLAN}/24818?timeEventRefId=74784&${CALENDAR_VIEW}`,
          `${PLAN}?${CALENDAR_VIEW}`,
          {
            currentParams: { id: "2790", activityId: "24818" },
            nextParams: { id: "2790" },
          },
        ),
      ),
    ).toEqual(false);
  });

  it("doesn't reload the plan when the view or the grouping changes", () => {
    const { shouldRevalidate } = guarded(TIME_PLAN_OWNED_PARAMS);
    expect(
      shouldRevalidate(
        args(`${PLAN}?timePlanView=list`, `${PLAN}?timePlanView=calendar`, {
          currentParams: { id: "2790" },
          nextParams: { id: "2790" },
        }),
      ),
    ).toEqual(false);
  });

  it("doesn't reload the plan when another panel of it takes over", () => {
    const { shouldRevalidate } = guarded(TIME_PLAN_OWNED_PARAMS);
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
    ).toEqual(false);
  });

  it("doesn't reload the list of plans while a panel of one of them opens", () => {
    const { shouldRevalidate } = guarded(TIME_PLANS_OWNED_PARAMS);
    expect(
      shouldRevalidate(
        args(
          `${PLAN}?${CALENDAR_VIEW}`,
          `${PLAN}/24818?timeEventRefId=74784&${CALENDAR_VIEW}`,
          {
            currentParams: { id: "2790" },
            nextParams: { id: "2790", activityId: "24818" },
          },
        ),
      ),
    ).toEqual(false);
  });

  it("doesn't reload the list of plans while another plan opens", () => {
    const { shouldRevalidate } = guarded(TIME_PLANS_OWNED_PARAMS);
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
    ).toEqual(false);
  });

  // Remix asks the same question before prefetching a link, with the pages
  // already on screen as the "current" side. Hovering the calendar was
  // pulling the whole plan and the list of every plan down per event.
  it("doesn't prefetch the plan behind an event the pointer is resting on", () => {
    const { shouldRevalidate } = guarded(TIME_PLAN_OWNED_PARAMS);
    expect(
      shouldRevalidate(
        args(
          `${PLAN}/24410?timeEventRefId=74683&${CALENDAR_VIEW}`,
          `${PLAN}/24782?timeEventRefId=74694&${CALENDAR_VIEW}`,
          {
            currentParams: { id: "2790", activityId: "24410" },
            nextParams: { id: "2790", activityId: "24782" },
          },
        ),
      ),
    ).toEqual(false);
  });

  it("doesn't prefetch the list of plans behind an event the pointer is resting on", () => {
    const { shouldRevalidate } = guarded(TIME_PLANS_OWNED_PARAMS);
    expect(
      shouldRevalidate(
        args(
          `${PLAN}/24410?${CALENDAR_VIEW}`,
          `${PLAN}/calendar-event/schedule-event-in-day/56531?${CALENDAR_VIEW}`,
          {
            currentParams: { id: "2790", activityId: "24410" },
            nextParams: {
              id: "2790",
              kind: "schedule-event-in-day",
              refId: "56531",
            },
          },
        ),
      ),
    ).toEqual(false);
  });

  it("loads another plan", () => {
    const { shouldRevalidate, inner } = guarded(TIME_PLAN_OWNED_PARAMS);
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
    const { shouldRevalidate } = guarded(TIME_PLAN_ACTIVITY_OWNED_PARAMS);
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
    const { shouldRevalidate, inner } = guarded(TIME_PLAN_OWNED_PARAMS);
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
    const { shouldRevalidate } = guarded(TIME_PLAN_OWNED_PARAMS);
    expect(
      shouldRevalidate(
        args(`${PLAN}/24818?${CALENDAR_VIEW}`, `${PLAN}?${CALENDAR_VIEW}`, {
          currentParams: { id: "2790", activityId: "24818" },
          nextParams: { id: "2790" },
          formMethod: "POST",
          formAction: `${PLAN}/24818`,
        }),
      ),
    ).toEqual(true);
  });

  it("gets out of the way of a page asking for the top level again", () => {
    const { shouldRevalidate } = guarded(TIME_PLAN_OWNED_PARAMS);
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
    const shouldRevalidate = ignoringTimePlanQueryChanges(
      inner,
      TIME_PLAN_OWNED_PARAMS,
    );
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
