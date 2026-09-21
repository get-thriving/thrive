import {
  ADate,
  BigPlanEntry,
  BigPlanMilestoneEntry,
  CalendarEventsEntries,
  ChoreEntry,
  Contact,
  EntityId,
  HabitEntry,
  NamedEntityTag,
  RecurringTaskPeriod,
  ScheduleFullDaysEventEntry,
  ScheduleInDayEventEntry,
  TimeEventFullDaysBlock,
  TimeEventInDayBlock,
  TimeInDay,
  Timezone,
  VacationEntry,
  ScheduleStreamColor,
  PersonOccasionEntry,
  Occasion,
  OccasionKind,
  TimePlanActivityEntry,
  TodoTaskEntry,
} from "@jupiter/webapi-client";
import { DateTime, DateTimeMaybeValid } from "luxon";

import { aDateToDate, compareADate } from "#/core/common/adate";
import { parseEntityLinkStd } from "#/core/common/entity-link";
import { measureText } from "#/core/utils";

export function occasionTimeEventName(
  block: TimeEventFullDaysBlock,
  contact: Contact,
  occasion: Occasion,
) {
  const date = aDateToDate(block.start_date);
  const contactName = contact.name;
  switch (occasion.kind) {
    case OccasionKind.BIRTHDAY:
      return `${contactName}'s Birthday on '${date.toFormat("yy")}'`;
    case OccasionKind.ANNIVERSARY:
      return `${contactName}'s Anniversary for ${occasion.name} on '${date.toFormat("yy")}'`;
    case OccasionKind.HOLIDAY:
      return `${contactName}'s ${occasion.name} holidays on '${date.toFormat("yy")}'`;
    case OccasionKind.OTHER:
      return `${contactName}'s ${occasion.name} on '${date.toFormat("yy")}'`;
  }
}

export const INBOX_TASK_TIME_EVENT_COLOR = ScheduleStreamColor.BLUE;
export const BIG_PLAN_TIME_EVENT_COLOR = ScheduleStreamColor.BLUE;
export const TODO_TASK_TIME_EVENT_COLOR = ScheduleStreamColor.BLUE;
export const HABIT_TIME_EVENT_COLOR = ScheduleStreamColor.GREEN;
export const CHORE_TIME_EVENT_COLOR = ScheduleStreamColor.ORANGE;
export const TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR = ScheduleStreamColor.BLUE;
export const BIRTHDAY_TIME_EVENT_COLOR = ScheduleStreamColor.GREEN;
export const VACATION_TIME_EVENT_COLOR = ScheduleStreamColor.ORANGE;
export const BIG_PLAN_MILESTONE_TIME_EVENT_COLOR = ScheduleStreamColor.RED;

export function sortBirthdayTimeEventsNaturally(
  timeEvents: Array<CombinedTimeEventFullDaysEntry>,
): CombinedTimeEventFullDaysEntry[] {
  return [...timeEvents].sort((j1, j2) => {
    return compareADate(j1.time_event.start_date, j2.time_event.start_date);
  });
}

export function sortInboxTaskTimeEventsNaturally(
  timeEvents: Array<CombinedTimeEventInDayEntry>,
): CombinedTimeEventInDayEntry[] {
  return [...timeEvents].sort((j1, j2) => {
    return (
      calculateStartTimeForTimeEvent(j1.time_event_in_tz).toMillis() -
      calculateStartTimeForTimeEvent(j2.time_event_in_tz).toMillis()
    );
  });
}

export interface CombinedTimeEventFullDaysEntry {
  time_event: TimeEventFullDaysBlock;
  entry:
    | ScheduleFullDaysEventEntry
    | PersonOccasionEntry
    | VacationEntry
    | BigPlanMilestoneEntry;
}

export interface CombinedTimeEventInDaySplit {
  // The block the piece was cut out of, whose start and duration cover the
  // whole of the event rather than just the one day.
  whole_time_event_in_tz: TimeEventInDayBlock;
  // False for the piece holding the event's real start, true for the ones
  // trailing after it.
  is_continuation: boolean;
}

export interface CombinedTimeEventInDayEntry {
  time_event_in_tz: TimeEventInDayBlock;
  // An event spilling past midnight shows up as one piece per day it covers.
  // Each piece points back at the block as a whole, since on its own it only
  // knows about its own day.
  split_from?: CombinedTimeEventInDaySplit;
  entry:
    | ScheduleInDayEventEntry
    | BigPlanEntry
    | TodoTaskEntry
    | HabitEntry
    | ChoreEntry
    | TimePlanActivityEntry;
}

