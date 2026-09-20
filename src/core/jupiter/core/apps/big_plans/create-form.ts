/**
 * What the big plan and big plan inbox task creation forms post, and the create
 * args they make.
 */
import type {
  BigPlanCreateArgs,
  BigPlanCreateInboxTaskArgs,
} from "@jupiter/webapi-client";
import {
  Difficulty,
  Eisen,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { z } from "zod";

import { fixSelectOutputEntityId, selectZod } from "#/core/common/select-form";
import {
  SchedulingParamsFormFields,
  schedulingParamsCreateArgs,
} from "#/core/common/scheduling-params-form";
import { CheckboxAsBoolean } from "#/core/infra/form-checkbox";

export const BigPlanCreateFormSchema = z.object({
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
  dependencyRefIds: selectZod(z.string()),
  timePlanActivityKind: z.nativeEnum(TimePlanActivityKind).optional(),
  timePlanActivityFeasability: z
    .nativeEnum(TimePlanActivityFeasability)
    .optional(),
  ...SchedulingParamsFormFields,
});

export type BigPlanCreateFormValues = z.infer<typeof BigPlanCreateFormSchema>;

/** The args for creating the big plan; with ``timePlanRefId`` also its activity. */
export function bigPlanCreateArgs(
  form: BigPlanCreateFormValues,
  timePlanRefId?: string,
): BigPlanCreateArgs {
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
    dependency_ref_ids: fixSelectOutputEntityId(form.dependencyRefIds) || [],
    ...schedulingParamsCreateArgs(form),
  };
}

export const BigPlanInboxTaskCreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  isKey: CheckboxAsBoolean,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableDate: z.string().optional(),
  dueDate: z.string().optional(),
  timePlanActivityKind: z.nativeEnum(TimePlanActivityKind).optional(),
  timePlanActivityFeasability: z
    .nativeEnum(TimePlanActivityFeasability)
    .optional(),
});

export type BigPlanInboxTaskCreateFormValues = z.infer<
  typeof BigPlanInboxTaskCreateFormSchema
>;

/**
 * The args for creating an inbox task for the big plan ``bigPlanRefId``; with
 * ``timePlanRefId`` also its activity.
 */
export function bigPlanInboxTaskCreateArgs(
  form: BigPlanInboxTaskCreateFormValues,
  bigPlanRefId: string,
  timePlanRefId?: string,
): BigPlanCreateInboxTaskArgs {
  return {
    big_plan_ref_id: bigPlanRefId,
    name: form.name,
    time_plan_ref_id: timePlanRefId,
    time_plan_activity_kind: form.timePlanActivityKind,
    time_plan_activity_feasability: form.timePlanActivityFeasability,
    is_key: form.isKey,
    eisen: form.eisen,
    difficulty: form.difficulty,
    actionable_date: form.actionableDate || undefined,
    due_date: form.dueDate || undefined,
  };
}
