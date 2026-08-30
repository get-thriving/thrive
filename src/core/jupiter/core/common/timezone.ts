import type { ADate, Timezone } from "@jupiter/webapi-client";
import { DateTime } from "luxon";

// How many timezones besides the user's own one the calendar shows. The
// schedule domain enforces the same bound.
export const MAX_ADDITIONAL_TIMEZONES = 2;

// The last segment of an IANA name is the closest thing a timezone has to a
// human name - "Europe/Bucharest" reads as "Bucharest".
export function timezoneShortName(timezone: Timezone): string {
  const parts = timezone.split("/");
  return parts[parts.length - 1].replace(/_/g, " ");
}

// How far ahead of `baseTimezone` the `timezone` runs on a given day, in
// minutes. Measured at midday, so a daylight saving switch at either edge of
// the day doesn't decide the answer for the whole day.
export function timezoneOffsetMinutes(
  timezone: Timezone,
  baseTimezone: Timezone,
  onDate: ADate,
): number {
  const inBase = DateTime.fromISO(`${onDate}T12:00:00`, { zone: baseTimezone });
  if (!inBase.isValid) {
    return 0;
  }
  const inOther = inBase.setZone(timezone);
  if (!inOther.isValid) {
    return 0;
  }
  return inOther.offset - inBase.offset;
}

// The clock reading in another timezone for a whole hour in the base one.
export function timezoneHourLabel(hour: number, offsetMinutes: number): string {
  const minutesInDay = 24 * 60;
  const shifted =
    (((hour * 60 + offsetMinutes) % minutesInDay) + minutesInDay) %
    minutesInDay;
  const shiftedHour = Math.floor(shifted / 60);
  const shiftedMinute = shifted % 60;
  return `${String(shiftedHour).padStart(2, "0")}:${String(
    shiftedMinute,
  ).padStart(2, "0")}`;
}
