import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import {
  TodoTaskCreateFormSchema,
  todoTaskCreateArgs,
} from "#/core/apps/todo/create-form";
import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Creates a todo task along with its activity in a time plan, from the plan's own
// creation form, and returns both for the view to merge in.
const CreateFormSchema = TodoTaskCreateFormSchema.extend({
  timePlanRefId: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.todo.todoTaskCreate(
      todoTaskCreateArgs(form, form.timePlanRefId),
    );

    return noErrorSomeData({
      new_todo_task: result.new_todo_task,
      new_inbox_task: result.new_inbox_task,
      new_time_plan_activity: result.new_time_plan_activity ?? null,
    });
  } catch (error) {
    return handleActionApiError(error);
  }
}
