import { Eisen, InboxTaskStatus } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorSomeData } from "@jupiter/core/infra/action-result";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

const UpdateStatusAndEisenFormSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(InboxTaskStatus),
  eisen: z.nativeEnum(Eisen).or(z.literal("no-go")).optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateStatusAndEisenFormSchema);

  try {
    const result = await apiClient.inboxTasks.inboxTaskUpdate({
      ref_id: form.id,
      name: { should_change: false },
      status: { should_change: true, value: form.status },
      is_key: { should_change: false },
      eisen:
        form.eisen !== "no-go" && form.eisen !== undefined
          ? { should_change: true, value: form.eisen }
          : { should_change: false },
      difficulty: { should_change: false },
      actionable_date: { should_change: false },
      due_date: { should_change: false },
    });

    // Views that keep their own copy of the entities merge these back in.
    const payload = noErrorSomeData({
      updated_inbox_task: result.updated_inbox_task,
      updated_big_plan_stats: result.updated_big_plan_stats ?? null,
    });

    if (result.record_score_result) {
      return data(payload, {
        headers: {
          "Set-Cookie": await saveScoreAction(result.record_score_result),
        },
      });
    }

    return payload;
  } catch (error) {
    return handleActionApiError(error);
  }
}
