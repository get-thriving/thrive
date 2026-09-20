/**
 * What the chore creation form posts, and the create args it makes.
 */
import type { ChoreCreateArgs } from "@jupiter/webapi-client";
import {
  Difficulty,
  Eisen,
  RecurringTaskPeriod,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { z } from "zod";

import {
  SchedulingParamsFormFields,
  schedulingParamsCreateArgs,
} from "#/core/common/scheduling-params-form";
import { CheckboxAsBoolean } from "#/core/infra/form-checkbox";

export const ChoreCreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  stack: z.string().optional(),
  period: z.nativeEnum(RecurringTaskPeriod),
  isKey: CheckboxAsBoolean,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableFromDay: z.string().optional(),
  actionableFromMonth: z.string().optional(),
  dueAtDay: z.string().optional(),
  dueAtMonth: z.string().optional(),
  mustDo: CheckboxAsBoolean,
  skipRule: z.string().optional(),
  startAtDate: z.string().optional(),
  endAtDate: z.string().optional(),
  timePlanActivityKind: z.nativeEnum(TimePlanActivityKind).optional(),
  timePlanActivityFeasability: z
    .nativeEnum(TimePlanActivityFeasability)
    .optional(),
  ...SchedulingParamsFormFields,
});

export type ChoreCreateFormValues = z.infer<typeof ChoreCreateFormSchema>;

function intOrUndefined(value: string | undefined): number | undefined {
  return value ? parseInt(value, 10) : undefined;
}

/** The args for creating the chore; with ``timePlanRefId`` also its activity. */
export function choreCreateArgs(
  form: ChoreCreateFormValues,
  timePlanRefId?: string,
): ChoreCreateArgs {
  return {
    name: form.name,
    time_plan_ref_id: timePlanRefId,
    time_plan_activity_kind: form.timePlanActivityKind,
    time_plan_activity_feasability: form.timePlanActivityFeasability,
    aspect_ref_id: form.aspect || undefined,
    chapter_ref_id: form.chapter || undefined,
    goal_ref_id: form.goal || undefined,
    period: form.period,
    is_key: form.isKey,
    eisen: form.eisen,
    difficulty: form.difficulty,
    actionable_from_day: intOrUndefined(form.actionableFromDay),
    actionable_from_month: intOrUndefined(form.actionableFromMonth),
    due_at_day: intOrUndefined(form.dueAtDay),
    due_at_month: intOrUndefined(form.dueAtMonth),
    skip_rule: form.skipRule || undefined,
    stack_ref_id: form.stack || undefined,
    must_do: form.mustDo,
    start_at_date: form.startAtDate || undefined,
    end_at_date: form.endAtDate || undefined,
    ...schedulingParamsCreateArgs(form),
  };
}
