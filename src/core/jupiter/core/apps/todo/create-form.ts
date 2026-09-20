/**
 * What the todo task creation form posts, and the create args it makes.
 */
import type { TodoTaskCreateArgs } from "@jupiter/webapi-client";
import {
  Difficulty,
  Eisen,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { z } from "zod";

import {
  SchedulingParamsFormFields,
  schedulingParamsCreateArgs,
} from "#/core/common/scheduling-params-form";
import { CheckboxAsBoolean } from "#/core/infra/form-checkbox";

export const TodoTaskCreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  isKey: CheckboxAsBoolean,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableDate: z.string().optional(),
  dueDate: z.string().optional(),
  timePlanActivityKind: z.nativeEnum(TimePlanActivityKind).optional(),
  timePlanActivityFeasability: z
    .nativeEnum(TimePlanActivityFeasability)
    .optional(),
  ...SchedulingParamsFormFields,
});

export type TodoTaskCreateFormValues = z.infer<typeof TodoTaskCreateFormSchema>;

/** The args for creating the todo; with ``timePlanRefId`` also its activity. */
export function todoTaskCreateArgs(
  form: TodoTaskCreateFormValues,
  timePlanRefId?: string,
): TodoTaskCreateArgs {
  return {
    name: form.name,
    time_plan_ref_id: timePlanRefId,
    time_plan_activity_kind: form.timePlanActivityKind,
    time_plan_activity_feasability: form.timePlanActivityFeasability,
    aspect_ref_id: form.aspect || undefined,
    chapter_ref_id: form.chapter || undefined,
    goal_ref_id: form.goal || undefined,
    is_key: form.isKey,
    eisen: form.eisen,
    difficulty: form.difficulty,
    actionable_date: form.actionableDate || undefined,
    due_date: form.dueDate || undefined,
    ...schedulingParamsCreateArgs(form),
  };
}
