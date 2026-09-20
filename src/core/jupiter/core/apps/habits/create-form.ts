/**
 * What the habit creation form posts, and the create args it makes.
 */
import type { HabitCreateArgs } from "@jupiter/webapi-client";
import {
  Difficulty,
  Eisen,
  HabitRepeatsStrategy,
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

export const HabitCreateFormSchema = z.object({
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
  skipRule: z.string().optional(),
  repeatsStrategy: z
    .nativeEnum(HabitRepeatsStrategy)
    .or(z.literal("none"))
    .optional(),
  repeatsInPeriodCount: z.string().optional(),
  timePlanActivityKind: z.nativeEnum(TimePlanActivityKind).optional(),
  timePlanActivityFeasability: z
    .nativeEnum(TimePlanActivityFeasability)
    .optional(),
  ...SchedulingParamsFormFields,
});

export type HabitCreateFormValues = z.infer<typeof HabitCreateFormSchema>;

function intOrUndefined(value: string | undefined): number | undefined {
  return value ? parseInt(value, 10) : undefined;
}

/** The args for creating the habit; with ``timePlanRefId`` also its activity. */
export function habitCreateArgs(
  form: HabitCreateFormValues,
  timePlanRefId?: string,
): HabitCreateArgs {
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
    repeats_strategy:
      form.repeatsStrategy !== undefined && form.repeatsStrategy !== "none"
        ? form.repeatsStrategy
        : undefined,
    repeats_in_period_count: intOrUndefined(form.repeatsInPeriodCount),
    stack_ref_id: form.stack || undefined,
    ...schedulingParamsCreateArgs(form),
  };
}
