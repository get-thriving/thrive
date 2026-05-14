import type {
  ChapterSummary,
  GoalSummary,
  InboxTask,
  LifePlan,
  MilestoneSummary,
  AspectSummary,
  Contact,
  Tag,
} from "@jupiter/webapi-client";
import { DateTime } from "luxon";
import {
  ApiError,
  BigPlanStatus,
  Difficulty,
  Eisen,
  InboxTaskStatus,
  NamedEntityTag,
} from "@jupiter/webapi-client";
import {
  BIG_PLAN,
  CHORE,
  HABIT,
  entityLinkRefIdFromWire,
} from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityInboxTaskTarget,
} from "@jupiter/core/time_plans/sub/activity/target-wire";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useFetcher,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import {
  isTimeEventInDayBlockEditable,
  timeEventInDayBlockOwnerTheType,
  timeEventInDayBlockParamsToTimezone,
  timeEventInDayBlockParamsToUtc,
} from "@jupiter/core/common/sub/time_events/time-event";
import { BigPlanPropertiesEditor } from "@jupiter/core/big_plans/component/properties-editor";
import { InboxTaskPropertiesEditor } from "@jupiter/core/common/sub/inbox_tasks/component/properties-editor";
import {
  isInboxTaskCoreFieldEditable,
  sortInboxTasksNaturally,
} from "#/core/common/sub/inbox_tasks/root";
import { InboxTaskStack } from "@jupiter/core/common/sub/inbox_tasks/component/stack";
import { TodoTaskPropertiesEditor } from "@jupiter/core/todo/components/properties-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionMultipleSpread,
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimeEventParamsSource } from "@jupiter/core/common/sub/time_events/component/params-source";
import { TimeEventSourceLink } from "@jupiter/core/common/sub/time_events/component/source-link";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormBigPlanSchema = {
  bigPlanRefId: z.string(),
  bigPlanName: z.string(),
  bigPlanStatus: z.nativeEnum(BigPlanStatus),
  bigPlanAspect: z.string().optional(),
  bigPlanChapter: z.string().optional(),
  bigPlanGoal: z.string().optional(),
  bigPlanIsKey: CheckboxAsString,
  bigPlanEisen: z.nativeEnum(Eisen),
  bigPlanDifficulty: z.nativeEnum(Difficulty),
  bigPlanActionableDate: z.string().optional(),
  bigPlanDueDate: z.string().optional(),
};

const UpdateFormTodoTaskSchema = {
  todoTaskRefId: z.string(),
  todoTaskName: z.string(),
  todoTaskStatus: z.nativeEnum(InboxTaskStatus),
  todoTaskAspect: z.string().optional(),
  todoTaskChapter: z.string().optional(),
  todoTaskGoal: z.string().optional(),
  todoTaskIsKey: CheckboxAsString,
  todoTaskEisen: z.nativeEnum(Eisen),
  todoTaskDifficulty: z.nativeEnum(Difficulty),
  todoTaskActionableDate: z.string().optional(),
  todoTaskDueDate: z.string().optional(),
};

