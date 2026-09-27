import {
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Changes what a time plan activity asks for, and how much it's needed,
// returning the updated activity for the time plan view to merge in.
const UpdateActivityFormSchema = z.object({
  refId: z.string(),
  kind: z.nativeEnum(TimePlanActivityKind),
  feasability: z.nativeEnum(TimePlanActivityFeasability),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateActivityFormSchema);

  try {
    const result = await apiClient.timePlans.timePlanActivityUpdate({
      ref_id: form.refId,
      kind: {
        should_change: true,
        value: form.kind,
      },
      feasability: {
        should_change: true,
        value: form.feasability,
      },
    });

    return noErrorSomeData({
      updated_time_plan_activity: result.updated_time_plan_activity,
    });
  } catch (error) {
    return handleActionApiError(error);
  }
}
