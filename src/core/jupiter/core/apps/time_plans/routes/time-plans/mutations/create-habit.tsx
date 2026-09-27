import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import {
  HabitCreateFormSchema,
  habitCreateArgs,
} from "#/core/apps/habits/create-form";
import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Creates a habit along with its activity in a time plan, from the plan's own
// creation form, and returns both for the view to merge in.
const CreateFormSchema = HabitCreateFormSchema.extend({
  timePlanRefId: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.habits.habitCreate(
      habitCreateArgs(form, form.timePlanRefId),
    );

    return noErrorSomeData({
      new_habit: result.new_habit,
      new_time_plan_activity: result.new_time_plan_activity ?? null,
    });
  } catch (error) {
    return handleActionApiError(error);
  }
}