const FULL_DAYS_OWNER_TYPES_IN_ORDER: NamedEntityTag[] = [
  NamedEntityTag.VACATION,
  NamedEntityTag.OCCASION,
  NamedEntityTag.BIG_PLAN_MILESTONE,
  NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS,
];

export function compareOwnerTypeForSortingFullDaysTimeEvents(
  theType1: string,
  theType2: string,
): number {
  const index1 = FULL_DAYS_OWNER_TYPES_IN_ORDER.indexOf(
    theType1 as NamedEntityTag,
  );
  const index2 = FULL_DAYS_OWNER_TYPES_IN_ORDER.indexOf(
    theType2 as NamedEntityTag,
  );

  return index1 - index2;
}

export function timeEventInDayBlockOwnerTheType(
  block: Pick<TimeEventInDayBlock, "owner">,
): NamedEntityTag {
  const { theType } = parseEntityLinkStd(block.owner);
  return theType as NamedEntityTag;
}

export function isTimeEventInDayBlockEditable(ownerLink: string) {
  const { theType } = parseEntityLinkStd(ownerLink);
  if (theType === NamedEntityTag.BIG_PLAN) {
    return true;
  }
  if (theType === NamedEntityTag.TODO_TASK) {
    return true;
  }
  if (theType === NamedEntityTag.HABIT) {
    return true;
  }
  if (theType === NamedEntityTag.CHORE) {
    return true;
  }
  if (theType === NamedEntityTag.TIME_PLAN_ACTIVITY) {
    return true;
  }

  return false;
}

interface TimeEventInDayBlockParams {
  startDate: ADate;
  startTimeInDay?: TimeInDay;
}

// A day of the calendar parses the same handful of starting times over and
// over - once to place each event, and again for every event it is measured
// against when working out what overlaps what. Parsing is by far the most
// expensive thing in those loops, and the start of a block is nothing but a
// function of two strings, so the answer is worth keeping. The instances
// handed back are Luxon's, which are immutable, so sharing one is safe.
const PARSED_START_TIME_CACHE_LIMIT = 8192;
const parsedStartTimeCache = new Map<string, DateTimeMaybeValid>();

function parseStartTime(isoStartTime: string): DateTimeMaybeValid {
  const cached = parsedStartTimeCache.get(isoStartTime);
  if (cached !== undefined) {
    return cached;
  }

  const startTime = DateTime.fromISO(isoStartTime, { zone: "UTC" });
  // A calendar only ever looks at a period at a time, so the cache is small
  // in practice; it's emptied rather than trimmed when a long session does
  // manage to fill it.
  if (parsedStartTimeCache.size >= PARSED_START_TIME_CACHE_LIMIT) {
    parsedStartTimeCache.clear();
  }
  parsedStartTimeCache.set(isoStartTime, startTime);
  return startTime;
}

export function calculateStartTimeFromBlockParams(
  blockParams: TimeEventInDayBlockParams,
): DateTime {
  return parseStartTime(
    `${blockParams.startDate}T${blockParams.startTimeInDay}`,
  );
}

export function calculateEndTimeFromBlockParams(
  blockParams: TimeEventInDayBlockParams,
  durationMins: number,
): DateTime<true> {
  const startTime = calculateStartTimeFromBlockParams(blockParams);
  return startTime.plus({ minutes: durationMins });
}

export function calculateStartTimeForTimeEvent(
  timeEvent: TimeEventInDayBlock,
): DateTime<true> {
  const startTime = parseStartTime(
    `${timeEvent.start_date}T${timeEvent.start_time_in_day}`,
  );
  if (!startTime.isValid) {
    throw new Error(
      `Invalid start time: ${timeEvent.start_date}T${timeEvent.start_time_in_day}`,
    );
  }
  return startTime;
}

export function calculateEndTimeForTimeEvent(
  timeEvent: TimeEventInDayBlock,
): DateTime<true> {
  const startTime = calculateStartTimeForTimeEvent(timeEvent);
  const endTime = startTime.plus({ minutes: timeEvent.duration_mins });

  return endTime;
}

// The same two instants as plain milliseconds. Laying out a day compares
// every event against every other one, and comparing numbers skips building
// a DateTime for each end time just to throw it away again.
const MS_PER_MINUTE = 60 * 1000;

export function timeEventInDayBlockStartMs(
  timeEvent: TimeEventInDayBlock,
): number {
  return calculateStartTimeForTimeEvent(timeEvent).toMillis();
}

export function timeEventInDayBlockEndMs(
  timeEvent: TimeEventInDayBlock,
): number {
  return (
    timeEventInDayBlockStartMs(timeEvent) +
    timeEvent.duration_mins * MS_PER_MINUTE
  );
}

