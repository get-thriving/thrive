import {
  DateTime
} from "/build/_shared/chunk-LT7567PB.js";

// ../core/jupiter/core/common/adate.ts
function strToADate(str) {
  return DateTime.fromFormat(str, "yyyy-MM-dd").toISODate();
}
function aDateToDate(aDate) {
  const date = DateTime.fromISO(aDate);
  if (!date.isValid) {
    throw new Error(`Invalid date: ${aDate}`);
  }
  return date;
}
function dateToAdate(date) {
  return date.toISODate();
}
function compareADate(adate1, adate2) {
  if ((adate1 === void 0 || adate1 === null) && (adate2 === void 0 || adate2 === null)) {
    return 0;
  } else if (adate1 === void 0 || adate1 === null) {
    return 1;
  } else if (adate2 === void 0 || adate2 === null) {
    return -1;
  } else {
    const iso1 = aDateToDate(adate1).toISO();
    const iso2 = aDateToDate(adate2).toISO();
    if (iso1 === iso2) {
      return 0;
    }
    return iso1 > iso2 ? 1 : -1;
  }
}
function allDaysBetween(start, end) {
  const startDate = aDateToDate(start);
  const endDate = aDateToDate(end);
  const days = [];
  for (let date = startDate; date <= endDate; date = date.plus({ days: 1 })) {
    days.push(date.toISODate());
  }
  return days;
}

export {
  strToADate,
  aDateToDate,
  dateToAdate,
  compareADate,
  allDaysBetween
};
//# sourceMappingURL=/build/_shared/chunk-72ELS2LF.js.map
