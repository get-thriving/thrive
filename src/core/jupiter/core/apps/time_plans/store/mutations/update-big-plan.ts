/**
 * Saving a big plan edited from the time plan view.
 */
import type {
  ADate,
  BigPlan,
  BigPlanUpdateResult,
} from "@jupiter/webapi-client";
import { BigPlanStatus, Difficulty, Eisen } from "@jupiter/webapi-client";
import { z } from "zod";

import type { BigPlanStatusIntent } from "#/core/apps/big_plans/intents";
import { bigPlanStatusForIntent } from "#/core/apps/big_plans/intents";
import type { TimePlanMutation } from "#/core/apps/time_plans/store/mutation";
import type {
  LifePlanAssociation,
  SchedulingParamsEdit,
} from "#/core/apps/time_plans/store/mutations/form";
import {
  editorFormFields,
  lifePlanAssociationFromForm,
  lifePlanAssociationPatch,
  lifePlanAssociationToFormFields,
  schedulingParamsFromForm,
  schedulingParamsPatch,
  schedulingParamsToFormFields,
} from "#/core/apps/time_plans/store/mutations/form";

export interface UpdateBigPlanArgs {
  refId: string;
  name: string;
  status: BigPlanStatus;
  // Left alone when null.
  lifePlan: LifePlanAssociation | null;
  isKey: boolean;
  eisen: Eisen;
  difficulty: Difficulty;
  actionableDate: ADate | null;
  dueDate: ADate | null;
  dependencyRefIds: string[];
  schedulingParams: SchedulingParamsEdit;
  // When the edit was made, standing in for the server's modification time
  // until the result arrives.
  modifiedTime: string;
}

const BigPlanPropertiesFormSchema = z.object({
  refId: z.string(),
  name: z.string(),
  status: z.nativeEnum(BigPlanStatus),
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
});

/** The args for ``intent`` from a big plan properties editor's form. */
export function updateBigPlanArgsFromForm(
  intent: BigPlanStatusIntent,
  formData: FormData,
  modifiedTime: string,
  namePrefix: string,
): UpdateBigPlanArgs {
  const field = editorFormFields(formData, namePrefix);
  const form = BigPlanPropertiesFormSchema.parse({
    refId: field("refId"),
    name: field("name"),
    status: field("status"),
    eisen: field("eisen"),
    difficulty: field("difficulty"),
  });

  return {
    refId: form.refId,
    name: form.name,
    status: bigPlanStatusForIntent(intent, form.status),
    lifePlan: lifePlanAssociationFromForm(field),
    isKey: field("isKey") === "on",
    eisen: form.eisen,
    difficulty: form.difficulty,
    actionableDate: field("actionableDate") || null,
    dueDate: field("dueDate") || null,
    dependencyRefIds: (field("dependencyRefIds") ?? "")
      .split(",")
      .map((refId) => refId.trim())
      .filter((refId) => refId !== ""),
    schedulingParams: schedulingParamsFromForm(field),
    modifiedTime,
  };
}

export const UPDATE_BIG_PLAN: TimePlanMutation<
  UpdateBigPlanArgs,
  Pick<BigPlanUpdateResult, "updated_big_plan" | "updated_inbox_tasks">
> = {
  action: "/app/workspace/apps/time-plans/mutations/update-big-plan",
  toFormFields: (args) => ({
    refId: args.refId,
    name: args.name,
    status: args.status,
    ...lifePlanAssociationToFormFields(args.lifePlan),
    ...(args.isKey ? { isKey: "on" } : {}),
    eisen: args.eisen,
    difficulty: args.difficulty,
    actionableDate: args.actionableDate ?? "",
    dueDate: args.dueDate ?? "",
    dependencyRefIds: args.dependencyRefIds.join(","),
    ...schedulingParamsToFormFields(args.schedulingParams),
  }),
  applyOptimistic: (entities, args) => {
    const bigPlan = entities.bigPlans[args.refId];
    if (bigPlan === undefined) {
      return entities;
    }
    const updated: BigPlan = {
      ...bigPlan,
      ...lifePlanAssociationPatch(args.lifePlan),
      name: args.name,
      status: args.status,
      is_key: args.isKey,
      eisen: args.eisen,
      difficulty: args.difficulty,
      actionable_date: args.actionableDate,
      due_date: args.dueDate,
      dependency_ref_ids: args.dependencyRefIds,
      scheduling_params: schedulingParamsPatch(args.schedulingParams),
      last_modified_time: args.modifiedTime,
    };
    return {
      ...entities,
      bigPlans: { ...entities.bigPlans, [args.refId]: updated },
    };
  },
  toDelta: (result) => ({
    bigPlans: [result.updated_big_plan],
    inboxTasks: result.updated_inbox_tasks,
  }),
};
