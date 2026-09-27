import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Archives an activity's time event from the time plan view, and returns it
// for the view to merge in.
const ArchiveTimeEventFormSchema = z.object({
  timeEventRefId: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, ArchiveTimeEventFormSchema);

  try {
    const result = await apiClient.timeEvents.timeEventInDayBlockArchive({
      ref_id: form.timeEventRefId,
    });

    return noErrorSomeData({
      archived_time_event_in_day_block: result.archived_time_event_in_day_block,
    });
  } catch (error) {
    return handleActionApiError(error);
  }
}
