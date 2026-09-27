import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import {
  parseTimeEventBufferMins,
  timeEventInDayBlockParamsToUtc,
} from "#/core/common/sub/time_events/time-event";
import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Saves an activity's time event as edited from the time plan view, and returns
// it for the view to merge in.
const UpdateTimeEventFormSchema = z.object({
  timeEventRefId: z.string(),
  userTimezone: z.string(),
  startDate: z.string(),
  startTimeInDay: z.string().optional(),
  durationMins: z.string().transform((v) => parseInt(v, 10)),
  bufferBeforeMins: z.string().optional(),
  bufferAfterMins: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateTimeEventFormSchema);
  const { startDate, startTimeInDay } = timeEventInDayBlockParamsToUtc(
    form,
    form.userTimezone,
  );

  try {
    const result = await apiClient.timeEvents.timeEventInDayBlockUpdate({
      ref_id: form.timeEventRefId,
      start_date: { should_change: true, value: startDate },
      start_time_in_day: { should_change: true, value: startTimeInDay ?? "" },
      duration_mins: { should_change: true, value: form.durationMins },
      buffer_before_mins: {
        should_change: true,
        value: parseTimeEventBufferMins(form.bufferBeforeMins),
      },
      buffer_after_mins: {
        should_change: true,
        value: parseTimeEventBufferMins(form.bufferAfterMins),
      },
    });

    return noErrorSomeData({
      updated_time_event_in_day_block: result.updated_time_event_in_day_block,
    });
  } catch (error) {
    return handleActionApiError(error);
  }
}
