import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/gamification/scores.ts
var import_webapi_client = __toESM(require_dist(), 1);
var SCORE_ACTION_COOKIE_SCHEMA = external_exports.object({
  latest_task_score: external_exports.number(),
  has_lucky_puppy_bonus: external_exports.boolean().nullable(),
  daily_total_score: external_exports.number(),
  weekly_total_score: external_exports.number()
});
function estimateScoreForInboxTask(inboxTask) {
  switch (inboxTask.difficulty) {
    case import_webapi_client.Difficulty.EASY:
      return 1 + (inboxTask.is_key ? 1 : 0);
    case import_webapi_client.Difficulty.MEDIUM:
      return 2 + (inboxTask.is_key ? 1 : 0);
    case import_webapi_client.Difficulty.HARD:
      return 5 + (inboxTask.is_key ? 1 : 0);
  }
}

export {
  SCORE_ACTION_COOKIE_SCHEMA,
  estimateScoreForInboxTask
};
//# sourceMappingURL=/build/_shared/chunk-BXLFAMEM.js.map
