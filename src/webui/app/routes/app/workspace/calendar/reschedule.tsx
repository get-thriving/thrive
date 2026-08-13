import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { timeEventInDayBlockParamsToUtc } from "@jupiter/core/common/sub/time_events/time-event";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

// Moves an event to another moment in time, keeping how long it lasts. This is
// what dropping an event elsewhere in the calendar ends up calling.
const RescheduleFormSchema = z.object({
  kind: z.enum(["schedule-event-in-day", "time-event-in-day-block"]),
  refId: z.string(),
  startDate: z.string(),
  startTimeInDay: z.string(),
  userTimezone: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, RescheduleFormSchema);

  const { startDate, startTimeInDay } = timeEventInDayBlockParamsToUtc(
    { startDate: form.startDate, startTimeInDay: form.startTimeInDay },
    form.userTimezone,
  );

  try {
    switch (form.kind) {
      case "schedule-event-in-day": {
        await apiClient.schedule.scheduleEventInDayUpdate({
          ref_id: form.refId,
          name: {
            should_change: false,
          },
          start_date: {
            should_change: true,
            value: startDate,
          },
          start_time_in_day: {
            should_change: true,
            value: startTimeInDay ?? "",
          },
          duration_mins: {
            should_change: false,
          },
        });
        break;
      }

      case "time-event-in-day-block": {
        await apiClient.timeEvents.timeEventInDayBlockUpdate({
          ref_id: form.refId,
          start_date: {
            should_change: true,
            value: startDate,
          },
          start_time_in_day: {
            should_change: true,
            value: startTimeInDay ?? "",
          },
          duration_mins: {
            should_change: false,
          },
        });
        break;
      }

      default:
        throw new Response("Bad Kind", { status: 500 });
    }

    return json(noErrorNoData());
  } catch (error) {
    return handleActionApiError(error);
  }
}
