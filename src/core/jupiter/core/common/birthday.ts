import type { Birthday, RecurringTaskDueAtMonth } from "@jupiter/webapi-client";

const MONTH_NAME_INDEX = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function extractBirthday(birthday: Birthday): {
  day: number;
  month: number;
} {
  const parts = birthday.split(" ");
  const day = parseInt(parts[0]);
  const month = MONTH_NAME_INDEX.findIndex((t) => t === parts[1]) + 1;
  return { day, month };
}

export function birthdayFromParts(day: number, month: number): Birthday {
  return `${day} ${MONTH_NAME_INDEX[month - 1]}` as Birthday;
}

export function dueMonthToStr(dueMonth: RecurringTaskDueAtMonth): string {
  return MONTH_NAME_INDEX[dueMonth - 1];
}
