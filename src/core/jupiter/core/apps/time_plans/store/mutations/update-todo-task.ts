/**
 * Saving a todo task edited from the time plan view.
 *
 * A todo's status, key flag, eisen, difficulty and dates live on its inbox
 * task, so an edit patches both.
 */
import type {
  ADate,
  InboxTask,
  TodoTask,
  TodoTaskUpdateResult,
} from "@jupiter/webapi-client";
import { Difficulty, Eisen, InboxTaskStatus } from "@jupiter/webapi-client";
import { z } from "zod";

import type { TimePlanMutation } from "#/core/apps/time_plans/store/mutation";
import type {
  LifePlanAssociation,
  SchedulingParamsEdit,
} from "#/core/apps/time_plans/store/mutations/form";
import {
  editorFormFields,
  lifePlanAssociationFromForm,
  lifePlanAssociationPatch,
  lifePlanAssociationToFormFields,
  schedulingParamsFromForm,
  schedulingParamsPatch,
  schedulingParamsToFormFields,
} from "#/core/apps/time_plans/store/mutations/form";
import type {
  InboxTaskDelayIntent,
  InboxTaskStatusIntent,
} from "#/core/common/sub/inbox_tasks/intents";
import {
  delayedInboxTaskDates,
  inboxTaskStatusForIntent,
  isInboxTaskDelayIntent,
} from "#/core/common/sub/inbox_tasks/intents";

export interface UpdateTodoTaskArgs {
  refId: string;
  inboxTaskRefId: string;
  name: string;
  status: InboxTaskStatus;
  // Left alone when null.
  lifePlan: LifePlanAssociation | null;
  isKey: boolean;
  eisen: Eisen;
  difficulty: Difficulty;
  actionableDate: ADate | null;
  dueDate: ADate | null;
  schedulingParams: SchedulingParamsEdit;
  // When the edit was made, standing in for the server's modification time
  // until the result arrives.
  modifiedTime: string;
}

const TodoTaskPropertiesFormSchema = z.object({
  refId: z.string(),
  name: z.string(),
  status: z.nativeEnum(InboxTaskStatus),
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
});

/**
 * The args for ``intent`` from a todo task properties editor's form.
 *
 * ``namePrefix`` is the editor's. Putting the todo off only moves its dates,
 * the same way as for any inbox task, so everything else comes from
 * ``current``, the todo and its inbox task as the view holds them.
 */
export function updateTodoTaskArgsFromForm(
  intent: InboxTaskStatusIntent | InboxTaskDelayIntent,
  formData: FormData,
  current: { todoTask: TodoTask; inboxTask: InboxTask },
  today: ADate,
  modifiedTime: string,
  namePrefix: string,
): UpdateTodoTaskArgs {
  const { todoTask, inboxTask } = current;

  if (isInboxTaskDelayIntent(intent)) {
    return {
      refId: todoTask.ref_id,
      inboxTaskRefId: inboxTask.ref_id,
      name: todoTask.name,
      status: inboxTask.status,
      lifePlan: null,
      isKey: inboxTask.is_key,
      eisen: inboxTask.eisen,
      difficulty: inboxTask.difficulty,
      ...delayedInboxTaskDates(
        intent,
        today,
        inboxTask.actionable_date,
        inboxTask.due_date,
      ),
      schedulingParams: {
        schedulability: todoTask.scheduling_params.schedulability,
        eventDurationMins:
          todoTask.scheduling_params.event_duration_mins ?? null,
        eventCount: todoTask.scheduling_params.event_count ?? null,
      },
      modifiedTime,
    };
  }

  const field = editorFormFields(formData, namePrefix);
  const form = TodoTaskPropertiesFormSchema.parse({
    refId: field("refId"),
    name: field("name"),
    status: field("status"),
    eisen: field("eisen"),
    difficulty: field("difficulty"),
  });

  return {
    refId: form.refId,
    inboxTaskRefId: inboxTask.ref_id,
    name: form.name,
    status: inboxTaskStatusForIntent(intent, form.status),
    lifePlan: lifePlanAssociationFromForm(field),
    isKey: field("isKey") === "on",
    eisen: form.eisen,
    difficulty: form.difficulty,
    actionableDate: field("actionableDate") || null,
    dueDate: field("dueDate") || null,
    schedulingParams: schedulingParamsFromForm(field),
    modifiedTime,
  };
}

export const UPDATE_TODO_TASK: TimePlanMutation<
  UpdateTodoTaskArgs,
  Pick<TodoTaskUpdateResult, "updated_todo_task" | "updated_inbox_task">
> = {
  action: "/app/workspace/apps/time-plans/mutations/update-todo-task",
  toFormFields: (args) => ({
    refId: args.refId,
    name: args.name,
    status: args.status,
    ...lifePlanAssociationToFormFields(args.lifePlan),
    ...(args.isKey ? { isKey: "on" } : {}),
    eisen: args.eisen,
    difficulty: args.difficulty,
    actionableDate: args.actionableDate ?? "",
    dueDate: args.dueDate ?? "",
    ...schedulingParamsToFormFields(args.schedulingParams),
  }),
  applyOptimistic: (entities, args) => {
    let updated = entities;

    const todoTask = entities.todoTasks[args.refId];
    if (todoTask !== undefined) {
      updated = {
        ...updated,
        todoTasks: {
          ...updated.todoTasks,
          [args.refId]: {
            ...todoTask,
            ...lifePlanAssociationPatch(args.lifePlan),
            name: args.name,
            scheduling_params: schedulingParamsPatch(args.schedulingParams),
            last_modified_time: args.modifiedTime,
          },
        },
      };
    }

    const inboxTask = entities.inboxTasks[args.inboxTaskRefId];
    if (inboxTask !== undefined) {
      updated = {
        ...updated,
        inboxTasks: {
          ...updated.inboxTasks,
          [args.inboxTaskRefId]: {
            ...inboxTask,
            name: args.name,
            status: args.status,
            is_key: args.isKey,
            eisen: args.eisen,
            difficulty: args.difficulty,
            actionable_date: args.actionableDate,
            due_date: args.dueDate,
            last_modified_time: args.modifiedTime,
          },
        },
      };
    }

    return updated;
  },
  toDelta: (result) => ({
    todoTasks: [result.updated_todo_task],
    inboxTasks: [result.updated_inbox_task],
  }),
};
