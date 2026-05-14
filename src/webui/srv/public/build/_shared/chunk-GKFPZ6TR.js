import {
  DateTime
} from "/build/_shared/chunk-LT7567PB.js";

// ../core/jupiter/core/infra/actionable-time.ts
function actionableTimeToDateTime(actionableTime, timezone) {
  switch (actionableTime) {
    case "now" /* NOW */:
      return DateTime.local({ zone: timezone });
    case "one-week" /* ONE_WEEK */:
      return DateTime.local({ zone: timezone }).plus({ weeks: 1 });
    case "one-month" /* ONE_MONTH */:
      return DateTime.local({ zone: timezone }).plus({ months: 1 });
  }
}

export {
  actionableTimeToDateTime
};
//# sourceMappingURL=/build/_shared/chunk-GKFPZ6TR.js.map
