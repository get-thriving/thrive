import { describe, expect, it } from "vitest";

import { withCalendarQuery } from "#/core/calendar/event-link-query";

const PLAN = "/app/workspace/apps/time-plans/2790";

function query(search: string): URLSearchParams {
  return new URLSearchParams(search);
}

describe("withCalendarQuery", () => {
  it("carries the view the calendar is being looked at in", () => {
    expect(
      withCalendarQuery(
        `${PLAN}/24818`,
        query("timePlanView=calendar&timePlanGrouping=merged"),
      ),
    ).toEqual(`${PLAN}/24818?timePlanView=calendar&timePlanGrouping=merged`);
  });

  it("leaves a path with nothing to carry alone", () => {
    expect(withCalendarQuery(`${PLAN}/24818`, query(""))).toEqual(
      `${PLAN}/24818`,
    );
  });

  it("keeps the event the link is for rather than the one already open", () => {
    expect(
      withCalendarQuery(
        `${PLAN}/24818?timeEventRefId=74784`,
        query("timeEventRefId=74697&timePlanView=calendar"),
      ),
    ).toEqual(`${PLAN}/24818?timeEventRefId=74784&timePlanView=calendar`);
  });

  it("doesn't pick up the open panel's event for a link without one", () => {
    expect(
      withCalendarQuery(
        `${PLAN}/calendar-event/schedule-event-in-day/56531`,
        query("timeEventRefId=74697&timePlanView=calendar"),
      ),
    ).toEqual(
      `${PLAN}/calendar-event/schedule-event-in-day/56531?timePlanView=calendar`,
    );
  });

  it("drops where a new event is being placed", () => {
    expect(
      withCalendarQuery(
        `${PLAN}/24818?timeEventRefId=74784`,
        query(
          "timePlanView=calendar&sourceStartDate=2026-09-23&sourceStartTimeInDay=15%3A30&sourceDurationMins=30",
        ),
      ),
    ).toEqual(`${PLAN}/24818?timeEventRefId=74784&timePlanView=calendar`);
  });

  it("stays the same however many times it's followed", () => {
    const once = withCalendarQuery(
      `${PLAN}/24818?timeEventRefId=74784`,
      query("timePlanView=calendar"),
    );
    const twice = withCalendarQuery(
      `${PLAN}/24818?timeEventRefId=74784`,
      query(once.split("?")[1]),
    );
    expect(twice).toEqual(once);
  });
});
