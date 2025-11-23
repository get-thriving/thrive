import { Difficulty, InboxTask } from "@jupiter/webapi-client";
import { z } from "zod";

export interface ScoreAction {
  latest_task_score: number;
  has_lucky_puppy_bonus: boolean | null;
  daily_total_score: number;
  weekly_total_score: number;
}

export const SCORE_ACTION_COOKIE_SCHEMA = z.object({
  latest_task_score: z.number(),
  has_lucky_puppy_bonus: z.boolean().nullable(),
  daily_total_score: z.number(),
  weekly_total_score: z.number(),
});

export function estimateScoreForInboxTask(inboxTask: InboxTask): number {
  switch (inboxTask.difficulty) {
    case Difficulty.EASY:
      return 1 + (inboxTask.is_key ? 1 : 0);
    case Difficulty.MEDIUM:
      return 2 + (inboxTask.is_key ? 1 : 0);
    case Difficulty.HARD:
      return 5 + (inboxTask.is_key ? 1 : 0);
  }
}