// The buffers are the logistics around an event - getting there, and winding
// down after - so they sit outside the event proper and are optional.
export const TIME_EVENT_BUFFER_PRESETS_MINS = [5, 15, 30];

export function timeEventInDayBuffersLabel(
  timeEvent: Pick<
    TimeEventInDayBlock,
    "buffer_before_mins" | "buffer_after_mins"
  >,
): string | undefined {
  const before = timeEvent.buffer_before_mins ?? null;
  const after = timeEvent.buffer_after_mins ?? null;

  if (before !== null && after !== null) {
    return `+${before}m before, +${after}m after`;
  }
  if (before !== null) {
    return `+${before}m before`;
  }
  if (after !== null) {
    return `+${after}m after`;
  }
  return undefined;
}

// Forms hand back an empty string when the field is left blank, which is how
// a buffer says it isn't there at all.
export function parseTimeEventBufferMins(
  rawBufferMins: string | undefined,
): number | null {
  if (rawBufferMins === undefined || rawBufferMins.trim() === "") {
    return null;
  }
  const bufferMins = parseInt(rawBufferMins, 10);
  if (Number.isNaN(bufferMins)) {
    return null;
  }
  return bufferMins;
}

export function timeEventInDayBlockToTimezone(
  timeEvent: TimeEventInDayBlock,
  timezone: Timezone,
): TimeEventInDayBlock {
  const { startDate, startTimeInDay } = timeEventInDayBlockParamsToTimezone(
    {
      startDate: timeEvent.start_date,
      startTimeInDay: timeEvent.start_time_in_day,
    },
    timezone,
  );

  return {
    ...timeEvent,
    start_date: startDate,
    start_time_in_day: startTimeInDay!,
  };
}

export function timeEventInDayBlockParamsToUtc(
  params: TimeEventInDayBlockParams,
  timezone: Timezone,
): TimeEventInDayBlockParams {
  if (!params.startTimeInDay) {
    // This works around some issues in the uI where the control for
    // time in day can be null which needs to trigger a validation error
    // from the backend.
    return params;
  }
  const startTime = DateTime.fromISO(
    `${params.startDate}T${params.startTimeInDay}`,
    { zone: timezone },
  );
  if (!startTime.isValid) {
    throw new Error(
      `Invalid start time: ${params.startDate}T${params.startTimeInDay}`,
    );
  }
  const utcStartTime = startTime.toUTC();
  return {
    startDate: utcStartTime.toISODate(),
    startTimeInDay: utcStartTime.toFormat("HH:mm"),
  };
}

export function timeEventInDayBlockParamsToTimezone(
  params: TimeEventInDayBlockParams,
  timezone: Timezone,
): TimeEventInDayBlockParams {
  if (!params.startTimeInDay) {
    // This works around some issues in the uI where the control for
    // time in day can be null which needs to trigger a validation error
    // from the backend.
    return params;
  }
  const startTime = DateTime.fromISO(
    `${params.startDate}T${params.startTimeInDay}`,
    { zone: "UTC" },
  );
  if (!startTime.isValid) {
    throw new Error(
      `Invalid start time: ${params.startDate}T${params.startTimeInDay}`,
    );
  }
  const localStartTime = startTime.setZone(timezone);
  if (!localStartTime.isValid) {
    throw new Error(
      `Invalid start time: ${params.startDate}T${params.startTimeInDay}`,
    );
  }
  return {
    startDate: localStartTime.toISODate(),
    startTimeInDay: localStartTime.toFormat("HH:mm"),
  };
}

export function calendarTimeEventInDayStartMinutesToRems(
  startMins: number,
  deltaHour: number,
): string | undefined {
  // Each 15 minutes is 1 rem. Display has 96=4*24 rem height.
  const startHours = Math.max(0, startMins / 15);
  const rems = startHours - deltaHour * 4;
  if (rems < 0) {
    return undefined;
  }
  return `${rems}rem`;
}

export function calendarPxHeightToMinutes(
  pxHeight: number,
  remHeight: number,
): number {
  return Math.floor(pxHeight / remHeight) * 15;
}

export function calendarTimeEventInDayDurationToRems(
  minutesSinceStartOfDay: number,
  durationMins: number,
): string {
  const durationInQuarters = computeTimeEventInDayDurationInQuarters(
    minutesSinceStartOfDay,
    durationMins,
  );
  return `${durationInQuarters}rem`;
}

