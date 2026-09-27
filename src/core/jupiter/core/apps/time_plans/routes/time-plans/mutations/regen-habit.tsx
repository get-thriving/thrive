import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { noErrorNoData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Regenerates a habit's inbox tasks. It returns nothing to merge: the time plan
// view reloads afterwards, since regen can touch any of the habit's tasks.
const RegenHabitFormSchema = z.object({
  refId: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, RegenHabitFormSchema);

  try {
    await apiClient.habits.habitRegen({
      ref_id: form.refId,
    });

    return noErrorNoData();
  } catch (error) {
    return handleActionApiError(error);
  }
}
