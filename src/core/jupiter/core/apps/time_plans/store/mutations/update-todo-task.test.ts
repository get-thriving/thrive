import type { InboxTask, TodoTask } from "@jupiter/webapi-client";
import {
  Difficulty,
  Eisen,
  InboxTaskStatus,
  Schedulability,
} from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  UPDATE_TODO_TASK,
  updateTodoTaskArgsFromForm,
} from "#/core/apps/time_plans/store/mutations/update-todo-task";
import {
  createTimePlanStore,
  seedTimePlanSource,
  selectTimePlanEntities,
} from "#/core/apps/time_plans/store/store";
import {
  DEFAULT_SCHEDULING_EVENT_COUNT,
  DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
} from "#/core/common/scheduling-params";

const MODIFIED = "2026-09-14T10:00:00Z";

function todoTask(fields: Partial<TodoTask> = {}): TodoTask {
  return {
    ref_id: "700",
    version: 1,
    archived: false,
    name: "Stored name",
    aspect_ref_id: "1",
    chapter_ref_id: "2",
    goal_ref_id: null,
    scheduling_params: {
      schedulability: Schedulability.SCHEDULABLE,
      event_duration_mins: null,
      event_count: null,
    },
    last_modified_time: "2026-09-01T00:00:00Z",
    ...fields,
  } as TodoTask;
}

function inboxTask(fields: Partial<InboxTask> = {}): InboxTask {
  return {
    ref_id: "100",
    version: 1,
    archived: false,
    name: "Stored name",
    owner: "TodoTask:std:700",
    status: InboxTaskStatus.NOT_STARTED,
    is_key: false,
    eisen: Eisen.REGULAR,
    difficulty: Difficulty.EASY,
    actionable_date: null,
    due_date: "2026-09-04",
    last_modified_time: "2026-09-01T00:00:00Z",
    ...fields,
  } as InboxTask;
}

function editorForm(fields: Record<string, string>): FormData {
  const formData = new FormData();
  const values = {
    RefId: "700",
    Name: "Edited name",
    Status: InboxTaskStatus.NOT_STARTED,
    Eisen: Eisen.IMPORTANT,
    Difficulty: Difficulty.HARD,
    ActionableDate: "2026-09-10",
    DueDate: "",
    ...fields,
  };
  for (const [name, value] of Object.entries(values)) {
    formData.set(`targetTodoTask${name}`, value);
  }
  return formData;
}

const CURRENT = { todoTask: todoTask(), inboxTask: inboxTask() };

describe("updateTodoTaskArgsFromForm", () => {
  it("takes the edited fields and the status the intent leads to", () => {
    const args = updateTodoTaskArgsFromForm(
      "start",
      editorForm({ IsKey: "on", Aspect: "3", Chapter: "", Goal: "5" }),
      CURRENT,
      "2026-09-14",
      MODIFIED,
      "targetTodoTask",
    );

    expect(args).toEqual({
      refId: "700",
      inboxTaskRefId: "100",
      name: "Edited name",
      status: InboxTaskStatus.IN_PROGRESS,
      lifePlan: { aspectRefId: "3", chapterRefId: null, goalRefId: "5" },
      isKey: true,
      eisen: Eisen.IMPORTANT,
      difficulty: Difficulty.HARD,
      schedulingParams: {
        schedulability: Schedulability.SCHEDULABLE,
        eventDurationMins: DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
        eventCount: DEFAULT_SCHEDULING_EVENT_COUNT,
      },
      actionableDate: "2026-09-10",
      dueDate: null,
      modifiedTime: MODIFIED,
    });
  });

  it("leaves the life plan alone when the form has none", () => {
    const args = updateTodoTaskArgsFromForm(
      "update",
      editorForm({}),
      CURRENT,
      "2026-09-14",
      MODIFIED,
      "targetTodoTask",
    );

    expect(args.lifePlan).toBeNull();
  });

  it("puts the todo off like any inbox task", () => {
    const args = updateTodoTaskArgsFromForm(
      "delay-1-day",
      editorForm({}),
      CURRENT,
      "2026-09-14",
      MODIFIED,
      "targetTodoTask",
    );

    expect(args).toMatchObject({
      name: "Stored name",
      eisen: Eisen.REGULAR,
      lifePlan: null,
      actionableDate: "2026-09-15",
      dueDate: "2026-09-15",
    });
  });
});

describe("UPDATE_TODO_TASK", () => {
  const args = {
    refId: "700",
    inboxTaskRefId: "100",
    name: "Edited name",
    status: InboxTaskStatus.DONE,
    lifePlan: null,
    isKey: true,
    eisen: Eisen.IMPORTANT,
    difficulty: Difficulty.HARD,
    actionableDate: null,
    dueDate: "2026-09-20",
    schedulingParams: {
      schedulability: Schedulability.SCHEDULABLE,
      eventDurationMins: DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
      eventCount: DEFAULT_SCHEDULING_EVENT_COUNT,
    },
    modifiedTime: MODIFIED,
  };

  it("patches the todo and its inbox task", () => {
    const entities = UPDATE_TODO_TASK.applyOptimistic(
      selectTimePlanEntities(
        seedTimePlanSource(createTimePlanStore(), "plan", {
          todoTasks: [todoTask()],
          inboxTasks: [inboxTask()],
        }),
      ),
      args,
    );

    expect(entities.todoTasks["700"]).toMatchObject({
      name: "Edited name",
      chapter_ref_id: "2",
    });
    expect(entities.inboxTasks["100"]).toMatchObject({
      name: "Edited name",
      status: InboxTaskStatus.DONE,
      is_key: true,
      due_date: "2026-09-20",
      last_modified_time: MODIFIED,
    });
  });

  it("only sends life plan fields when there are some", () => {
    expect(UPDATE_TODO_TASK.toFormFields(args)).not.toHaveProperty("aspect");
    expect(
      UPDATE_TODO_TASK.toFormFields({
        ...args,
        lifePlan: { aspectRefId: "3", chapterRefId: null, goalRefId: null },
      }),
    ).toMatchObject({ aspect: "3", chapter: "", goal: "" });
  });

  it("merges back the todo and its inbox task", () => {
    const updatedTodo = todoTask({ version: 2 });
    const updatedInboxTask = inboxTask({ version: 2 });

    expect(
      UPDATE_TODO_TASK.toDelta({
        updated_todo_task: updatedTodo,
        updated_inbox_task: updatedInboxTask,
      }),
    ).toEqual({ todoTasks: [updatedTodo], inboxTasks: [updatedInboxTask] });
  });
});