// A buffer is drawn to its true size rather than rounded up to a quarter
// hour, so a short one doesn't swallow the event it hangs off.
export function calendarTimeEventInDayBufferToRems(bufferMins: number): string {
  return `${bufferMins / 15}rem`;
}

export function scheduleTimeEventInDayDurationToRems(
  durationMins: number,
): string {
  const durationInHalfs = 0.5 + Math.floor(durationMins / 30);
  return `${durationInHalfs}rem`;
}

export function computeTimeEventInDayDurationInQuarters(
  minutesSinceStartOfDay: number,
  durationMins: number,
): number {
  // Each 15 minutes is 1 rem. Display has 96=4*24 rem height.
  // If the event goes beyond the day, we cap it at 24 hours.
  const finalOffsetInMinutes = minutesSinceStartOfDay + durationMins;
  let finalDurationInMins = durationMins;
  if (finalOffsetInMinutes > 24 * 60) {
    finalDurationInMins = Math.max(15, 24 * 60 - minutesSinceStartOfDay);
  }
  return Math.max(1, finalDurationInMins / 15);
}

export function clipTimeEventFullDaysNameToWhatFits(
  name: string,
  fontSize: number,
  containerWidth: number,
): string {
  const textWidthInPx = measureText(name, fontSize);

  if (textWidthInPx <= containerWidth) {
    return name;
  } else {
    // Do some rough approximation here.
    const maxChars = Math.floor((name.length * containerWidth) / textWidthInPx);
    return `${name.substring(0, maxChars)} ...`;
  }
}

export function clipTimeEventInDayNameToWhatFits(
  startTime: DateTime,
  endTime: DateTime,
  name: string,
  fontSize: number,
  containerWidth: number,
  minutesSinceStartOfDay: number,
  durationInMins: number,
): string {
  const durationInQuarters = computeTimeEventInDayDurationInQuarters(
    0,
    durationInMins,
  );
  const durationInHalfs = Math.max(1, Math.floor(durationInQuarters / 2));

  const bigName = `[${startTime.toFormat("HH:mm")} - ${endTime.toFormat(
    "HH:mm",
  )}] ${name}`;
  const textWidthInPx = measureText(bigName, fontSize);
  const totalWidthInPx = containerWidth * durationInHalfs;

  if (textWidthInPx <= totalWidthInPx) {
    return bigName;
  } else {
    // Do some rough approximation here.
    const maxChars = Math.max(
      3,
      Math.floor((name.length * totalWidthInPx) / textWidthInPx),
    );
    return `[${startTime.toFormat("HH:mm")}] ${name.substring(
      0,
      maxChars,
    )} ...`;
  }
}

// The events of a period, gathered from the lists the calendar loads them in
// - one list per kind of thing that can hold an event - into the single list
// the calendar draws from. Every view needs the same gathering, and the
// in-day one moves each event into the timezone being looked at on the way.
export function combineTimeEventFullDaysEntries(
  entries: CalendarEventsEntries | undefined,
): Array<CombinedTimeEventFullDaysEntry> {
  if (entries === undefined) {
    return [];
  }

  const combined: Array<CombinedTimeEventFullDaysEntry> = [];
  for (const entry of entries.schedule_event_full_days_entries) {
    combined.push({ time_event: entry.time_event, entry: entry });
  }
  for (const entry of entries.person_occasion_entries) {
    combined.push({ time_event: entry.occasion_time_event, entry: entry });
  }
  for (const entry of entries.vacation_entries) {
    combined.push({ time_event: entry.time_event, entry: entry });
  }
  for (const entry of entries.big_plan_milestone_entries) {
    combined.push({ time_event: entry.time_event, entry: entry });
  }

  return combined;
}

export function combineTimeEventInDayEntries(
  entries: CalendarEventsEntries | undefined,
  timezone: Timezone,
): Array<CombinedTimeEventInDayEntry> {
  if (entries === undefined) {
    return [];
  }

  const combined: Array<CombinedTimeEventInDayEntry> = [];
  for (const entry of entries.schedule_event_in_day_entries) {
    combined.push({
      time_event_in_tz: timeEventInDayBlockToTimezone(
        entry.time_event,
        timezone,
      ),
      entry: entry,
    });
  }
  for (const entry of entries.big_plan_entries) {
    for (const timeEvent of entry.time_events) {
      combined.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(timeEvent, timezone),
        entry: entry,
      });
    }
  }
  for (const entry of entries.todo_task_entries) {
    for (const timeEvent of entry.time_events) {
      combined.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(timeEvent, timezone),
        entry: entry,
      });
    }
  }
  for (const entry of entries.habit_entries) {
    for (const timeEvent of entry.time_events) {
      combined.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(timeEvent, timezone),
        entry: entry,
      });
    }
  }
  for (const entry of entries.chore_entries) {
    for (const timeEvent of entry.time_events) {
      combined.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(timeEvent, timezone),
        entry: entry,
      });
    }
  }
  for (const entry of entries.time_plan_activity_entries) {
    for (const timeEvent of entry.time_events) {
      combined.push({
        time_event_in_tz: timeEventInDayBlockToTimezone(timeEvent, timezone),
        entry: entry,
      });
    }
  }

  return combined;
}

