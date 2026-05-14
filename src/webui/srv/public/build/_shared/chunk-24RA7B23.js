import {
  parseEntityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import {
  aDateToDate,
  compareADate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  DateTime
} from "/build/_shared/chunk-LT7567PB.js";
import {
  measureText
} from "/build/_shared/chunk-L6BTFETC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/time_events/time-event.ts
var import_webapi_client = __toESM(require_dist(), 1);
function occasionTimeEventName(block, contact, occasion) {
  const date = aDateToDate(block.start_date);
  const contactName = contact.name;
  switch (occasion.kind) {
    case import_webapi_client.OccasionKind.BIRTHDAY:
      return `${contactName}'s Birthday on '${date.toFormat("yy")}'`;
    case import_webapi_client.OccasionKind.ANNIVERSARY:
      return `${contactName}'s Anniversary for ${occasion.name} on '${date.toFormat("yy")}'`;
    case import_webapi_client.OccasionKind.HOLIDAY:
      return `${contactName}'s ${occasion.name} holidays on '${date.toFormat("yy")}'`;
    case import_webapi_client.OccasionKind.OTHER:
      return `${contactName}'s ${occasion.name} on '${date.toFormat("yy")}'`;
  }
}
var INBOX_TASK_TIME_EVENT_COLOR = import_webapi_client.ScheduleStreamColor.BLUE;
var BIG_PLAN_TIME_EVENT_COLOR = import_webapi_client.ScheduleStreamColor.BLUE;
var TODO_TASK_TIME_EVENT_COLOR = import_webapi_client.ScheduleStreamColor.BLUE;
var HABIT_TIME_EVENT_COLOR = import_webapi_client.ScheduleStreamColor.GREEN;
var CHORE_TIME_EVENT_COLOR = import_webapi_client.ScheduleStreamColor.ORANGE;
var TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR = import_webapi_client.ScheduleStreamColor.BLUE;
var BIRTHDAY_TIME_EVENT_COLOR = import_webapi_client.ScheduleStreamColor.GREEN;
var VACATION_TIME_EVENT_COLOR = import_webapi_client.ScheduleStreamColor.ORANGE;
function sortBirthdayTimeEventsNaturally(timeEvents) {
  return [...timeEvents].sort((j1, j2) => {
    return compareADate(j1.time_event.start_date, j2.time_event.start_date);
  });
}
function sortInboxTaskTimeEventsNaturally(timeEvents) {
  return [...timeEvents].sort((j1, j2) => {
    return calculateStartTimeForTimeEvent(j1.time_event_in_tz).toMillis() - calculateStartTimeForTimeEvent(j2.time_event_in_tz).toMillis();
  });
}
var FULL_DAYS_OWNER_TYPES_IN_ORDER = [
  import_webapi_client.NamedEntityTag.VACATION,
  import_webapi_client.NamedEntityTag.OCCASION,
  import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS
];
function compareOwnerTypeForSortingFullDaysTimeEvents(theType1, theType2) {
  const index1 = FULL_DAYS_OWNER_TYPES_IN_ORDER.indexOf(
    theType1
  );
  const index2 = FULL_DAYS_OWNER_TYPES_IN_ORDER.indexOf(
    theType2
  );
  return index1 - index2;
}
function timeEventInDayBlockOwnerTheType(block) {
  const { theType } = parseEntityLinkStd(block.owner);
  return theType;
}
function isTimeEventInDayBlockEditable(ownerLink) {
  const { theType } = parseEntityLinkStd(ownerLink);
  if (theType === import_webapi_client.NamedEntityTag.BIG_PLAN) {
    return true;
  }
  if (theType === import_webapi_client.NamedEntityTag.TODO_TASK) {
    return true;
  }
  if (theType === import_webapi_client.NamedEntityTag.HABIT) {
    return true;
  }
  if (theType === import_webapi_client.NamedEntityTag.CHORE) {
    return true;
  }
  if (theType === import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY) {
    return true;
  }
  return false;
}
function calculateStartTimeFromBlockParams(blockParams) {
  return DateTime.fromISO(
    `${blockParams.startDate}T${blockParams.startTimeInDay}`,
    { zone: "UTC" }
  );
}
function calculateStartTimeForTimeEvent(timeEvent) {
  const startTime = DateTime.fromISO(
    `${timeEvent.start_date}T${timeEvent.start_time_in_day}`,
    { zone: "UTC" }
  );
  if (!startTime.isValid) {
    throw new Error(
      `Invalid start time: ${timeEvent.start_date}T${timeEvent.start_time_in_day}`
    );
  }
  return startTime;
}
function calculateEndTimeForTimeEvent(timeEvent) {
  const startTime = calculateStartTimeForTimeEvent(timeEvent);
  const endTime = startTime.plus({ minutes: timeEvent.duration_mins });
  return endTime;
}
function timeEventInDayBlockToTimezone(timeEvent, timezone) {
  const { startDate, startTimeInDay } = timeEventInDayBlockParamsToTimezone(
    {
      startDate: timeEvent.start_date,
      startTimeInDay: timeEvent.start_time_in_day
    },
    timezone
  );
  return {
    ...timeEvent,
    start_date: startDate,
    start_time_in_day: startTimeInDay
  };
}
function timeEventInDayBlockParamsToTimezone(params, timezone) {
  if (!params.startTimeInDay) {
    return params;
  }
  const startTime = DateTime.fromISO(
    `${params.startDate}T${params.startTimeInDay}`,
    { zone: "UTC" }
  );
  if (!startTime.isValid) {
    throw new Error(
      `Invalid start time: ${params.startDate}T${params.startTimeInDay}`
    );
  }
  const localStartTime = startTime.setZone(timezone);
  if (!localStartTime.isValid) {
    throw new Error(
      `Invalid start time: ${params.startDate}T${params.startTimeInDay}`
    );
  }
  return {
    startDate: localStartTime.toISODate(),
    startTimeInDay: localStartTime.toFormat("HH:mm")
  };
}
function calendarTimeEventInDayStartMinutesToRems(startMins, deltaHour) {
  const startHours = Math.max(0, startMins / 15);
  const rems = startHours - deltaHour * 4;
  if (rems < 0) {
    return void 0;
  }
  return `${rems}rem`;
}
function calendarPxHeightToMinutes(pxHeight, remHeight) {
  return Math.floor(pxHeight / remHeight) * 15;
}
function calendarTimeEventInDayDurationToRems(minutesSinceStartOfDay, durationMins) {
  const durationInQuarters = computeTimeEventInDayDurationInQuarters(
    minutesSinceStartOfDay,
    durationMins
  );
  return `${durationInQuarters}rem`;
}
function scheduleTimeEventInDayDurationToRems(durationMins) {
  const durationInHalfs = 0.5 + Math.floor(durationMins / 30);
  return `${durationInHalfs}rem`;
}
function computeTimeEventInDayDurationInQuarters(minutesSinceStartOfDay, durationMins) {
  const finalOffsetInMinutes = minutesSinceStartOfDay + durationMins;
  let finalDurationInMins = durationMins;
  if (finalOffsetInMinutes > 24 * 60) {
    finalDurationInMins = Math.max(15, 24 * 60 - minutesSinceStartOfDay);
  }
  return Math.max(1, finalDurationInMins / 15);
}
function clipTimeEventFullDaysNameToWhatFits(name, fontSize, containerWidth) {
  const textWidthInPx = measureText(name, fontSize);
  if (textWidthInPx <= containerWidth) {
    return name;
  } else {
    const maxChars = Math.floor(name.length * containerWidth / textWidthInPx);
    return `${name.substring(0, maxChars)} ...`;
  }
}
function clipTimeEventInDayNameToWhatFits(startTime, endTime, name, fontSize, containerWidth, minutesSinceStartOfDay, durationInMins) {
  const durationInQuarters = computeTimeEventInDayDurationInQuarters(
    0,
    durationInMins
  );
  const durationInHalfs = Math.max(1, Math.floor(durationInQuarters / 2));
  const bigName = `[${startTime.toFormat("HH:mm")} - ${endTime.toFormat(
    "HH:mm"
  )}] ${name}`;
  const textWidthInPx = measureText(bigName, fontSize);
  const totalWidthInPx = containerWidth * durationInHalfs;
  if (textWidthInPx <= totalWidthInPx) {
    return bigName;
  } else {
    const maxChars = Math.max(
      3,
      Math.floor(name.length * totalWidthInPx / textWidthInPx)
    );
    return `[${startTime.toFormat("HH:mm")}] ${name.substring(
      0,
      maxChars
    )} ...`;
  }
}
function combinedTimeEventFullDayEntryPartionByDay(entries) {
  const partition = {};
  for (const entry of entries) {
    const firstDate = aDateToDate(entry.time_event.start_date);
    for (let idx = 0; idx < entry.time_event.duration_days; idx++) {
      const date = firstDate.plus({ days: idx });
      const dateStr = date.toISODate();
      if (partition[dateStr] === void 0) {
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
function sortTimeEventFullDaysByType(entries) {
  return entries.sort((a, b) => {
    const t1 = parseEntityLinkStd(a.time_event.owner).theType;
    const t2 = parseEntityLinkStd(b.time_event.owner).theType;
    if (t1 === t2) {
      return compareADate(a.time_event.start_date, b.time_event.start_date);
    }
    return compareOwnerTypeForSortingFullDaysTimeEvents(t1, t2);
  });
}
function splitTimeEventInDayEntryIntoPerDayEntries(entry) {
  const startTime = calculateStartTimeForTimeEvent(entry.time_event_in_tz);
  const endTime = calculateEndTimeForTimeEvent(entry.time_event_in_tz);
  const diffInDays = endTime.startOf("day").diff(startTime.startOf("day"), "days").days;
  if (diffInDays === 0) {
    return {
      day1: entry
    };
  } else if (diffInDays === 1) {
    const day1TimeEvent = {
      ...entry.time_event_in_tz,
      duration_mins: -1 * startTime.diff(startTime.set({ hour: 23, minute: 59 })).as("minutes")
    };
    const day2TimeEvent = {
      ...entry.time_event_in_tz,
      start_date: endTime.toISODate(),
      start_time_in_day: "00:00",
      duration_mins: endTime.diff(endTime.set({ hour: 0, minute: 0 })).as("minutes")
    };
    return {
      day1: {
        time_event_in_tz: day1TimeEvent,
        entry: {
          ...entry.entry,
          time_event: day1TimeEvent
        }
      },
      day2: {
        time_event_in_tz: day2TimeEvent,
        entry: {
          ...entry.entry,
          time_event: day2TimeEvent
        }
      }
    };
  } else if (diffInDays === 2) {
    const day1TimeEvent = {
      ...entry.time_event_in_tz,
      duration_mins: -1 * startTime.diff(startTime.set({ hour: 23, minute: 59 })).as("minutes")
    };
    const day2TimeEvent = {
      ...entry.time_event_in_tz,
      start_date: startTime.plus({ days: 1 }).toISODate(),
      start_time_in_day: "00:00",
      duration_mins: 24 * 60
    };
    const day3TimeEvent = {
      ...entry.time_event_in_tz,
      start_date: endTime.toISODate(),
      start_time_in_day: "00:00",
      duration_mins: endTime.diff(endTime.set({ hour: 0, minute: 0 })).as("minutes")
    };
    return {
      day1: {
        time_event_in_tz: day1TimeEvent,
        entry: {
          ...entry.entry,
          time_event: day1TimeEvent
        }
      },
      day2: {
        time_event_in_tz: day2TimeEvent,
        entry: {
          ...entry.entry,
          time_event: day2TimeEvent
        }
      },
      day3: {
        time_event_in_tz: day3TimeEvent,
        entry: {
          ...entry.entry,
          time_event: day3TimeEvent
        }
      }
    };
  } else {
    throw new Error("Unexpected time event duration");
  }
}
function combinedTimeEventInDayEntryPartionByDay(entries) {
  const partition = {};
  for (const entry of entries) {
    const splitEntries = splitTimeEventInDayEntryIntoPerDayEntries(entry);
    const dateStr = splitEntries.day1.time_event_in_tz.start_date;
    if (partition[dateStr] === void 0) {
      partition[dateStr] = [];
    }
    partition[dateStr].push(splitEntries.day1);
    if (splitEntries.day2) {
      const dateStr2 = splitEntries.day2.time_event_in_tz.start_date;
      if (partition[dateStr2] === void 0) {
        partition[dateStr2] = [];
      }
      partition[dateStr2].push(splitEntries.day2);
    }
    if (splitEntries.day3) {
      const dateStr2 = splitEntries.day3.time_event_in_tz.start_date;
      if (partition[dateStr2] === void 0) {
        partition[dateStr2] = [];
      }
      partition[dateStr2].push(splitEntries.day3);
    }
  }
  for (const dateStr in partition) {
    partition[dateStr] = sortTimeEventInDayByStartTimeAndEndTime(
      partition[dateStr]
    );
  }
  return partition;
}
function sortTimeEventInDayByStartTimeAndEndTime(entries) {
  return entries.sort((a, b) => {
    const aStartTime = calculateStartTimeForTimeEvent(a.time_event_in_tz);
    const bStartTime = calculateStartTimeForTimeEvent(b.time_event_in_tz);
    if (aStartTime === bStartTime) {
      const aEndTime = calculateEndTimeForTimeEvent(a.time_event_in_tz);
      const bEndTime = calculateEndTimeForTimeEvent(b.time_event_in_tz);
      return aEndTime < bEndTime ? -1 : 1;
    }
    return aStartTime < bStartTime ? -1 : 1;
  });
}
function buildTimeBlockOffsetsMap(entries, startOfDay) {
  const offsets = /* @__PURE__ */ new Map();
  const freeOffsetsMap = [];
  for (let idx = 0; idx < 24 * 4; idx++) {
    freeOffsetsMap.push({
      time: startOfDay.plus({ minutes: idx * 15 }),
      offset0: false,
      offset1: false,
      offset2: false,
      offset3: false,
      offset4: false
    });
  }
  for (const entry of entries) {
    const startTime = calculateStartTimeForTimeEvent(entry.time_event_in_tz);
    const minutesSinceStartOfDay = startTime.diff(startOfDay).as("minutes");
    const firstCellIdx = Math.floor(minutesSinceStartOfDay / 15);
    const offsetCell = freeOffsetsMap[firstCellIdx];
    if (offsetCell.offset0 === false) {
      offsets.set(entry.time_event_in_tz.ref_id, 0);
      offsetCell.offset0 = true;
      for (let idx = minutesSinceStartOfDay; idx < minutesSinceStartOfDay + entry.time_event_in_tz.duration_mins; idx += 15) {
        freeOffsetsMap[Math.floor(idx / 15)].offset0 = true;
      }
      continue;
    } else if (offsetCell.offset1 === false) {
      offsets.set(entry.time_event_in_tz.ref_id, 1);
      offsetCell.offset1 = true;
      for (let idx = minutesSinceStartOfDay; idx < minutesSinceStartOfDay + entry.time_event_in_tz.duration_mins; idx += 15) {
        freeOffsetsMap[Math.floor(idx / 15)].offset1 = true;
      }
      continue;
    } else if (offsetCell.offset2 === false) {
      offsets.set(entry.time_event_in_tz.ref_id, 2);
      offsetCell.offset2 = true;
      for (let idx = minutesSinceStartOfDay; idx < minutesSinceStartOfDay + entry.time_event_in_tz.duration_mins; idx += 15) {
        freeOffsetsMap[Math.floor(idx / 15)].offset2 = true;
      }
      continue;
    } else if (offsetCell.offset3 === false) {
      offsets.set(entry.time_event_in_tz.ref_id, 3);
      offsetCell.offset3 = true;
      for (let idx = minutesSinceStartOfDay; idx < minutesSinceStartOfDay + entry.time_event_in_tz.duration_mins; idx += 15) {
        freeOffsetsMap[Math.floor(idx / 15)].offset3 = true;
      }
      continue;
    } else {
      offsets.set(entry.time_event_in_tz.ref_id, 4);
      offsetCell.offset4 = true;
      for (let idx = minutesSinceStartOfDay; idx < minutesSinceStartOfDay + entry.time_event_in_tz.duration_mins; idx += 15) {
        freeOffsetsMap[Math.floor(idx / 15)].offset4 = true;
      }
      continue;
    }
  }
  return offsets;
}

export {
  occasionTimeEventName,
  BIG_PLAN_TIME_EVENT_COLOR,
  TODO_TASK_TIME_EVENT_COLOR,
  HABIT_TIME_EVENT_COLOR,
  CHORE_TIME_EVENT_COLOR,
  TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
  BIRTHDAY_TIME_EVENT_COLOR,
  VACATION_TIME_EVENT_COLOR,
  sortBirthdayTimeEventsNaturally,
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockOwnerTheType,
  isTimeEventInDayBlockEditable,
  calculateStartTimeFromBlockParams,
  calculateStartTimeForTimeEvent,
  calculateEndTimeForTimeEvent,
  timeEventInDayBlockToTimezone,
  timeEventInDayBlockParamsToTimezone,
  calendarTimeEventInDayStartMinutesToRems,
  calendarPxHeightToMinutes,
  calendarTimeEventInDayDurationToRems,
  scheduleTimeEventInDayDurationToRems,
  clipTimeEventFullDaysNameToWhatFits,
  clipTimeEventInDayNameToWhatFits,
  combinedTimeEventFullDayEntryPartionByDay,
  combinedTimeEventInDayEntryPartionByDay,
  buildTimeBlockOffsetsMap
};
//# sourceMappingURL=/build/_shared/chunk-24RA7B23.js.map
