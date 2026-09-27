import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Removes a time plan activity, and returns the ref ids of it and the
// activities removed with it, for the time plan view to drop.
const RemoveActivityFormSchema = z.object({
  refId: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, RemoveActivityFormSchema);

  try {
    const result = await apiClient.timePlans.timePlanActivityRemove({
      ref_id: form.refId,
    });

    return noErrorSomeData({
      removed_time_plan_activity_ref_ids:
        result.removed_time_plan_activity_ref_ids,
    });
  } catch (error) {
    return handleActionApiError(error);
  }
}
