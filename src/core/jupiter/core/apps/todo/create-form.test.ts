import {
  Difficulty,
  Eisen,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  TodoTaskCreateFormSchema,
  todoTaskCreateArgs,
} from "#/core/apps/todo/create-form";
import {
  DEFAULT_SCHEDULING_EVENT_COUNT,
  DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
} from "#/core/common/scheduling-params";

describe("todoTaskCreateArgs", () => {
  it("makes the todo from what the form posts", () => {
    const form = TodoTaskCreateFormSchema.parse({
      name: "The todo",
      aspect: "1",
      chapter: "",
      isKey: "on",
      eisen: Eisen.IMPORTANT,
      difficulty: Difficulty.HARD,
      actionableDate: "",
      dueDate: "2026-09-20",
    });

    expect(todoTaskCreateArgs(form)).toEqual({
      name: "The todo",
      time_plan_ref_id: undefined,
      time_plan_activity_kind: undefined,
      time_plan_activity_feasability: undefined,
      aspect_ref_id: "1",
      chapter_ref_id: undefined,
      goal_ref_id: undefined,
      is_key: true,
      eisen: Eisen.IMPORTANT,
      difficulty: Difficulty.HARD,
      actionable_date: undefined,
      due_date: "2026-09-20",
      schedulability: undefined,
      scheduling_event_duration_mins: DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
      scheduling_event_count: DEFAULT_SCHEDULING_EVENT_COUNT,
    });
  });

  it("puts it in a time plan when given one", () => {
    const form = TodoTaskCreateFormSchema.parse({
      name: "The todo",
      eisen: Eisen.REGULAR,
      difficulty: Difficulty.EASY,
      timePlanActivityKind: TimePlanActivityKind.MAKE_PROGRESS,
    });

    expect(todoTaskCreateArgs(form, "9")).toMatchObject({
      time_plan_ref_id: "9",
      time_plan_activity_kind: TimePlanActivityKind.MAKE_PROGRESS,
      is_key: false,
    });
  });
});
