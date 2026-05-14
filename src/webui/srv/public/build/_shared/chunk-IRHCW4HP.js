// ../core/jupiter/core/common/birthday.ts
var MONTH_NAME_INDEX = [
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
  "Dec"
];
function extractBirthday(birthday) {
  const parts = birthday.split(" ");
  const day = parseInt(parts[0]);
  const month = MONTH_NAME_INDEX.findIndex((t) => t === parts[1]) + 1;
  return { day, month };
}
function birthdayFromParts(day, month) {
  return `${day} ${MONTH_NAME_INDEX[month - 1]}`;
}
function compareBirthdaysNaturally(b1, b2) {
  const b1Parts = extractBirthday(b1);
  const b2Parts = extractBirthday(b2);
  return b1Parts.month - b2Parts.month || b1Parts.day - b2Parts.day;
}

export {
  extractBirthday,
  birthdayFromParts,
  compareBirthdaysNaturally
};
//# sourceMappingURL=/build/_shared/chunk-IRHCW4HP.js.map
