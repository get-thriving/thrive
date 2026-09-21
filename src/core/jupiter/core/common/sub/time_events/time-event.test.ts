import type { TimeEventInDayBlock } from "@jupiter/webapi-client";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import type { CombinedTimeEventInDayEntry } from "#/core/common/sub/time_events/time-event";
import {
  buildNearbyTimeEventInDayEntriesMap,
  buildTimeBlockOffsetsMap,
  calculateEndTimeForTimeEvent,
  calculateStartTimeForTimeEvent,
  findNearbyTimeEventInDayEntries,
  sortTimeEventInDayByStartTimeAndEndTime,
  splitTimeEventInDayEntryIntoPerDayEntries,
} from "#/core/common/sub/time_events/time-event";

const A_DAY = "2026-09-21";

function block(
  refId: string,
  startTimeInDay: string,
  durationMins: number,
  startDate: string = A_DAY,
): TimeEventInDayBlock {
  return {
    ref_id: refId,
    version: 1,
    archived: false,
    owner: `ScheduleEventInDay:std:${refId}`,
    start_date: startDate,
    start_time_in_day: startTimeInDay,
    duration_mins: durationMins,
  } as unknown as TimeEventInDayBlock;
}

function entry(
  refId: string,
  startTimeInDay: string,
  durationMins: number,
  startDate: string = A_DAY,
): CombinedTimeEventInDayEntry {
  const timeEvent = block(refId, startTimeInDay, durationMins, startDate);
  return {
    time_event_in_tz: timeEvent,
    entry: { time_event: timeEvent },
  } as unknown as CombinedTimeEventInDayEntry;
}

function refIds(entries: Array<CombinedTimeEventInDayEntry>): Array<string> {
  return entries.map((one) => one.time_event_in_tz.ref_id);
}

const startOfDay = DateTime.fromISO(`${A_DAY}T00:00:00`, { zone: "UTC" });

describe("calculateStartTimeForTimeEvent", () => {
  it("reads the block's own date and time", () => {
    const startTime = calculateStartTimeForTimeEvent(block("1", "08:30", 60));
    expect(startTime.toISO()).toEqual("2026-09-21T08:30:00.000Z");
    expect(
      calculateEndTimeForTimeEvent(block("1", "08:30", 60)).toISO(),
    ).toEqual("2026-09-21T09:30:00.000Z");
  });

  it("gives the same answer every time it's asked", () => {
    expect(
      calculateStartTimeForTimeEvent(block("1", "08:30", 60)).toMillis(),
    ).toEqual(
      calculateStartTimeForTimeEvent(block("2", "08:30", 15)).toMillis(),
    );
  });

  it("refuses a block whose time isn't a time", () => {
    expect(() =>
      calculateStartTimeForTimeEvent(block("1", "not-a-time", 60)),
    ).toThrow();
  });
});

describe("sortTimeEventInDayByStartTimeAndEndTime", () => {
  it("goes by start time", () => {
    const sorted = sortTimeEventInDayByStartTimeAndEndTime([
      entry("late", "14:00", 30),
      entry("early", "08:00", 30),
      entry("middle", "11:00", 30),
    ]);
    expect(refIds(sorted)).toEqual(["early", "middle", "late"]);
  });

  it("puts the shorter of two events starting together first", () => {
    const sorted = sortTimeEventInDayByStartTimeAndEndTime([
      entry("long", "09:00", 120),
      entry("short", "09:00", 30),
    ]);
    expect(refIds(sorted)).toEqual(["short", "long"]);
  });
});

describe("findNearbyTimeEventInDayEntries", () => {
  const entries = [
    entry("morning", "08:00", 60),
    entry("overlapping", "08:30", 60),
    entry("just-after", "09:20", 30),
    entry("touching-the-window", "10:00", 30),
    entry("afternoon", "15:00", 60),
  ];

  it("takes in what overlaps the event and what's within half an hour of it", () => {
    const nearby = findNearbyTimeEventInDayEntries(entries, entries[0]);
    expect(refIds(nearby)).toEqual(["morning", "overlapping", "just-after"]);
  });

  it("leaves out an event merely touching the end of the window", () => {
    const nearby = findNearbyTimeEventInDayEntries(entries, entries[1]);
    expect(refIds(nearby)).not.toContain("touching-the-window");
  });

  it("holds an event that has nothing around it on its own", () => {
    const nearby = findNearbyTimeEventInDayEntries(entries, entries[4]);
    expect(refIds(nearby)).toEqual(["afternoon"]);
  });

  it("says the same as working the whole day out at once", () => {
    const nearbyMap = buildNearbyTimeEventInDayEntriesMap(entries);
    for (const one of entries) {
      expect(refIds(nearbyMap.get(one.time_event_in_tz.ref_id) ?? [])).toEqual(
        refIds(findNearbyTimeEventInDayEntries(entries, one)),
      );
    }
  });
});

