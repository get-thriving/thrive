import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { timeEventInDayBlockParamsToUtc } from "@jupiter/core/common/sub/time_events/time-event";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

// Creates a time event for a time plan activity at the moment it was dropped
// on the calendar.
const PlaceFormSchema = z.object({
  timePlanActivityRefId: z.string(),
  startDate: z.string(),
  startTimeInDay: z.string(),
  durationMins: z.string().transform((v) => parseInt(v, 10)),
  userTimezone: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, PlaceFormSchema);

  const { startDate, startTimeInDay } = timeEventInDayBlockParamsToUtc(
    { startDate: form.startDate, startTimeInDay: form.startTimeInDay },
    form.userTimezone,
  );

  try {
    await apiClient.timeEvents.timeEventInDayBlockCreateForTimePlanActivity({
      time_plan_activity_ref_id: form.timePlanActivityRefId,
      start_date: startDate,
      start_time_in_day: startTimeInDay ?? "",
      duration_mins: form.durationMins,
    });

    return json(noErrorNoData());
  } catch (error) {
    return handleActionApiError(error);
  }
}
