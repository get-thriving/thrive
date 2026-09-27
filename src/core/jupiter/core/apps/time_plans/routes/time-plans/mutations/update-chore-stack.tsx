import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Saves a chore stack as edited from the time plan view, and returns it along
// with the chores that moved in or out of it, for the view to merge in.
const UpdateChoreStackFormSchema = z.object({
  refId: z.string(),
  name: z.string(),
  // Comma-separated, like the chore multi-select sends them.
  choreRefIds: z.string().optional(),
  // Only sent when the workspace has a life plan.
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateChoreStackFormSchema);

  try {
    const result = await apiClient.chores.choreStackUpdate({
      ref_id: form.refId,
      name: { should_change: true, value: form.name },
      chore_ref_ids: {
        should_change: true,
        value: (form.choreRefIds ?? "")
          .split(",")
          .map((refId) => refId.trim())
          .filter((refId) => refId !== ""),
      },
      aspect_ref_id: form.aspect
        ? { should_change: true, value: form.aspect }
        : { should_change: false },
      chapter_ref_id: form.aspect
        ? { should_change: true, value: form.chapter || null }
        : { should_change: false },
      goal_ref_id: form.aspect
        ? { should_change: true, value: form.goal || null }
        : { should_change: false },
    });

    return noErrorSomeData({
      updated_chore_stack: result.updated_chore_stack,
      updated_chores: result.updated_chores,
    });
  } catch (error) {
    return handleActionApiError(error);
  }
}