const UpdateFormInboxTaskSchema = {
  inboxTaskRefId: z.string(),
  inboxTaskNamespace: z.string(),
  inboxTaskName: z.string(),
  inboxTaskStatus: z.nativeEnum(InboxTaskStatus),
  inboxTaskIsKey: CheckboxAsString,
  inboxTaskEisen: z.nativeEnum(Eisen),
  inboxTaskDifficulty: z.nativeEnum(Difficulty),
  inboxTaskActionableDate: z.string().optional(),
  inboxTaskDueDate: z.string().optional(),
};

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    userTimezone: z.string(),
    startDate: z.string(),
    startTimeInDay: z.string().optional(),
    durationMins: z.string().transform((v) => parseInt(v, 10)),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
  z.object({
    intent: z.literal("big-plan-mark-done"),
    ...UpdateFormBigPlanSchema,
  }),
  z.object({
    intent: z.literal("big-plan-mark-not-done"),
    ...UpdateFormBigPlanSchema,
  }),
  z.object({
    intent: z.literal("big-plan-start"),
    ...UpdateFormBigPlanSchema,
  }),
  z.object({
    intent: z.literal("big-plan-restart"),
    ...UpdateFormBigPlanSchema,
  }),
  z.object({
    intent: z.literal("big-plan-block"),
    ...UpdateFormBigPlanSchema,
  }),
  z.object({
    intent: z.literal("big-plan-stop"),
    ...UpdateFormBigPlanSchema,
  }),
  z.object({
    intent: z.literal("big-plan-reactivate"),
    ...UpdateFormBigPlanSchema,
  }),
  z.object({
    intent: z.literal("big-plan-update"),
    ...UpdateFormBigPlanSchema,
  }),
  z.object({
    intent: z.literal("todo-task-mark-done"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-mark-not-done"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-start"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-restart"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-block"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-stop"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-reactivate"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-update"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-delay-1-day"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-delay-1-week"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("todo-task-delay-1-month"),
    ...UpdateFormTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-mark-done"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-mark-not-done"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-start"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-restart"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-block"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-stop"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-reactivate"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-update"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-delay-1-day"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-delay-1-week"),
    ...UpdateFormInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("inbox-task-delay-1-month"),
    ...UpdateFormInboxTaskSchema,
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    allow_archived: false,
    include_life_plan: true,
    include_chapters: true,
    include_goals: true,
    include_workspace: true,
    include_aspects: true,
    include_big_plans: true,
  });

  try {
    const response = await apiClient.timeEvents.timeEventInDayBlockLoad({
      ref_id: id,
      allow_archived: true,
    });

    let bigPlanResult = null;
    if (response.big_plan) {
      bigPlanResult = await apiClient.bigPlans.bigPlanLoad({
        ref_id: response.big_plan.ref_id,
        allow_archived: true,
      });
    }

    let todoTaskResult = null;
    if (response.todo_task) {
      todoTaskResult = await apiClient.todo.todoTaskLoad({
        ref_id: response.todo_task.ref_id,
        allow_archived: true,
      });
    }

    let inboxTaskResult = null;

    const habit = response.habit ?? null;
    const chore = response.chore ?? null;

    let habitInboxTasks: InboxTask[] = [];
    if (habit) {
      const inboxTaskResult = await apiClient.inboxTasks.inboxTaskFind({
        allow_archived: false,
        filter_just_workable: true,
        filter_namespace: [HABIT],
        filter_source_entity_ref_ids: [habit.ref_id],
      });
      habitInboxTasks = inboxTaskResult.entries.map((e) => e.inbox_task);
    }

    let choreInboxTasks: InboxTask[] = [];
    if (chore) {
      const inboxTaskResult = await apiClient.inboxTasks.inboxTaskFind({
        allow_archived: false,
        filter_just_workable: true,
        filter_namespace: [CHORE],
        filter_source_entity_ref_ids: [chore.ref_id],
      });
      choreInboxTasks = inboxTaskResult.entries.map((e) => e.inbox_task);
    }

    const timePlanActivity = response.time_plan_activity ?? null;

    if (timePlanActivity) {
      if (isTimePlanActivityBigPlanTarget(timePlanActivity.target)) {
        bigPlanResult = await apiClient.bigPlans.bigPlanLoad({
          ref_id: entityLinkRefIdFromWire(timePlanActivity.target),
          allow_archived: true,
        });
      } else if (isTimePlanActivityInboxTaskTarget(timePlanActivity.target)) {
        inboxTaskResult = await apiClient.inboxTasks.inboxTaskLoad({
          ref_id: entityLinkRefIdFromWire(timePlanActivity.target),
          allow_archived: true,
        });
      }
    }

    const bigPlan = response.big_plan ?? bigPlanResult?.big_plan ?? null;
    let bigPlanInboxTasks: InboxTask[] = [];
    if (bigPlan) {
      const inboxTaskResult = await apiClient.inboxTasks.inboxTaskFind({
        allow_archived: false,
        filter_just_workable: true,
        filter_namespace: [BIG_PLAN],
        filter_source_entity_ref_ids: [bigPlan.ref_id],
      });
      bigPlanInboxTasks = inboxTaskResult.entries.map((e) => e.inbox_task);
    }

    const allContacts = await apiClient.contacts.contactFind({
      allow_archived: false,
    });

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });

    return json({
      rootAspect: summaryResponse.root_aspect as AspectSummary,
      lifePlan: summaryResponse.life_plan as LifePlan,
      allAspects: summaryResponse.aspects as Array<AspectSummary>,
      allChapters: summaryResponse.chapters as Array<ChapterSummary>,
      allGoals: summaryResponse.goals as Array<GoalSummary>,
      allMilestones: summaryResponse.milestones as Array<MilestoneSummary>,
      inDayBlock: response.in_day_block,
      scheduleEvent: response.schedule_event,
      bigPlan: bigPlan,
      bigPlanInfo: bigPlanResult,
      bigPlanInboxTasks: bigPlanInboxTasks,
      inboxTask: inboxTaskResult?.inbox_task ?? null,
      inboxTaskInfo: inboxTaskResult,
      todoTask: response.todo_task,
      todoTaskInfo: todoTaskResult,
      habit: habit,
      habitInboxTasks: habitInboxTasks,
      chore: chore,
      choreInboxTasks: choreInboxTasks,
      timePlanActivity: timePlanActivity,
      allContacts: allContacts.contacts as Array<Contact>,
      allTags: allTags.tags as Array<Tag>,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    throw error;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);
  const url = new URL(request.url);

  try {
    switch (form.intent) {
      case "update": {
        const { startDate, startTimeInDay } = timeEventInDayBlockParamsToUtc(
          form,
          form.userTimezone,
        );
        await apiClient.timeEvents.timeEventInDayBlockUpdate({
          ref_id: id,
          start_date: {
            should_change: true,
            value: startDate,
          },
          start_time_in_day: {
            should_change: true,
            value: startTimeInDay ?? "",
          },
          duration_mins: {
            should_change: true,
            value: form.durationMins,
          },
        });
        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "archive": {
        await apiClient.timeEvents.timeEventInDayBlockArchive({
          ref_id: id,
        });
        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "remove": {
        await apiClient.timeEvents.timeEventInDayBlockRemove({
          ref_id: id,
        });
        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "big-plan-mark-done":
      case "big-plan-mark-not-done":
      case "big-plan-start":
      case "big-plan-restart":
      case "big-plan-block":
      case "big-plan-stop":
      case "big-plan-reactivate":
      case "big-plan-update": {
        let status = form.bigPlanStatus;
        if (form.intent === "big-plan-mark-done") {
          status = BigPlanStatus.DONE;
        } else if (form.intent === "big-plan-mark-not-done") {
          status = BigPlanStatus.NOT_DONE;
        } else if (form.intent === "big-plan-start") {
          status = BigPlanStatus.IN_PROGRESS;
        } else if (form.intent === "big-plan-restart") {
          status = BigPlanStatus.IN_PROGRESS;
        } else if (form.intent === "big-plan-block") {
          status = BigPlanStatus.BLOCKED;
        } else if (form.intent === "big-plan-stop") {
          status = BigPlanStatus.NOT_STARTED;
        } else if (form.intent === "big-plan-reactivate") {
          status = BigPlanStatus.NOT_STARTED;
        }

        const result = await apiClient.bigPlans.bigPlanUpdate({
          ref_id: form.bigPlanRefId,
          name: {
            should_change: true,
            value: form.bigPlanName,
          },
          status: {
            should_change: true,
            value: status,
          },
          aspect_ref_id: {
            should_change: true,
            value: form.bigPlanAspect,
          },
          chapter_ref_id: {
            should_change: form.bigPlanChapter !== undefined,
            value:
              form.bigPlanChapter !== undefined && form.bigPlanChapter !== ""
                ? form.bigPlanChapter
                : null,
          },
          goal_ref_id: {
            should_change: form.bigPlanGoal !== undefined,
            value:
              form.bigPlanGoal !== undefined && form.bigPlanGoal !== ""
                ? form.bigPlanGoal
                : null,
          },
          is_key: {
            should_change: true,
            value: form.bigPlanIsKey,
          },
          eisen: {
            should_change: true,
            value: form.bigPlanEisen,
          },
          difficulty: {
            should_change: true,
            value: form.bigPlanDifficulty,
          },
          actionable_date: {
            should_change: true,
            value:
              form.bigPlanActionableDate !== undefined &&
              form.bigPlanActionableDate !== ""
                ? form.bigPlanActionableDate
                : undefined,
          },
          due_date: {
            should_change: true,
            value:
              form.bigPlanDueDate !== undefined && form.bigPlanDueDate !== ""
                ? form.bigPlanDueDate
                : undefined,
          },
        });

        if (result.record_score_result) {
          return redirect(`/app/workspace/calendar?${url.searchParams}`, {
            headers: {
              "Set-Cookie": await saveScoreAction(result.record_score_result),
            },
          });
        }

        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "todo-task-mark-done":
      case "todo-task-mark-not-done":
      case "todo-task-start":
      case "todo-task-restart":
      case "todo-task-block":
      case "todo-task-stop":
      case "todo-task-reactivate":
      case "todo-task-update": {
        let status = form.todoTaskStatus;
        if (form.intent === "todo-task-mark-done") {
          status = InboxTaskStatus.DONE;
        } else if (form.intent === "todo-task-mark-not-done") {
          status = InboxTaskStatus.NOT_DONE;
        } else if (
          form.intent === "todo-task-start" ||
          form.intent === "todo-task-restart"
        ) {
          status = InboxTaskStatus.IN_PROGRESS;
        } else if (form.intent === "todo-task-block") {
          status = InboxTaskStatus.BLOCKED;
        } else if (
          form.intent === "todo-task-stop" ||
          form.intent === "todo-task-reactivate"
        ) {
          status = InboxTaskStatus.NOT_STARTED;
        }

        await apiClient.todo.todoTaskUpdate({
          ref_id: form.todoTaskRefId,
          name: {
            should_change: true,
            value: form.todoTaskName,
          },
          status: {
            should_change: true,
            value: status,
          },
          aspect_ref_id:
            form.todoTaskAspect !== undefined
              ? { should_change: true, value: form.todoTaskAspect }
              : { should_change: false },
          chapter_ref_id:
            form.todoTaskAspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.todoTaskChapter !== undefined &&
                    form.todoTaskChapter !== ""
                      ? form.todoTaskChapter
                      : undefined,
                }
              : { should_change: false },
          goal_ref_id:
            form.todoTaskAspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.todoTaskGoal !== undefined && form.todoTaskGoal !== ""
                      ? form.todoTaskGoal
                      : undefined,
                }
              : { should_change: false },
          is_key: {
            should_change: true,
            value: form.todoTaskIsKey,
          },
          eisen: {
            should_change: true,
            value: form.todoTaskEisen,
          },
          difficulty: {
            should_change: true,
            value: form.todoTaskDifficulty,
          },
          actionable_date: {
            should_change: true,
            value:
              form.todoTaskActionableDate !== undefined &&
              form.todoTaskActionableDate !== ""
                ? form.todoTaskActionableDate
                : null,
          },
          due_date: {
            should_change: true,
            value:
              form.todoTaskDueDate !== undefined && form.todoTaskDueDate !== ""
                ? form.todoTaskDueDate
                : null,
          },
        });

        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "todo-task-delay-1-day":
      case "todo-task-delay-1-week":
      case "todo-task-delay-1-month": {
        const today = DateTime.now().startOf("day");
        const delay =
          form.intent === "todo-task-delay-1-day"
            ? { days: 1 }
            : form.intent === "todo-task-delay-1-week"
              ? { weeks: 1 }
              : { months: 1 };
        const newActionableDate = today.plus(delay);

        let newDueDate: DateTime | undefined;
        if (form.todoTaskDueDate !== undefined && form.todoTaskDueDate !== "") {
          const oldDueDate = DateTime.fromISO(form.todoTaskDueDate);
          if (
            form.todoTaskActionableDate !== undefined &&
            form.todoTaskActionableDate !== ""
          ) {
            const oldActionableDate = DateTime.fromISO(
              form.todoTaskActionableDate,
            );
            const gapDays = oldDueDate.diff(oldActionableDate, "days").days;
            newDueDate = newActionableDate.plus({ days: gapDays });
          } else {
            newDueDate = newActionableDate;
          }
        }

        await apiClient.todo.todoTaskUpdate({
          ref_id: form.todoTaskRefId,
          name: { should_change: false },
          status: { should_change: false },
          aspect_ref_id: { should_change: false },
          chapter_ref_id: { should_change: false },
          goal_ref_id: { should_change: false },
          is_key: { should_change: false },
          eisen: { should_change: false },
          difficulty: { should_change: false },
          actionable_date: {
            should_change: true,
            value: newActionableDate.toISODate() ?? undefined,
          },
          due_date: {
            should_change: true,
            value: newDueDate
              ? (newDueDate.toISODate() ?? undefined)
              : undefined,
          },
        });

        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "inbox-task-mark-done":
      case "inbox-task-mark-not-done":
      case "inbox-task-start":
      case "inbox-task-restart":
      case "inbox-task-block":
      case "inbox-task-stop":
      case "inbox-task-reactivate":
      case "inbox-task-update": {
        let status = form.inboxTaskStatus;
        const corePropertyEditable = isInboxTaskCoreFieldEditable(
          form.inboxTaskNamespace,
        );

        if (form.intent === "inbox-task-mark-done") {
          status = InboxTaskStatus.DONE;
        } else if (form.intent === "inbox-task-mark-not-done") {
          status = InboxTaskStatus.NOT_DONE;
        } else if (
          form.intent === "inbox-task-start" ||
          form.intent === "inbox-task-restart"
        ) {
          status = InboxTaskStatus.IN_PROGRESS;
        } else if (form.intent === "inbox-task-block") {
          status = InboxTaskStatus.BLOCKED;
        } else if (
          form.intent === "inbox-task-stop" ||
          form.intent === "inbox-task-reactivate"
        ) {
          status = InboxTaskStatus.NOT_STARTED;
        }

        const result = await apiClient.inboxTasks.inboxTaskUpdate({
          ref_id: form.inboxTaskRefId,
          name: corePropertyEditable
            ? {
                should_change: true,
                value: form.inboxTaskName,
              }
            : { should_change: false },
          status: {
            should_change: true,
            value: status,
          },
          is_key: corePropertyEditable
            ? {
                should_change: true,
                value: form.inboxTaskIsKey,
              }
            : { should_change: false },
          eisen: corePropertyEditable
            ? {
                should_change: true,
                value: form.inboxTaskEisen,
              }
            : { should_change: false },
          difficulty: corePropertyEditable
            ? {
                should_change: true,
                value: form.inboxTaskDifficulty,
              }
            : { should_change: false },
          actionable_date: {
            should_change: true,
            value:
              form.inboxTaskActionableDate !== undefined &&
              form.inboxTaskActionableDate !== ""
                ? form.inboxTaskActionableDate
                : undefined,
          },
          due_date: {
            should_change: true,
            value:
              form.inboxTaskDueDate !== undefined &&
              form.inboxTaskDueDate !== ""
                ? form.inboxTaskDueDate
                : undefined,
          },
        });

        if (result.record_score_result) {
          return redirect(`/app/workspace/calendar?${url.searchParams}`, {
            headers: {
              "Set-Cookie": await saveScoreAction(result.record_score_result),
            },
          });
        }

        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "inbox-task-delay-1-day":
      case "inbox-task-delay-1-week":
      case "inbox-task-delay-1-month": {
        const today = DateTime.now().startOf("day");
        const delay =
          form.intent === "inbox-task-delay-1-day"
            ? { days: 1 }
            : form.intent === "inbox-task-delay-1-week"
              ? { weeks: 1 }
              : { months: 1 };
        const newActionableDate = today.plus(delay);

        let newDueDate: DateTime | undefined;
        if (
          form.inboxTaskDueDate !== undefined &&
          form.inboxTaskDueDate !== ""
        ) {
          const oldDueDate = DateTime.fromISO(form.inboxTaskDueDate);
          if (
            form.inboxTaskActionableDate !== undefined &&
            form.inboxTaskActionableDate !== ""
          ) {
            const oldActionableDate = DateTime.fromISO(
              form.inboxTaskActionableDate,
            );
            const gapDays = oldDueDate.diff(oldActionableDate, "days").days;
            newDueDate = newActionableDate.plus({ days: gapDays });
          } else {
            newDueDate = newActionableDate;
          }
        }

        await apiClient.inboxTasks.inboxTaskUpdate({
          ref_id: form.inboxTaskRefId,
          name: { should_change: false },
          status: { should_change: false },
          is_key: { should_change: false },
          eisen: { should_change: false },
          difficulty: { should_change: false },
          actionable_date: {
            should_change: true,
            value: newActionableDate.toISODate() ?? undefined,
          },
          due_date: {
            should_change: true,
            value: newDueDate
              ? (newDueDate.toISODate() ?? undefined)
              : undefined,
          },
        });

        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
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

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function TimeEventInDayBlockViewOne() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.inDayBlock.archived;
  const corePropertyEditable = isTimeEventInDayBlockEditable(
    loaderData.inDayBlock.owner,
  );

  const cardActionFetcher = useFetcher();

  function handleCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.DONE,
      },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleCardMarkNotDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.NOT_DONE,
      },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  const sortedHabitInboxTasks = sortInboxTasksNaturally(
    loaderData.habitInboxTasks,
  );
  const sortedBigPlanInboxTasks = sortInboxTasksNaturally(
    loaderData.bigPlanInboxTasks,
  );
  const sortedChoreInboxTasks = sortInboxTasksNaturally(
    loaderData.choreInboxTasks,
  );

  let name = null;
  switch (timeEventInDayBlockOwnerTheType(loaderData.inDayBlock)) {
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      name = loaderData.scheduleEvent!.name;
      break;

    case NamedEntityTag.BIG_PLAN:
      name = loaderData.bigPlan!.name;
      break;

    case NamedEntityTag.TODO_TASK:
      name = loaderData.todoTask!.name;
      break;

    case NamedEntityTag.HABIT:
      name = loaderData.habit!.name;
      break;

    case NamedEntityTag.CHORE:
      name = loaderData.chore!.name;
      break;

    case NamedEntityTag.TIME_PLAN_ACTIVITY:
      name = `Work on activity ${loaderData.timePlanActivity!.ref_id}`;
      break;

    default:
      throw new Error("Unknown time event in day owner type");
  }

  const blockParamsInTz = timeEventInDayBlockParamsToTimezone(
    {
      startDate: loaderData.inDayBlock.start_date,
      startTimeInDay: loaderData.inDayBlock.start_time_in_day,
    },
    topLevelInfo.user.timezone,
  );
  const [startDate, setStartDate] = useState(blockParamsInTz.startDate);
  const [startTimeInDay, setStartTimeInDay] = useState(
    blockParamsInTz.startTimeInDay!,
  );
  const [durationMins, setDurationMins] = useState(
    loaderData.inDayBlock.duration_mins,
  );
  useEffect(() => {
    const blockParamsInTz = timeEventInDayBlockParamsToTimezone(
      {
        startDate: loaderData.inDayBlock.start_date,
        startTimeInDay: loaderData.inDayBlock.start_time_in_day,
      },
      topLevelInfo.user.timezone,
    );
    setStartDate(blockParamsInTz.startDate);
    setStartTimeInDay(blockParamsInTz.startTimeInDay!);
    setDurationMins(loaderData.inDayBlock.duration_mins);
  }, [loaderData.inDayBlock, topLevelInfo.user.timezone]);

  const [debounceForeign, setDeoubceForeign] = useState(false);
  setTimeout(() => setDeoubceForeign(true), 100);
  useEffect(() => {
    if (!debounceForeign) {
      return;
    }
    if (query.get("sourceStartDate") && query.get("sourceStartTimeInDay")) {
      setStartDate(query.get("sourceStartDate")!);
      setStartTimeInDay(query.get("sourceStartTimeInDay")!);
    }
    if (query.get("sourceDurationMins")) {
      setDurationMins(parseInt(query.get("sourceDurationMins")!, 10));
    }
  }, [query, debounceForeign]);

  return (
    <LeafPanel
      key={`time-event-in-day-block-${loaderData.inDayBlock.ref_id}`}
      fakeKey={`time-event-in-day-block-${loaderData.inDayBlock.ref_id}`}
      showArchiveAndRemoveButton={corePropertyEditable}
      inputsEnabled={inputsEnabled}
      entityNotEditable={!corePropertyEditable}
      entityArchived={loaderData.inDayBlock.archived}
      returnLocation={`/app/workspace/calendar?${query}`}
    >
      <TimeEventParamsSource
        startDate={startDate}
        startTimeInDay={startTimeInDay}
        durationMins={durationMins}
      />
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="time-event-in-day-block-properties"
        title="Properties"
        actions={
          <SectionActions
            id="time-event-in-day-block-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled && corePropertyEditable}
            actions={[
              ActionMultipleSpread({
                actions: [
                  ActionSingle({
                    text: "Save",
                    value: "update",
                    highlight: true,
                  }),
                ],
              }),
            ]}
          />
        }
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: "0.25rem" }}>
          <input
            type="hidden"
            name="userTimezone"
            value={topLevelInfo.user.timezone}
          />
          <FormControl fullWidth>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="name"
              name="name"
              readOnly={true}
              defaultValue={name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <TimeEventSourceLink timeEvent={loaderData.inDayBlock} />
        </Box>

        <FormControl fullWidth>
          <InputLabel id="startDate" shrink margin="dense">
            Start Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="startDate"
            name="startDate"
            readOnly={!(inputsEnabled && corePropertyEditable)}
            disabled={!(inputsEnabled && corePropertyEditable)}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startTimeInDay" shrink margin="dense">
            Start Time
          </InputLabel>
          <OutlinedInput
            type="time"
            label="startTimeInDay"
            name="startTimeInDay"
            readOnly={!(inputsEnabled && corePropertyEditable)}
            value={startTimeInDay}
            onChange={(e) => setStartTimeInDay(e.target.value)}
          />

          <FieldError
            actionResult={actionData}
            fieldName="/start_time_in_day"
          />
        </FormControl>

        <Stack spacing={2} direction="row">
          <ButtonGroup
            variant="outlined"
            disabled={!(inputsEnabled && corePropertyEditable)}
          >
            <Button
              disabled={!inputsEnabled}
              variant={durationMins === 15 ? "contained" : "outlined"}
              onClick={() => setDurationMins(15)}
            >
              15m
            </Button>
            <Button
              disabled={!inputsEnabled}
              variant={durationMins === 30 ? "contained" : "outlined"}
              onClick={() => setDurationMins(30)}
            >
              30m
            </Button>
            <Button
              disabled={!inputsEnabled}
              variant={durationMins === 60 ? "contained" : "outlined"}
              onClick={() => setDurationMins(60)}
            >
              60m
            </Button>
          </ButtonGroup>

          <FormControl fullWidth>
            <InputLabel id="durationMins" shrink margin="dense">
              Duration (Mins)
            </InputLabel>
            <OutlinedInput
              type="number"
              label="Duration (Mins)"
              name="durationMins"
              readOnly={!(inputsEnabled && corePropertyEditable)}
              value={durationMins}
              onChange={(e) => {
                if (Number.isNaN(parseInt(e.target.value, 10))) {
                  setDurationMins(0);
                  e.preventDefault();
                  return;
                }

                return setDurationMins(parseInt(e.target.value, 10));
              }}
            />

            <FieldError actionResult={actionData} fieldName="/duration_mins" />
          </FormControl>
        </Stack>
      </SectionCard>

      {loaderData.bigPlan && (
        <BigPlanPropertiesEditor
          title="Big Plan"
          showLinkToBigPlan
          intentPrefix="big-plan"
          namePrefix="bigPlan"
          topLevelInfo={topLevelInfo}
          lifePlan={loaderData.lifePlan}
          allAspects={loaderData.allAspects}
          allChapters={loaderData.allChapters}
          allGoals={loaderData.allGoals}
          allMilestones={loaderData.allMilestones}
          inputsEnabled={inputsEnabled && !loaderData.bigPlan.archived}
          bigPlan={loaderData.bigPlan}
          bigPlanInfo={loaderData.bigPlanInfo!}
          actionData={actionData}
        />
      )}

      {loaderData.inboxTask && loaderData.inboxTaskInfo && (
        <InboxTaskPropertiesEditor
          title="Inbox Task"
          showLinkToInboxTask
          intentPrefix="inbox-task"
          namePrefix="inboxTask"
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled && !loaderData.inboxTask.archived}
          inboxTask={loaderData.inboxTask}
          inboxTaskInfo={loaderData.inboxTaskInfo}
          actionData={actionData}
        />
      )}

      {loaderData.todoTask && loaderData.todoTaskInfo && (
        <TodoTaskPropertiesEditor
          title="Todo Task"
          showLinkToTodoTask
          intentPrefix="todo-task"
          namePrefix="todoTask"
          topLevelInfo={topLevelInfo}
          lifePlan={loaderData.lifePlan}
          allAspects={loaderData.allAspects}
          allChapters={loaderData.allChapters}
          allGoals={loaderData.allGoals}
          allMilestones={loaderData.allMilestones}
          allTags={loaderData.allTags}
          tags={loaderData.todoTaskInfo.tags}
          allContacts={loaderData.allContacts}
          contacts={
            (
              loaderData.todoTaskInfo as {
                contacts?: Array<Contact>;
              }
            ).contacts ?? []
          }
          inputsEnabled={inputsEnabled && !loaderData.todoTask.archived}
          todoTask={loaderData.todoTask}
          inboxTask={loaderData.todoTaskInfo.inbox_task}
          actionData={actionData}
        />
      )}

      {loaderData.habit && sortedHabitInboxTasks.length > 0 && (
        <SectionCard title="Habit Inbox Tasks">
          <InboxTaskStack
            topLevelInfo={topLevelInfo}
            showOptions={{
              showStatus: true,
              showDueDate: true,
              showHandleMarkDone: true,
              showHandleMarkNotDone: true,
            }}
            inboxTasks={sortedHabitInboxTasks}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
          />
        </SectionCard>
      )}

      {loaderData.bigPlan && sortedBigPlanInboxTasks.length > 0 && (
        <SectionCard title="Big Plan Inbox Tasks">
          <InboxTaskStack
            topLevelInfo={topLevelInfo}
            showOptions={{
              showStatus: true,
              showDueDate: true,
              showHandleMarkDone: true,
              showHandleMarkNotDone: true,
            }}
            inboxTasks={sortedBigPlanInboxTasks}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
          />
        </SectionCard>
      )}

      {loaderData.chore && sortedChoreInboxTasks.length > 0 && (
        <SectionCard title="Chore Inbox Tasks">
          <InboxTaskStack
            topLevelInfo={topLevelInfo}
            showOptions={{
              showStatus: true,
              showDueDate: true,
              showHandleMarkDone: true,
              showHandleMarkNotDone: true,
            }}
            inboxTasks={sortedChoreInboxTasks}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
          />
        </SectionCard>
      )}
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/calendar/time-event/in-day-block/${params.id}`,
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find time event in day block #${params.id}!`,
    error: (params) =>
      `There was an error loading time event in day block #${params.id}! Please try again!`,
  },
);
