import { ApiError } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm } from "zodix";
import {
  noErrorNoData,
  validationErrorToUIErrorInfo,
} from "@jupiter/core/infra/action-result";
import { timeEventInDayBlockParamsToUtc } from "@jupiter/core/common/sub/time_events/time-event";

import { getLoggedInApiClient } from "~/api-clients.server";

const UpdateTimeFormSchema = z.object({
  id: z.string(),
  startDate: z.string(),
  startTimeInDay: z.string(),
  durationMins: z.string().transform((v) => parseInt(v, 10)),
  userTimezone: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateTimeFormSchema);

  try {
    const { startDate, startTimeInDay } = timeEventInDayBlockParamsToUtc(
      {
        startDate: form.startDate,
        startTimeInDay: form.startTimeInDay,
      },
      form.userTimezone,
    );

    await apiClient.timeEvents.timeEventInDayBlockUpdate({
      ref_id: form.id,
      start_date: { should_change: true, value: startDate },
      start_time_in_day: { should_change: true, value: startTimeInDay ?? "" },
      duration_mins: { should_change: true, value: form.durationMins },
    });

    return json(noErrorNoData());
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}
