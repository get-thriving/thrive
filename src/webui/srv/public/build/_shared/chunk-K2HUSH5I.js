import {
  compareBigPlanStatus
} from "/build/_shared/chunk-P7WFXMQY.js";
import {
  compareIsKey
} from "/build/_shared/chunk-DNXYZ7BB.js";
import {
  compareDifficulty,
  compareEisen
} from "/build/_shared/chunk-NLPUBZ3T.js";
import {
  compareADate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/big_plans/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function bigPlanFindEntryToParent(entry) {
  return {
    aspect: entry.aspect || void 0,
    chapter: entry.chapter || void 0,
    goal: entry.goal || void 0,
    tags: entry.tags || void 0,
    contacts: entry.contacts || void 0
  };
}
function sortBigPlansNaturally(bigPlans) {
  return [...bigPlans].sort((e1, e2) => {
    return compareADate(e1.actionable_date, e2.actionable_date) || compareIsKey(e1.is_key, e2.is_key) || compareADate(e1.due_date, e2.due_date) || -1 * compareEisen(e1.eisen, e2.eisen) || -1 * compareDifficulty(e1.difficulty, e2.difficulty) || compareBigPlanStatus(e1.status, e2.status);
  });
}
function bigPlanDonePct(bigPlan, bigPlanStats) {
  if (bigPlan.status === import_webapi_client.BigPlanStatus.NOT_STARTED) {
    return 0;
  }
  if (bigPlan.status === import_webapi_client.BigPlanStatus.DONE || bigPlan.status === import_webapi_client.BigPlanStatus.NOT_DONE) {
    return 100;
  }
  if (bigPlanStats.all_inbox_tasks_cnt === 0) {
    return 10;
  }
  const pct = Math.floor(
    bigPlanStats.completed_inbox_tasks_cnt / bigPlanStats.all_inbox_tasks_cnt * 100
  );
  if (pct < 10) {
    return 10;
  } else if (pct > 95) {
    return 95;
  }
  return pct;
}
function sortBigPlanMilestones(milestones) {
  return [...milestones].sort((m1, m2) => {
    return compareADate(m1.date, m2.date);
  });
}

export {
  bigPlanFindEntryToParent,
  sortBigPlansNaturally,
  bigPlanDonePct,
  sortBigPlanMilestones
};
//# sourceMappingURL=/build/_shared/chunk-K2HUSH5I.js.map
