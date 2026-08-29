import { ProjectStatus } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const UpdateStatusFormSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(ProjectStatus),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateStatusFormSchema);

  try {
    const result = await apiClient.projects.projectUpdate({
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
    });

    if (result.record_score_result) {
      return json(noErrorNoData(), {
        headers: {
          "Set-Cookie": await saveScoreAction(result.record_score_result),
        },
      });
    }

    return json(noErrorNoData());
  } catch (error) {
    return handleActionApiError(error);
  }
}
