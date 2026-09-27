import { BigPlanStatus } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { noErrorNoData } from "#/core/infra/action-result";
import { saveScoreAction } from "#/core/gamification/scores.server";
import { handleActionApiError } from "#/core/infra/errors.server";
import { noSchedulingParamsUpdateArgs } from "#/core/common/scheduling-params-form";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const UpdateStatusFormSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(BigPlanStatus),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateStatusFormSchema);

  try {
    const result = await apiClient.bigPlans.bigPlanUpdate({
      ref_id: form.id,
      name: { should_change: false },
      status: { should_change: true, value: form.status },
      aspect_ref_id: { should_change: false },
      chapter_ref_id: { should_change: false },
      goal_ref_id: { should_change: false },
      is_key: { should_change: false },
      eisen: { should_change: false },
      difficulty: { should_change: false },
      actionable_date: { should_change: false },
      due_date: { should_change: false },
      dependency_ref_ids: { should_change: false },
      ...noSchedulingParamsUpdateArgs(),
    });

    if (result.record_score_result) {
      return data(noErrorNoData(), {
        headers: {
          "Set-Cookie": await saveScoreAction(result.record_score_result),
        },
      });
    }

    return noErrorNoData();
  } catch (error) {
    return handleActionApiError(error);
  }
}