export function combinedTimeEventFullDayEntryPartionByDay(
  entries: Array<CombinedTimeEventFullDaysEntry>,
): Record<string, Array<CombinedTimeEventFullDaysEntry>> {
  const partition: Record<string, Array<CombinedTimeEventFullDaysEntry>> = {};

  for (const entry of entries) {
    const firstDate = aDateToDate(entry.time_event.start_date);
    for (let idx = 0; idx < entry.time_event.duration_days; idx++) {
      const date = firstDate.plus({ days: idx });

      const dateStr = date.toISODate();
      if (partition[dateStr] === undefined) {
        partition[dateStr] = [];
      }
      partition[dateStr].push(entry);
    }
  }

  for (const dateStr in partition) {
    partition[dateStr] = sortTimeEventFullDaysByType(partition[dateStr]);
  }

  return partition;
}

export function sortTimeEventFullDaysByType(
  entries: Array<CombinedTimeEventFullDaysEntry>,
) {
  return entries.sort((a, b) => {
    const t1 = parseEntityLinkStd(a.time_event.owner).theType;
    const t2 = parseEntityLinkStd(b.time_event.owner).theType;
    if (t1 === t2) {
      return compareADate(a.time_event.start_date, b.time_event.start_date);
    }

    return compareOwnerTypeForSortingFullDaysTimeEvents(t1, t2);
  });
}

const MINUTES_PER_DAY = 24 * 60;

