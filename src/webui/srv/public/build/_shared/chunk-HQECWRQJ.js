import {
  extractBirthday
} from "/build/_shared/chunk-IRHCW4HP.js";
import {
  DateTime
} from "/build/_shared/chunk-LT7567PB.js";

// ../core/jupiter/core/life_plan/root.ts
function lifePlanBirthdayDate(lifePlan) {
  const { day, month } = extractBirthday(lifePlan.birthday);
  const birthdayDate = DateTime.fromObject({
    year: lifePlan.birth_year,
    month,
    day
  });
  if (!birthdayDate.isValid) {
    throw new Error(`Invalid birthday date: ${lifePlan.birthday}`);
  }
  return birthdayDate;
}

export {
  lifePlanBirthdayDate
};
//# sourceMappingURL=/build/_shared/chunk-HQECWRQJ.js.map
