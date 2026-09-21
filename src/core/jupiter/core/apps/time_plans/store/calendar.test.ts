import type {
  CalendarEventsEntries,
  InboxTask,
  TimeEventInDayBlock,
  TimePlanActivity,
} from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  selectCalendarEntries,
  snapshotFromCalendarEntries,
} from "#/core/apps/time_plans/store/calendar";
import {
  createTimePlanStore,
  seedTimePlanSource,
  selectTimePlanEntities,
} from "#/core/apps/time_plans/store/store";

const TIME_PLAN_REF_ID = "9";

function block(
  refId: string,
  owner: string,
  fields: Partial<TimeEventInDayBlock> = {},
): TimeEventInDayBlock {
  return {
    ref_id: refId,
    version: 1,
    archived: false,
    owner,
    start_date: "2026-09-14",
    start_time_in_day: "08:00",
    duration_mins: 30,
    ...fields,
  } as TimeEventInDayBlock;
}

function activity(
  refId: string,
  fields: Partial<TimePlanActivity> = {},
): TimePlanActivity {
  return {
    ref_id: refId,
    version: 1,
    archived: false,
    time_plan_ref_id: TIME_PLAN_REF_ID,
    target: `InboxTask:std:${refId}0`,
    ...fields,
  } as TimePlanActivity;
}

function entries(): CalendarEventsEntries {
  return {
    schedule_event_full_days_entries: [],
    schedule_event_in_day_entries: [
      { time_event: block("1", "ScheduleEventInDay:std:1") },
    ] as CalendarEventsEntries["schedule_event_in_day_entries"],
    big_plan_entries: [],
    todo_task_entries: [],
    habit_entries: [],
    chore_entries: [],
    time_plan_activity_entries: [
      {
        time_plan_activity: activity("20"),
        time_events: [block("2", "TimePlanActivity:std:20")],
      },
      {
        time_plan_activity: activity("21"),
        time_events: [
          block("3", "TimePlanActivity:std:21"),
          block("4", "TimePlanActivity:std:21"),
        ],
      },
    ] as CalendarEventsEntries["time_plan_activity_entries"],
    person_occasion_entries: [],
    vacation_entries: [],
    big_plan_milestone_entries: [],
  };
}

function storeWith(...updates: Parameters<typeof seedTimePlanSource>[2][]) {
  let store = seedTimePlanSource(
    createTimePlanStore(),
    "calendar",
    snapshotFromCalendarEntries(entries()),
  );
  updates.forEach((update, index) => {
    store = seedTimePlanSource(store, `update-${index}`, update);
  });
  return selectTimePlanEntities(store);
}

describe("snapshotFromCalendarEntries", () => {
  it("seeds every in-day block and time plan activity", () => {
    const snapshot = snapshotFromCalendarEntries(entries());

    expect(snapshot.timeEventBlocks?.map((it) => it.ref_id)).toEqual([
      "1",
      "2",
      "3",
      "4",
    ]);
    expect(snapshot.activities?.map((it) => it.ref_id)).toEqual(["20", "21"]);
  });

  it("seeds nothing without a calendar", () => {
    expect(snapshotFromCalendarEntries(null)).toEqual({});
  });
});

describe("selectCalendarEntries", () => {
  it("draws events where the store last put them", () => {
    const selected = selectCalendarEntries(
      entries(),
      storeWith({
        timeEventBlocks: [
          block("1", "ScheduleEventInDay:std:1", {
            version: 2,
            start_time_in_day: "10:00",
          }),
          block("3", "TimePlanActivity:std:21", {
            version: 2,
            duration_mins: 90,
          }),
        ],
      }),
      TIME_PLAN_REF_ID,
    );

    expect(
      selected?.schedule_event_in_day_entries[0].time_event.start_time_in_day,
    ).toBe("10:00");
    expect(
      selected?.time_plan_activity_entries[1].time_events.map(
        (it) => it.duration_mins,
      ),
    ).toEqual([90, 30]);
  });

  it("leaves out archived events and archived activities", () => {
    const selected = selectCalendarEntries(
      entries(),
      storeWith({
        timeEventBlocks: [
          block("1", "ScheduleEventInDay:std:1", {
            version: 2,
            archived: true,
          }),
          block("4", "TimePlanActivity:std:21", {
            version: 2,
            archived: true,
          }),
        ],
        activities: [activity("20", { version: 2, archived: true })],
      }),
      TIME_PLAN_REF_ID,
    );

    expect(selected?.schedule_event_in_day_entries).toEqual([]);
    expect(
      selected?.time_plan_activity_entries.map((it) => [
        it.time_plan_activity.ref_id,
        it.time_events.map((event) => event.ref_id),
      ]),
    ).toEqual([["21", ["3"]]]);
  });

  it("leaves out removed activities", () => {
    const entities = storeWith();
    const activities = { ...entities.activities };
    delete activities["21"];

    const selected = selectCalendarEntries(
      entries(),
      { ...entities, activities },
      TIME_PLAN_REF_ID,
    );

    expect(
      selected?.time_plan_activity_entries.map(
        (it) => it.time_plan_activity.ref_id,
      ),
    ).toEqual(["20"]);
  });

  it("shows events placed since the calendar loaded", () => {
    const task = { ref_id: "220", name: "The task" } as InboxTask;
    const selected = selectCalendarEntries(
      entries(),
      storeWith({
        activities: [
          activity("22"),
          activity("23", { time_plan_ref_id: "10" }),
        ],
        inboxTasks: [task],
        timeEventBlocks: [
          block("5", "TimePlanActivity:std:21"),
          block("6", "TimePlanActivity:std:22"),
          block("7", "TimePlanActivity:std:23"),
        ],
      }),
      TIME_PLAN_REF_ID,
    );

    expect(
      selected?.time_plan_activity_entries.map((it) => [
        it.time_plan_activity.ref_id,
        it.time_events.map((event) => event.ref_id),
      ]),
    ).toEqual([
      ["20", ["2"]],
      ["21", ["3", "4", "5"]],
      ["22", ["6"]],
    ]);
    expect(selected?.time_plan_activity_entries[2].target_inbox_task).toBe(
      task,
    );
  });
});
