import { DateTime } from "luxon";
import { LifePlan } from "@jupiter/webapi-client";

import { extractBirthday } from "#/core/common/birthday";

export function lifePlanBirthdayDate(lifePlan: LifePlan): DateTime {
  const { day, month } = extractBirthday(lifePlan.birthday);
  const birthdayDate = DateTime.fromObject({
    year: lifePlan.birth_year,
    month,
    day,
  });

  if (!birthdayDate.isValid) {
    throw new Error(`Invalid birthday date: ${lifePlan.birthday}`);
  }

  return birthdayDate;
}
