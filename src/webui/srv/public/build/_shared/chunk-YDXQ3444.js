import {
  compareADate
} from "/build/_shared/chunk-72ELS2LF.js";

// ../core/jupiter/core/life_plan/sub/milestones/root.ts
function sortMilestonesNaturally(milestones) {
  return [...milestones].sort((m1, m2) => {
    return compareADate(m1.date, m2.date);
  });
}

export {
  sortMilestonesNaturally
};
//# sourceMappingURL=/build/_shared/chunk-YDXQ3444.js.map
