import { Difficulty, Eisen, InboxTaskStatus } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { CheckboxAsString, parseForm } from "zodix";
import { noErrorSomeData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  SchedulingParamsFormFields,
  schedulingParamsUpdateArgs,
} from "@jupiter/core/common/scheduling-params-form";

import { getLoggedInApiClient } from "~/api-clients.server";

// Saves a todo task as edited from the time plan view. The view works out the
// status and dates an intent leads to, so this just stores them, and returns
// what changed for the view to merge in.
const UpdateTodoTaskFormSchema = z.object({
  refId: z.string(),
  name: z.string(),
  status: z.nativeEnum(InboxTaskStatus),
  // Only sent when the workspace has a life plan.
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  isKey: CheckboxAsString,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableDate: z.string().optional(),
  dueDate: z.string().optional(),
  ...SchedulingParamsFormFields,
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateTodoTaskFormSchema);

  try {
    const result = await apiClient.todo.todoTaskUpdate({
      ref_id: form.refId,
      name: { should_change: true, value: form.name },
      status: { should_change: true, value: form.status },
      aspect_ref_id: form.aspect
        ? { should_change: true, value: form.aspect }
        : { should_change: false },
      chapter_ref_id: form.aspect
        ? { should_change: true, value: form.chapter || null }
        : { should_change: false },
      goal_ref_id: form.aspect
        ? { should_change: true, value: form.goal || null }
        : { should_change: false },
      is_key: { should_change: true, value: form.isKey },
      eisen: { should_change: true, value: form.eisen },
      difficulty: { should_change: true, value: form.difficulty },
      actionable_date: {
        should_change: true,
        value: form.actionableDate || null,
      },
      due_date: { should_change: true, value: form.dueDate || null },
      ...schedulingParamsUpdateArgs(form),
    });

    return json(
      noErrorSomeData({
        updated_todo_task: result.updated_todo_task,
        updated_inbox_task: result.updated_inbox_task,
      }),
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}
