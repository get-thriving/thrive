import { BigPlanStatus, Difficulty, Eisen } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { CheckboxAsString, parseForm } from "zodix";
import { noErrorSomeData } from "@jupiter/core/infra/action-result";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  SchedulingParamsFormFields,
  schedulingParamsUpdateArgs,
} from "@jupiter/core/common/scheduling-params-form";

import { getLoggedInApiClient } from "~/api-clients.server";

// Saves a big plan as edited from the time plan view. The view works out the
// status an intent leads to, so this just stores it, and returns what changed
// for the view to merge in.
const UpdateBigPlanFormSchema = z.object({
  refId: z.string(),
  name: z.string(),
  status: z.nativeEnum(BigPlanStatus),
  // Only sent when the workspace has a life plan.
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  isKey: CheckboxAsString,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableDate: z.string().optional(),
  dueDate: z.string().optional(),
  // Comma-separated, like the big plan multi-select sends them.
  dependencyRefIds: z.string().optional(),
  ...SchedulingParamsFormFields,
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateBigPlanFormSchema);

  try {
    const result = await apiClient.bigPlans.bigPlanUpdate({
      ref_id: form.refId,
      name: { should_change: true, value: form.name },
      status: { should_change: true, value: form.status },
      aspect_ref_id: form.aspect
        ? { should_change: true, value: form.aspect }
        : { should_change: false },
      chapter_ref_id: form.aspect
        ? { should_change: true, value: form.chapter || null }
        : { should_change: false },
      goal_ref_id: form.aspect
        ? { should_change: true, value: form.goal || null }
        : { should_change: false },
      is_key: { should_change: true, value: form.isKey },
      eisen: { should_change: true, value: form.eisen },
      difficulty: { should_change: true, value: form.difficulty },
      actionable_date: {
        should_change: true,
        value: form.actionableDate || null,
      },
      due_date: { should_change: true, value: form.dueDate || null },
      dependency_ref_ids: {
        should_change: true,
        value: (form.dependencyRefIds ?? "")
          .split(",")
          .map((refId) => refId.trim())
          .filter((refId) => refId !== ""),
      },
      ...schedulingParamsUpdateArgs(form),
    });

    const data = noErrorSomeData({
      updated_big_plan: result.updated_big_plan,
      updated_inbox_tasks: result.updated_inbox_tasks,
    });

    if (result.record_score_result) {
      return json(data, {
        headers: {
          "Set-Cookie": await saveScoreAction(result.record_score_result),
        },
      });
    }

    return json(data);
  } catch (error) {
    return handleActionApiError(error);
  }
}
