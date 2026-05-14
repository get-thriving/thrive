import {
  DateTime
} from "/build/_shared/chunk-LT7567PB.js";

// ../core/jupiter/core/common/timestamp.ts
function timestampToDate(timestamp) {
  const datetime = DateTime.fromISO(timestamp);
  return DateTime.fromObject({
    year: datetime.year,
    month: datetime.month,
    day: datetime.day
  });
}

export {
  timestampToDate
};
//# sourceMappingURL=/build/_shared/chunk-X6MG2JXZ.js.map
