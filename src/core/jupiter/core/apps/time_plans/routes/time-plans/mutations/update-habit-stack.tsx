import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Saves a habit stack as edited from the time plan view, and returns it along
// with the habits that moved in or out of it, for the view to merge in.
const UpdateHabitStackFormSchema = z.object({
  refId: z.string(),
  name: z.string(),
  // Comma-separated, like the habit multi-select sends them.
  habitRefIds: z.string().optional(),
  // Only sent when the workspace has a life plan.
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateHabitStackFormSchema);

  try {
    const result = await apiClient.habits.habitStackUpdate({
      ref_id: form.refId,
      name: { should_change: true, value: form.name },
      habit_ref_ids: {
        should_change: true,
        value: (form.habitRefIds ?? "")
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
      updated_habit_stack: result.updated_habit_stack,
      updated_habits: result.updated_habits,
    });
  } catch (error) {
    return handleActionApiError(error);
  }
}