// Where the event starts within its day, straight off the "HH:mm" it's
// written down as.
export function timeEventInDayBlockStartMinutesInDay(
  timeEvent: TimeEventInDayBlock,
): number {
  const [hours, minutes] = timeEvent.start_time_in_day.split(":");
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

export function splitTimeEventInDayEntryIntoPerDayEntries(
  entry: CombinedTimeEventInDayEntry,
): {
  day1: CombinedTimeEventInDayEntry;
  day2?: CombinedTimeEventInDayEntry;
  day3?: CombinedTimeEventInDayEntry;
} {
  // Almost every event begins and ends on the same day, and that much can be
  // told from the clock alone - no need to work out the two dates it would
  // take to find out the hard way.
  if (
    timeEventInDayBlockStartMinutesInDay(entry.time_event_in_tz) +
      entry.time_event_in_tz.duration_mins <
    MINUTES_PER_DAY
  ) {
    return {
      day1: entry,
    };
  }

  const startTime = calculateStartTimeForTimeEvent(entry.time_event_in_tz);
  const endTime = calculateEndTimeForTimeEvent(entry.time_event_in_tz);
  const diffInDays = endTime
    .startOf("day")
    .diff(startTime.startOf("day"), "days").days;

  if (diffInDays === 0) {
    // Here we have only one day.
    return {
      day1: entry,
    };
  } else if (diffInDays === 1) {
    // Here we have two days.
    const day1TimeEvent = {
      ...entry.time_event_in_tz,
      duration_mins:
        -1 *
        startTime.diff(startTime.set({ hour: 23, minute: 59 })).as("minutes"),
      // Only the piece holding an edge of the event carries the buffer there.
      buffer_after_mins: null,
    };
    const day2TimeEvent = {
      ...entry.time_event_in_tz,
      start_date: endTime.toISODate(),
      start_time_in_day: "00:00",
      duration_mins: endTime
        .diff(endTime.set({ hour: 0, minute: 0 }))
        .as("minutes"),
      buffer_before_mins: null,
    };

    return {
      day1: {
        time_event_in_tz: day1TimeEvent,
        split_from: {
          whole_time_event_in_tz: entry.time_event_in_tz,
          is_continuation: false,
        },
        entry: {
          ...entry.entry,
          time_event: day1TimeEvent,
        },
      },
      day2: {
        time_event_in_tz: day2TimeEvent,
        split_from: {
          whole_time_event_in_tz: entry.time_event_in_tz,
          is_continuation: true,
        },
        entry: {
          ...entry.entry,
          time_event: day2TimeEvent,
        },
      },
    };
  } else if (diffInDays === 2) {
    // Here we have three days.
    const day1TimeEvent = {
      ...entry.time_event_in_tz,
      duration_mins:
        -1 *
        startTime.diff(startTime.set({ hour: 23, minute: 59 })).as("minutes"),
      // Only the piece holding an edge of the event carries the buffer there.
      buffer_after_mins: null,
    };
    const day2TimeEvent = {
      ...entry.time_event_in_tz,
      start_date: startTime.plus({ days: 1 }).toISODate(),
      start_time_in_day: "00:00",
      duration_mins: 24 * 60,
      buffer_before_mins: null,
      buffer_after_mins: null,
    };
    const day3TimeEvent = {
      ...entry.time_event_in_tz,
      start_date: endTime.toISODate(),
      start_time_in_day: "00:00",
      duration_mins: endTime
        .diff(endTime.set({ hour: 0, minute: 0 }))
        .as("minutes"),
      buffer_before_mins: null,
    };

    return {
      day1: {
        time_event_in_tz: day1TimeEvent,
        split_from: {
          whole_time_event_in_tz: entry.time_event_in_tz,
          is_continuation: false,
        },
        entry: {
          ...entry.entry,
          time_event: day1TimeEvent,
        },
      },
      day2: {
        time_event_in_tz: day2TimeEvent,
        split_from: {
          whole_time_event_in_tz: entry.time_event_in_tz,
          is_continuation: true,
        },
        entry: {
          ...entry.entry,
          time_event: day2TimeEvent,
        },
      },
      day3: {
        time_event_in_tz: day3TimeEvent,
        split_from: {
          whole_time_event_in_tz: entry.time_event_in_tz,
          is_continuation: true,
        },
        entry: {
          ...entry.entry,
          time_event: day3TimeEvent,
        },
      },
    };
  } else {
    throw new Error("Unexpected time event duration");
  }
}

export function combinedTimeEventInDayEntryPartionByDay(
  entries: Array<CombinedTimeEventInDayEntry>,
): Record<string, Array<CombinedTimeEventInDayEntry>> {
  const partition: Record<string, Array<CombinedTimeEventInDayEntry>> = {};

  for (const entry of entries) {
    const splitEntries = splitTimeEventInDayEntryIntoPerDayEntries(entry);

    const dateStr = splitEntries.day1.time_event_in_tz.start_date;
    if (partition[dateStr] === undefined) {
      partition[dateStr] = [];
    }
    partition[dateStr].push(splitEntries.day1);

    if (splitEntries.day2) {
      const dateStr = splitEntries.day2.time_event_in_tz.start_date;
      if (partition[dateStr] === undefined) {
        partition[dateStr] = [];
      }
      partition[dateStr].push(splitEntries.day2);
    }

    if (splitEntries.day3) {
      const dateStr = splitEntries.day3.time_event_in_tz.start_date;
      if (partition[dateStr] === undefined) {
        partition[dateStr] = [];
      }
      partition[dateStr].push(splitEntries.day3);
    }
  }

  // Now sort all partitions.
  for (const dateStr in partition) {
    partition[dateStr] = sortTimeEventInDayByStartTimeAndEndTime(
      partition[dateStr],
    );
  }

  return partition;
}

export function sortTimeEventInDayByStartTimeAndEndTime(
  entries: Array<CombinedTimeEventInDayEntry>,
) {
  return entries.sort((a, b) => {
    const aStartMs = timeEventInDayBlockStartMs(a.time_event_in_tz);
    const bStartMs = timeEventInDayBlockStartMs(b.time_event_in_tz);

    if (aStartMs === bStartMs) {
      // Two events that start together go shortest first. Comparing the
      // DateTimes themselves never got here, since no two of them are the
      // same object, and the order of a tie was left to chance.
      const aEndMs = timeEventInDayBlockEndMs(a.time_event_in_tz);
      const bEndMs = timeEventInDayBlockEndMs(b.time_event_in_tz);
      if (aEndMs === bEndMs) {
        return 0;
      }
      return aEndMs < bEndMs ? -1 : 1;
    }
    return aStartMs < bStartMs ? -1 : 1;
  });
}

// How much before the start and after the end of an event we look for
// other events when peeking at the events overlapping a certain one.
export const NEARBY_TIME_EVENT_WINDOW_MINS = 30;

export function findNearbyTimeEventInDayEntries(
  entries: Array<CombinedTimeEventInDayEntry>,
  focusEntry: CombinedTimeEventInDayEntry,
  windowMins: number = NEARBY_TIME_EVENT_WINDOW_MINS,
): Array<CombinedTimeEventInDayEntry> {
  const windowStartMs =
    timeEventInDayBlockStartMs(focusEntry.time_event_in_tz) -
    windowMins * MS_PER_MINUTE;
  const windowEndMs =
    timeEventInDayBlockEndMs(focusEntry.time_event_in_tz) +
    windowMins * MS_PER_MINUTE;

  // Events merely touching the window - ending exactly when it starts, or
  // starting exactly when it ends - are far enough away to be left out. The
  // focus event itself always makes the cut.
  const nearbyEntries = entries.filter((entry) => {
    const startMs = timeEventInDayBlockStartMs(entry.time_event_in_tz);
    return (
      startMs < windowEndMs &&
      startMs + entry.time_event_in_tz.duration_mins * MS_PER_MINUTE >
        windowStartMs
    );
  });

  return sortTimeEventInDayByStartTimeAndEndTime(nearbyEntries);
}

// What's near every event of a day, worked out in one go. Each event on the
// calendar wants this for itself, and each one asking separately means
// walking the day over again for every box on it.
export function buildNearbyTimeEventInDayEntriesMap(
  entries: Array<CombinedTimeEventInDayEntry>,
  windowMins: number = NEARBY_TIME_EVENT_WINDOW_MINS,
): Map<EntityId, Array<CombinedTimeEventInDayEntry>> {
  const windowMs = windowMins * MS_PER_MINUTE;
  const spans = entries.map((entry) => {
    const startMs = timeEventInDayBlockStartMs(entry.time_event_in_tz);
    return {
      entry: entry,
      startMs: startMs,
      endMs: startMs + entry.time_event_in_tz.duration_mins * MS_PER_MINUTE,
    };
  });

  const nearbyByRefId = new Map<EntityId, Array<CombinedTimeEventInDayEntry>>();
  for (const focus of spans) {
    const windowStartMs = focus.startMs - windowMs;
    const windowEndMs = focus.endMs + windowMs;
    const nearbyEntries: Array<CombinedTimeEventInDayEntry> = [];
    for (const span of spans) {
      if (span.startMs < windowEndMs && span.endMs > windowStartMs) {
        nearbyEntries.push(span.entry);
      }
    }
    nearbyByRefId.set(
      focus.entry.time_event_in_tz.ref_id,
      sortTimeEventInDayByStartTimeAndEndTime(nearbyEntries),
    );
  }

  return nearbyByRefId;
}

export interface TimeBlockLayout {
  // Which side-by-side lane the event sits in, 0 on the left.
  offset: number;
  // How many lanes this overlap group needs, so each event can take an
  // even slice rather than stretching across the whole day.
  columns: number;
}

export const DEFAULT_TIME_BLOCK_LAYOUT: TimeBlockLayout = {
  offset: 0,
  columns: 1,
};

// Weekly days are too narrow for true columns, so overlapping events still
// cascade with a small indent. Daily (and a filled time-plan day) can sit
// them side by side and cap how wide a lone event grows.
export type InDayEventOverlapStyle = "cascade" | "side-by-side";

const IN_DAY_EVENT_CASCADE_INDENT_REM = 0.8;
const IN_DAY_EVENT_MAX_WIDTH_REM = 14;
const IN_DAY_EVENT_COLUMN_GAP_REM = 0.15;
const IN_DAY_EVENT_RIGHT_INSET_REM = 0.5;

export function inDayEventLayoutSx(
  layout: TimeBlockLayout,
  overlapStyle: InDayEventOverlapStyle,
): {
  minWidth: number | string;
  maxWidth?: string;
  width: string;
  marginLeft: string;
  overflow: "hidden";
  zIndex: number;
} {
  const offset = layout.offset;

  if (overlapStyle === "cascade") {
    return {
      minWidth: `calc(7rem - ${offset * IN_DAY_EVENT_CASCADE_INDENT_REM}rem - ${IN_DAY_EVENT_RIGHT_INSET_REM}rem)`,
      width: `calc(100% - ${offset * IN_DAY_EVENT_CASCADE_INDENT_REM}rem - ${IN_DAY_EVENT_RIGHT_INSET_REM}rem)`,
      marginLeft: `${offset * IN_DAY_EVENT_CASCADE_INDENT_REM}rem`,
      overflow: "hidden",
      zIndex: offset,
    };
  }

  const columns = Math.max(1, layout.columns);
  const gapTotal = (columns - 1) * IN_DAY_EVENT_COLUMN_GAP_REM;
  const fluidColumn = `(100% - ${IN_DAY_EVENT_RIGHT_INSET_REM}rem - ${gapTotal}rem) / ${columns}`;
  const packedStep = IN_DAY_EVENT_MAX_WIDTH_REM + IN_DAY_EVENT_COLUMN_GAP_REM;

  return {
    minWidth: 0,
    maxWidth: `${IN_DAY_EVENT_MAX_WIDTH_REM}rem`,
    width: `calc(${fluidColumn})`,
    marginLeft:
      offset === 0
        ? "0rem"
        : `min(calc(${packedStep}rem * ${offset}), calc((${fluidColumn} + ${IN_DAY_EVENT_COLUMN_GAP_REM}rem) * ${offset}))`,
    overflow: "hidden",
    zIndex: offset,
  };
}

// How many events can sit side by side in a day before the rest pile on top
// of the last lane.
const MAX_IN_DAY_EVENT_LANES = 5;
const QUARTERS_PER_DAY = 24 * 4;

export function buildTimeBlockOffsetsMap(
  entries: Array<CombinedTimeEventInDayEntry>,
  startOfDay: DateTime,
): Map<EntityId, TimeBlockLayout> {
  const startOfDayMs = startOfDay.toMillis();
  const offsets = new Map<EntityId, number>();

  // One flag per quarter hour per lane: whether something already sits there.
  const takenLanes: Array<Array<boolean>> = [];
  for (let idx = 0; idx < QUARTERS_PER_DAY; idx++) {
    takenLanes.push(new Array<boolean>(MAX_IN_DAY_EVENT_LANES).fill(false));
  }

  const spans = entries.map((entry) => {
    const startMs = timeEventInDayBlockStartMs(entry.time_event_in_tz);
    return {
      refId: entry.time_event_in_tz.ref_id,
      startMs: startMs,
      endMs: startMs + entry.time_event_in_tz.duration_mins * MS_PER_MINUTE,
      startMins: (startMs - startOfDayMs) / MS_PER_MINUTE,
      durationMins: entry.time_event_in_tz.duration_mins,
    };
  });

  for (const span of spans) {
    const firstCellIdx = Math.floor(span.startMins / 15);
    const takenAtStart = takenLanes[firstCellIdx];
    if (takenAtStart === undefined) {
      // An event starting outside the day it's drawn in has nowhere to go,
      // so it takes the leftmost lane and leaves the rest alone.
      offsets.set(span.refId, 0);
      continue;
    }

    // The leftmost lane that's free where the event starts, with the last
    // one taking whatever doesn't fit.
    let lane = MAX_IN_DAY_EVENT_LANES - 1;
    for (let idx = 0; idx < MAX_IN_DAY_EVENT_LANES; idx++) {
      if (!takenAtStart[idx]) {
        lane = idx;
        break;
      }
    }

    offsets.set(span.refId, lane);
    for (
      let mins = span.startMins;
      mins < span.startMins + span.durationMins;
      mins += 15
    ) {
      const cell = takenLanes[Math.floor(mins / 15)];
      if (cell !== undefined) {
        cell[lane] = true;
      }
    }
  }

  const layouts = new Map<EntityId, TimeBlockLayout>();
  for (const span of spans) {
    const offset = offsets.get(span.refId) ?? 0;
    let maxOffset = offset;

    for (const other of spans) {
      if (other.refId === span.refId) {
        continue;
      }
      if (other.startMs < span.endMs && other.endMs > span.startMs) {
        maxOffset = Math.max(maxOffset, offsets.get(other.refId) ?? 0);
      }
    }

    layouts.set(span.refId, { offset: offset, columns: maxOffset + 1 });
  }

  return layouts;
}

export function statsSubperiodForPeriod(
  period: RecurringTaskPeriod,
): RecurringTaskPeriod | null {
  switch (period) {
    case RecurringTaskPeriod.DAILY:
      return null;
    case RecurringTaskPeriod.WEEKLY:
      return RecurringTaskPeriod.DAILY;
    case RecurringTaskPeriod.MONTHLY:
      return RecurringTaskPeriod.DAILY;
    case RecurringTaskPeriod.QUARTERLY:
      return RecurringTaskPeriod.WEEKLY;
    case RecurringTaskPeriod.YEARLY:
      return RecurringTaskPeriod.MONTHLY;
  }
}

export function monthToQuarter(month: number): string {
  switch (month) {
    case 1:
    case 2:
    case 3:
      return "Q1";
    case 4:
    case 5:
    case 6:
      return "Q2";
    case 7:
    case 8:
    case 9:
      return "Q3";
    case 10:
    case 11:
    case 12:
      return "Q4";
    default:
      throw new Error("Unexpected month");
  }
}