describe("buildTimeBlockOffsetsMap", () => {
  it("leaves an event that stands alone in the first lane", () => {
    const layouts = buildTimeBlockOffsetsMap(
      [entry("alone", "08:00", 60)],
      startOfDay,
    );
    expect(layouts.get("alone")).toEqual({ offset: 0, columns: 1 });
  });

  it("moves overlapping events into lanes of their own", () => {
    const layouts = buildTimeBlockOffsetsMap(
      [entry("first", "08:00", 60), entry("second", "08:15", 60)],
      startOfDay,
    );
    expect(layouts.get("first")).toEqual({ offset: 0, columns: 2 });
    expect(layouts.get("second")).toEqual({ offset: 1, columns: 2 });
  });

  it("puts an event back in the first lane once the one before it is done", () => {
    const layouts = buildTimeBlockOffsetsMap(
      [entry("first", "08:00", 60), entry("later", "10:00", 60)],
      startOfDay,
    );
    expect(layouts.get("first")).toEqual({ offset: 0, columns: 1 });
    expect(layouts.get("later")).toEqual({ offset: 0, columns: 1 });
  });

  it("piles everything past the fifth lane onto the last one", () => {
    const entries = [
      entry("1", "08:00", 60),
      entry("2", "08:00", 60),
      entry("3", "08:00", 60),
      entry("4", "08:00", 60),
      entry("5", "08:00", 60),
      entry("6", "08:00", 60),
    ];
    const layouts = buildTimeBlockOffsetsMap(entries, startOfDay);
    expect(layouts.get("5")?.offset).toEqual(4);
    expect(layouts.get("6")?.offset).toEqual(4);
    expect(layouts.get("1")?.columns).toEqual(5);
  });

  it("copes with an event running to the end of the day", () => {
    const layouts = buildTimeBlockOffsetsMap(
      [entry("late", "23:30", 29)],
      startOfDay,
    );
    expect(layouts.get("late")).toEqual({ offset: 0, columns: 1 });
  });

  it("copes with an event belonging to another day", () => {
    const layouts = buildTimeBlockOffsetsMap(
      [entry("elsewhere", "08:00", 60, "2026-09-22")],
      startOfDay,
    );
    expect(layouts.get("elsewhere")).toEqual({ offset: 0, columns: 1 });
  });
});

describe("splitTimeEventInDayEntryIntoPerDayEntries", () => {
  it("leaves an event inside its day whole", () => {
    const wholeDay = entry("inside", "08:00", 60);
    const split = splitTimeEventInDayEntryIntoPerDayEntries(wholeDay);
    expect(split.day1).toBe(wholeDay);
    expect(split.day2).toBeUndefined();
    expect(split.day3).toBeUndefined();
  });

  it("leaves an event ending on the stroke of midnight whole", () => {
    const untilMidnight = entry("until-midnight", "23:00", 59);
    const split = splitTimeEventInDayEntryIntoPerDayEntries(untilMidnight);
    expect(split.day1).toBe(untilMidnight);
    expect(split.day2).toBeUndefined();
  });

  it("cuts an event running past midnight in two", () => {
    const split = splitTimeEventInDayEntryIntoPerDayEntries(
      entry("overnight", "23:00", 120),
    );
    expect(split.day1.time_event_in_tz.start_date).toEqual(A_DAY);
    expect(split.day1.split_from?.is_continuation).toEqual(false);
    expect(split.day2?.time_event_in_tz.start_date).toEqual("2026-09-22");
    expect(split.day2?.time_event_in_tz.start_time_in_day).toEqual("00:00");
    expect(split.day2?.time_event_in_tz.duration_mins).toEqual(60);
    expect(split.day2?.split_from?.is_continuation).toEqual(true);
  });

  it("cuts an event running over a whole day in three", () => {
    const split = splitTimeEventInDayEntryIntoPerDayEntries(
      entry("two-nights", "23:00", 60 * 26),
    );
    expect(split.day2?.time_event_in_tz.start_date).toEqual("2026-09-22");
    expect(split.day2?.time_event_in_tz.duration_mins).toEqual(24 * 60);
    expect(split.day3?.time_event_in_tz.start_date).toEqual("2026-09-23");
    expect(split.day3?.time_event_in_tz.duration_mins).toEqual(60);
  });
});
