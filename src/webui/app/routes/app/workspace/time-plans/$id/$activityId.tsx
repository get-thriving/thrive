import type {
  AccessStatus,
  InboxTask,
  LifePlan,
  AspectSummary,
  TimePlan,
} from "@jupiter/webapi-client";
import {
  NamedEntityTag,
  BigPlanStatus,
  Difficulty,
  Eisen,
  HabitRepeatsStrategy,
  InboxTaskStatus,
  RecurringTaskPeriod,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { DateTime } from "luxon";
import { FormControl, FormLabel, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useFetcher,
  useNavigation,
  useParams,
  useRouteLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import { TodoTaskPropertiesEditor } from "@jupiter/core/todo/components/properties-editor";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockToTimezone,
} from "@jupiter/core/common/sub/time_events/time-event";
import {
  isInboxTaskCoreFieldEditable,
  sortInboxTasksNaturally,
} from "#/core/common/sub/inbox_tasks/root";
import { BigPlanPropertiesEditor } from "@jupiter/core/big_plans/component/properties-editor";
import { HabitPropertiesEditor } from "@jupiter/core/habits/component/properties-editor";
import { ChorePropertiesEditor } from "@jupiter/core/chores/component/properties-editor";
import { InboxTaskPropertiesEditor } from "@jupiter/core/common/sub/inbox_tasks/component/properties-editor";
import { InboxTaskStack } from "@jupiter/core/common/sub/inbox_tasks/component/stack";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import {
  TIME_PLAN_VIEW_PARAM,
  withTimePlanView,
} from "@jupiter/core/time_plans/view-mode";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  NavMultipleSpread,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimeEventInDayBlockStack } from "@jupiter/core/common/sub/time_events/sub/in_day_block/component/stack";
import { timePlanAllowsInboxTasks } from "@jupiter/core/time_plans/root";
import { TimePlanActivityFeasabilitySelect } from "@jupiter/core/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "@jupiter/core/time_plans/sub/activity/component/kind-select";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";
import { accessStatusAllowsWriterOrAbove } from "#/core/common/sub/access/access-level";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
  activityId: z.string(),
});

const UpdateFormTargetInboxTaskSchema = {
  targetInboxTaskRefId: z.string(),
  targetInboxTaskNamespace: z.string(),
  targetInboxTaskName: z.string(),
  targetInboxTaskBigPlan: z.string().optional(),
  targetInboxTaskIsKey: CheckboxAsString,
  targetInboxTaskStatus: z.nativeEnum(InboxTaskStatus),
  targetInboxTaskEisen: z.nativeEnum(Eisen),
  targetInboxTaskDifficulty: z.nativeEnum(Difficulty),
  targetInboxTaskActionableDate: z.string().optional(),
  targetInboxTaskDueDate: z.string().optional(),
};

const UpdateFormTargetBigPlanSchema = {
  targetBigPlanRefId: z.string(),
  targetBigPlanName: z.string(),
  targetBigPlanStatus: z.nativeEnum(BigPlanStatus),
  targetBigPlanAspect: z.string().optional(),
  targetBigPlanChapter: z.string().optional(),
  targetBigPlanGoal: z.string().optional(),
  targetBigPlanIsKey: CheckboxAsString,
  targetBigPlanEisen: z.nativeEnum(Eisen),
  targetBigPlanDifficulty: z.nativeEnum(Difficulty),
  targetBigPlanActionableDate: z.string().optional(),
  targetBigPlanDueDate: z.string().optional(),
};

const UpdateFormTargetTodoTaskSchema = {
  targetTodoTaskRefId: z.string(),
  targetTodoTaskName: z.string(),
  targetTodoTaskStatus: z.nativeEnum(InboxTaskStatus),
  targetTodoTaskAspect: z.string().optional(),
  targetTodoTaskChapter: z.string().optional(),
  targetTodoTaskGoal: z.string().optional(),
  targetTodoTaskIsKey: CheckboxAsString,
  targetTodoTaskEisen: z.nativeEnum(Eisen),
  targetTodoTaskDifficulty: z.nativeEnum(Difficulty),
  targetTodoTaskActionableDate: z.string().optional(),
  targetTodoTaskDueDate: z.string().optional(),
};

const UpdateFormTargetHabitSchema = {
  targetHabitRefId: z.string(),
  targetHabitName: z.string(),
  targetHabitAspect: z.string().optional(),
  targetHabitChapter: z.string().optional(),
  targetHabitGoal: z.string().optional(),
  targetHabitPeriod: z.nativeEnum(RecurringTaskPeriod),
  targetHabitIsKey: CheckboxAsString,
  targetHabitEisen: z.nativeEnum(Eisen),
  targetHabitDifficulty: z.nativeEnum(Difficulty),
  targetHabitActionableFromDay: z.string().optional(),
  targetHabitActionableFromMonth: z.string().optional(),
  targetHabitDueAtDay: z.string().optional(),
  targetHabitDueAtMonth: z.string().optional(),
  targetHabitSkipRule: z.string().optional(),
  targetHabitRepeatsStrategy: z
    .nativeEnum(HabitRepeatsStrategy)
    .or(z.literal("none"))
    .optional(),
  targetHabitRepeatsInPeriodCount: z.string().optional(),
};

const UpdateFormTargetChoreSchema = {
  targetChoreRefId: z.string(),
  targetChoreName: z.string(),
  targetChoreAspect: z.string().optional(),
  targetChoreChapter: z.string().optional(),
  targetChoreGoal: z.string().optional(),
  targetChoreIsKey: CheckboxAsString,
  targetChorePeriod: z.nativeEnum(RecurringTaskPeriod),
  targetChoreEisen: z.nativeEnum(Eisen),
  targetChoreDifficulty: z.nativeEnum(Difficulty),
  targetChoreActionableFromDay: z.string().optional(),
  targetChoreActionableFromMonth: z.string().optional(),
  targetChoreDueAtDay: z.string().optional(),
  targetChoreDueAtMonth: z.string().optional(),
  targetChoreMustDo: CheckboxAsString,
  targetChoreSkipRule: z.string().optional(),
  targetChoreStartAtDate: z.string().optional(),
  targetChoreEndAtDate: z.string().optional(),
};

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    kind: z.nativeEnum(TimePlanActivityKind),
    feasability: z.nativeEnum(TimePlanActivityFeasability),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
  z.object({
    intent: z.literal("target-inbox-task-mark-done"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-mark-not-done"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-start"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-restart"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-block"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-stop"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-reactivate"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-update"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-delay-1-day"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-delay-1-week"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-inbox-task-delay-1-month"),
    ...UpdateFormTargetInboxTaskSchema,
  }),
  z.object({
    intent: z.literal("target-big-plan-mark-done"),
    ...UpdateFormTargetBigPlanSchema,
  }),
  z.object({
    intent: z.literal("target-big-plan-mark-not-done"),
    ...UpdateFormTargetBigPlanSchema,
  }),
  z.object({
    intent: z.literal("target-big-plan-start"),
    ...UpdateFormTargetBigPlanSchema,
  }),
  z.object({
    intent: z.literal("target-big-plan-restart"),
    ...UpdateFormTargetBigPlanSchema,
  }),
  z.object({
    intent: z.literal("target-big-plan-block"),
    ...UpdateFormTargetBigPlanSchema,
  }),
  z.object({
    intent: z.literal("target-big-plan-stop"),
    ...UpdateFormTargetBigPlanSchema,
  }),
  z.object({
    intent: z.literal("target-big-plan-reactivate"),
    ...UpdateFormTargetBigPlanSchema,
  }),
  z.object({
    intent: z.literal("target-big-plan-update"),
    ...UpdateFormTargetBigPlanSchema,
  }),
  z.object({
    intent: z.literal("target-big-plan-create-note"),
  }),
  z.object({
    intent: z.literal("target-todo-task-mark-done"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-mark-not-done"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-start"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-restart"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-block"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-stop"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-reactivate"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-update"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-delay-1-day"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-delay-1-week"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-delay-1-month"),
    ...UpdateFormTargetTodoTaskSchema,
  }),
  z.object({
    intent: z.literal("target-todo-task-create-note"),
  }),
  z.object({
    intent: z.literal("target-habit-update"),
    ...UpdateFormTargetHabitSchema,
  }),
  z.object({
    intent: z.literal("target-habit-create-note"),
  }),
  z.object({
    intent: z.literal("target-habit-gen"),
  }),
  z.object({
    intent: z.literal("target-chore-update"),
    ...UpdateFormTargetChoreSchema,
  }),
  z.object({
    intent: z.literal("target-chore-create-note"),
  }),
  z.object({
    intent: z.literal("target-chore-gen"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { activityId } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    allow_archived: false,
    include_workspace: true,
    include_life_plan: true,
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
    include_big_plans: true,
  });

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });
    const allContacts = await apiClient.contacts.contactFind({
      allow_archived: false,
    });

    const result = await apiClient.timePlans.timePlanActivityLoad({
      ref_id: activityId,
      allow_archived: true,
    });

    return json({
      rootAspect: summaryResponse.root_aspect as AspectSummary,
      lifePlan: summaryResponse.life_plan as LifePlan,
      allAspects: summaryResponse.aspects,
      allChapters: summaryResponse.chapters,
      allGoals: summaryResponse.goals,
      allMilestones: summaryResponse.milestones,
      allTags: allTags.tags,
      allContacts: allContacts.contacts,
      timePlanActivity: result.time_plan_activity,
      targetInboxTask: result.target_inbox_task,
      targetInboxTaskInfo: result.target_inbox_task_info,
      targetBigPlan: result.target_big_plan,
      targetBigPlanInfo: result.target_big_plan_info,
      targetTodoTask: result.target_todo_task,
      targetTodoTaskInfo: result.target_todo_task_info,
      targetHabit: result.target_habit,
      targetHabitInfo: result.target_habit_info,
      targetChore: result.target_chore,
      targetChoreInfo: result.target_chore_info,
      activityTimeEventBlocks: result.time_event_blocks,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id, activityId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);
  // The panel was opened from a time plan being looked at one way or another
  // - whatever it does, it hands that back on the way out.
  const timePlanView = new URL(request.url).searchParams.get(
    TIME_PLAN_VIEW_PARAM,
  );
  const timePlanLocation = withTimePlanView(
    `/app/workspace/time-plans/${id}`,
    timePlanView,
  );

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.timePlans.timePlanActivityUpdate({
          ref_id: activityId,
          kind: {
            should_change: true,
            value: form.kind,
          },
          feasability: {
            should_change: true,
            value: form.feasability,
          },
        });

        return redirect(timePlanLocation);
      }

      case "archive": {
        await apiClient.timePlans.timePlanActivityArchive({
          ref_id: activityId,
        });

        return redirect(timePlanLocation);
      }

      case "remove": {
        await apiClient.timePlans.timePlanActivityRemove({
          ref_id: activityId,
        });

        return redirect(timePlanLocation);
      }

      case "target-inbox-task-mark-done":
      case "target-inbox-task-mark-not-done":
      case "target-inbox-task-start":
      case "target-inbox-task-restart":
      case "target-inbox-task-block":
      case "target-inbox-task-stop":
      case "target-inbox-task-reactivate":
      case "target-inbox-task-update": {
        const corePropertyEditable = isInboxTaskCoreFieldEditable(
          form.targetInboxTaskNamespace,
        );

        let status = form.targetInboxTaskStatus;
        if (form.intent === "target-inbox-task-mark-done") {
          status = InboxTaskStatus.DONE;
        } else if (form.intent === "target-inbox-task-mark-not-done") {
          status = InboxTaskStatus.NOT_DONE;
        } else if (form.intent === "target-inbox-task-start") {
          status = InboxTaskStatus.IN_PROGRESS;
        } else if (form.intent === "target-inbox-task-restart") {
          status = InboxTaskStatus.IN_PROGRESS;
        } else if (form.intent === "target-inbox-task-block") {
          status = InboxTaskStatus.BLOCKED;
        } else if (form.intent === "target-inbox-task-stop") {
          status = InboxTaskStatus.NOT_STARTED;
        } else if (form.intent === "target-inbox-task-reactivate") {
          status = InboxTaskStatus.NOT_STARTED;
        }

        const result = await apiClient.inboxTasks.inboxTaskUpdate({
          ref_id: form.targetInboxTaskRefId,
          name: corePropertyEditable
            ? {
                should_change: true,
                value: form.targetInboxTaskName,
              }
            : { should_change: false },
          status: {
            should_change: true,
            value: status,
          },
          is_key: corePropertyEditable
            ? {
                should_change: true,
                value: form.targetInboxTaskIsKey,
              }
            : { should_change: false },
          eisen: corePropertyEditable
            ? {
                should_change: true,
                value: form.targetInboxTaskEisen,
              }
            : { should_change: false },
          difficulty: corePropertyEditable
            ? {
                should_change: true,
                value: form.targetInboxTaskDifficulty,
              }
            : { should_change: false },
          actionable_date: {
            should_change: true,
            value:
              form.targetInboxTaskActionableDate !== undefined &&
              form.targetInboxTaskActionableDate !== ""
                ? form.targetInboxTaskActionableDate
                : undefined,
          },
          due_date: {
            should_change: true,
            value:
              form.targetInboxTaskDueDate !== undefined &&
              form.targetInboxTaskDueDate !== ""
                ? form.targetInboxTaskDueDate
                : undefined,
          },
        });

        if (result.record_score_result) {
          return redirect(`/app/workspace/time-plans/${id}`, {
            headers: {
              "Set-Cookie": await saveScoreAction(result.record_score_result),
            },
          });
        }

        return redirect(timePlanLocation);
      }

      case "target-inbox-task-delay-1-day":
      case "target-inbox-task-delay-1-week":
      case "target-inbox-task-delay-1-month": {
        const today = DateTime.now().startOf("day");
        const delay =
          form.intent === "target-inbox-task-delay-1-day"
            ? { days: 1 }
            : form.intent === "target-inbox-task-delay-1-week"
              ? { weeks: 1 }
              : { months: 1 };
        const newActionableDate = today.plus(delay);

        let newDueDate: DateTime | undefined;
        if (
          form.targetInboxTaskDueDate !== undefined &&
          form.targetInboxTaskDueDate !== ""
        ) {
          const oldDueDate = DateTime.fromISO(form.targetInboxTaskDueDate);
          if (
            form.targetInboxTaskActionableDate !== undefined &&
            form.targetInboxTaskActionableDate !== ""
          ) {
            const oldActionableDate = DateTime.fromISO(
              form.targetInboxTaskActionableDate,
            );
            const gapDays = oldDueDate.diff(oldActionableDate, "days").days;
            newDueDate = newActionableDate.plus({ days: gapDays });
          } else {
            newDueDate = newActionableDate;
          }
        }

        await apiClient.inboxTasks.inboxTaskUpdate({
          ref_id: form.targetInboxTaskRefId,
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

        return redirect(timePlanLocation);
      }

      case "target-big-plan-mark-done":
      case "target-big-plan-mark-not-done":
      case "target-big-plan-start":
      case "target-big-plan-restart":
      case "target-big-plan-block":
      case "target-big-plan-stop":
      case "target-big-plan-reactivate":
      case "target-big-plan-update": {
        let status = form.targetBigPlanStatus;
        if (form.intent === "target-big-plan-mark-done") {
          status = BigPlanStatus.DONE;
        } else if (form.intent === "target-big-plan-mark-not-done") {
          status = BigPlanStatus.NOT_DONE;
        } else if (form.intent === "target-big-plan-start") {
          status = BigPlanStatus.IN_PROGRESS;
        } else if (form.intent === "target-big-plan-restart") {
          status = BigPlanStatus.IN_PROGRESS;
        } else if (form.intent === "target-big-plan-block") {
          status = BigPlanStatus.BLOCKED;
        } else if (form.intent === "target-big-plan-stop") {
          status = BigPlanStatus.NOT_STARTED;
        } else if (form.intent === "target-big-plan-reactivate") {
          status = BigPlanStatus.NOT_STARTED;
        }

        const result = await apiClient.bigPlans.bigPlanUpdate({
          ref_id: form.targetBigPlanRefId,
          name: {
            should_change: true,
            value: form.targetBigPlanName,
          },
          status: {
            should_change: true,
            value: status,
          },
          aspect_ref_id: {
            should_change: true,
            value: form.targetBigPlanAspect,
          },
          chapter_ref_id: {
            should_change: true,
            value:
              form.targetBigPlanChapter !== undefined &&
              form.targetBigPlanChapter !== ""
                ? form.targetBigPlanChapter
                : undefined,
          },
          goal_ref_id: {
            should_change: true,
            value:
              form.targetBigPlanGoal !== undefined &&
              form.targetBigPlanGoal !== ""
                ? form.targetBigPlanGoal
                : undefined,
          },
          is_key: {
            should_change: true,
            value: form.targetBigPlanIsKey,
          },
          eisen: {
            should_change: true,
            value: form.targetBigPlanEisen,
          },
          difficulty: {
            should_change: true,
            value: form.targetBigPlanDifficulty,
          },
          actionable_date: {
            should_change: true,
            value:
              form.targetBigPlanActionableDate !== undefined &&
              form.targetBigPlanActionableDate !== ""
                ? form.targetBigPlanActionableDate
                : undefined,
          },
          due_date: {
            should_change: true,
            value:
              form.targetBigPlanDueDate !== undefined &&
              form.targetBigPlanDueDate !== ""
                ? form.targetBigPlanDueDate
                : undefined,
          },
        });

        if (result.record_score_result) {
          return redirect(`/app/workspace/time-plans/${id}`, {
            headers: {
              "Set-Cookie": await saveScoreAction(result.record_score_result),
            },
          });
        }

        return redirect(timePlanLocation);
      }

      case "target-big-plan-create-note": {
        const activityResult = await apiClient.timePlans.timePlanActivityLoad({
          ref_id: activityId,
          allow_archived: true,
        });

        if (activityResult.target_big_plan) {
          await apiClient.notes.noteCreate({
            owner: noteStdOwner(
              NamedEntityTag.BIG_PLAN,
              activityResult.target_big_plan.ref_id,
            ),
            content: [],
          });
        }

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${activityId}`,
            timePlanView,
          ),
        );
      }

      case "target-todo-task-mark-done":
      case "target-todo-task-mark-not-done":
      case "target-todo-task-start":
      case "target-todo-task-restart":
      case "target-todo-task-block":
      case "target-todo-task-stop":
      case "target-todo-task-reactivate":
      case "target-todo-task-update":
      case "target-todo-task-delay-1-day":
      case "target-todo-task-delay-1-week":
      case "target-todo-task-delay-1-month": {
        let status = form.targetTodoTaskStatus;
        if (form.intent === "target-todo-task-mark-done") {
          status = InboxTaskStatus.DONE;
        } else if (form.intent === "target-todo-task-mark-not-done") {
          status = InboxTaskStatus.NOT_DONE;
        } else if (
          form.intent === "target-todo-task-start" ||
          form.intent === "target-todo-task-restart"
        ) {
          status = InboxTaskStatus.IN_PROGRESS;
        } else if (form.intent === "target-todo-task-block") {
          status = InboxTaskStatus.BLOCKED;
        } else if (
          form.intent === "target-todo-task-stop" ||
          form.intent === "target-todo-task-reactivate"
        ) {
          status = InboxTaskStatus.NOT_STARTED;
        }

        let actionableDate = form.targetTodoTaskActionableDate;
        let dueDate = form.targetTodoTaskDueDate;
        if (
          form.intent === "target-todo-task-delay-1-day" ||
          form.intent === "target-todo-task-delay-1-week" ||
          form.intent === "target-todo-task-delay-1-month"
        ) {
          const today = DateTime.now().startOf("day");
          const delay =
            form.intent === "target-todo-task-delay-1-day"
              ? { days: 1 }
              : form.intent === "target-todo-task-delay-1-week"
                ? { weeks: 1 }
                : { months: 1 };
          const newActionableDate = today.plus(delay);
          actionableDate = newActionableDate.toISODate() ?? undefined;
          if (dueDate !== undefined && dueDate !== "") {
            const oldDueDate = DateTime.fromISO(dueDate);
            if (actionableDate !== undefined && actionableDate !== "") {
              const oldActionableDate = DateTime.fromISO(
                form.targetTodoTaskActionableDate ?? actionableDate,
              );
              const gapDays = oldDueDate.diff(oldActionableDate, "days").days;
              dueDate =
                newActionableDate.plus({ days: gapDays }).toISODate() ??
                undefined;
            } else {
              dueDate = actionableDate;
            }
          }
        }

        await apiClient.todo.todoTaskUpdate({
          ref_id: form.targetTodoTaskRefId,
          name: {
            should_change: true,
            value: form.targetTodoTaskName,
          },
          status: {
            should_change: true,
            value: status,
          },
          aspect_ref_id:
            form.targetTodoTaskAspect !== undefined
              ? { should_change: true, value: form.targetTodoTaskAspect }
              : { should_change: false },
          chapter_ref_id:
            form.targetTodoTaskAspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.targetTodoTaskChapter !== undefined &&
                    form.targetTodoTaskChapter !== ""
                      ? form.targetTodoTaskChapter
                      : undefined,
                }
              : { should_change: false },
          goal_ref_id:
            form.targetTodoTaskAspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.targetTodoTaskGoal !== undefined &&
                    form.targetTodoTaskGoal !== ""
                      ? form.targetTodoTaskGoal
                      : undefined,
                }
              : { should_change: false },
          is_key: {
            should_change: true,
            value: form.targetTodoTaskIsKey,
          },
          eisen: {
            should_change: true,
            value: form.targetTodoTaskEisen,
          },
          difficulty: {
            should_change: true,
            value: form.targetTodoTaskDifficulty,
          },
          actionable_date: {
            should_change: true,
            value:
              actionableDate !== undefined && actionableDate !== ""
                ? actionableDate
                : null,
          },
          due_date: {
            should_change: true,
            value: dueDate !== undefined && dueDate !== "" ? dueDate : null,
          },
        });

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${activityId}`,
            timePlanView,
          ),
        );
      }

      case "target-todo-task-create-note": {
        const activityResult = await apiClient.timePlans.timePlanActivityLoad({
          ref_id: activityId,
          allow_archived: true,
        });

        if (activityResult.target_todo_task) {
          await apiClient.notes.noteCreate({
            owner: noteStdOwner(
              NamedEntityTag.TODO_TASK,
              activityResult.target_todo_task.ref_id,
            ),
            content: [],
          });
        }

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${activityId}`,
            timePlanView,
          ),
        );
      }

      case "target-habit-update": {
        await apiClient.habits.habitUpdate({
          ref_id: form.targetHabitRefId,
          name: {
            should_change: true,
            value: form.targetHabitName,
          },
          aspect_ref_id:
            form.targetHabitAspect !== undefined
              ? { should_change: true, value: form.targetHabitAspect }
              : { should_change: false },
          chapter_ref_id:
            form.targetHabitAspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.targetHabitChapter !== undefined &&
                    form.targetHabitChapter !== ""
                      ? form.targetHabitChapter
                      : undefined,
                }
              : { should_change: false },
          goal_ref_id:
            form.targetHabitAspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.targetHabitGoal !== undefined &&
                    form.targetHabitGoal !== ""
                      ? form.targetHabitGoal
                      : undefined,
                }
              : { should_change: false },
          period: {
            should_change: true,
            value: form.targetHabitPeriod,
          },
          is_key: {
            should_change: true,
            value: form.targetHabitIsKey,
          },
          eisen: {
            should_change: true,
            value: form.targetHabitEisen,
          },
          difficulty: {
            should_change: true,
            value: form.targetHabitDifficulty,
          },
          actionable_from_day: {
            should_change: true,
            value:
              form.targetHabitActionableFromDay === undefined ||
              form.targetHabitActionableFromDay === ""
                ? undefined
                : parseInt(form.targetHabitActionableFromDay),
          },
          actionable_from_month: {
            should_change: true,
            value:
              form.targetHabitActionableFromMonth === undefined ||
              form.targetHabitActionableFromMonth === ""
                ? undefined
                : parseInt(form.targetHabitActionableFromMonth),
          },
          due_at_day: {
            should_change: true,
            value:
              form.targetHabitDueAtDay === undefined ||
              form.targetHabitDueAtDay === ""
                ? undefined
                : parseInt(form.targetHabitDueAtDay),
          },
          due_at_month: {
            should_change: true,
            value:
              form.targetHabitDueAtMonth === undefined ||
              form.targetHabitDueAtMonth === ""
                ? undefined
                : parseInt(form.targetHabitDueAtMonth),
          },
          skip_rule: {
            should_change: true,
            value:
              form.targetHabitSkipRule === undefined ||
              form.targetHabitSkipRule === ""
                ? undefined
                : form.targetHabitSkipRule,
          },
          repeats_strategy: {
            should_change: true,
            value:
              form.targetHabitRepeatsStrategy !== undefined &&
              form.targetHabitRepeatsStrategy !== "none"
                ? form.targetHabitRepeatsStrategy
                : undefined,
          },
          repeats_in_period_count: {
            should_change: true,
            value: form.targetHabitRepeatsInPeriodCount
              ? parseInt(form.targetHabitRepeatsInPeriodCount)
              : undefined,
          },
        });

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${activityId}`,
            timePlanView,
          ),
        );
      }

      case "target-habit-create-note": {
        const activityResult = await apiClient.timePlans.timePlanActivityLoad({
          ref_id: activityId,
          allow_archived: true,
        });

        if (activityResult.target_habit) {
          await apiClient.notes.noteCreate({
            owner: noteStdOwner(
              NamedEntityTag.HABIT,
              activityResult.target_habit.ref_id,
            ),
            content: [],
          });
        }

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${activityId}`,
            timePlanView,
          ),
        );
      }

      case "target-habit-gen": {
        const activityResult = await apiClient.timePlans.timePlanActivityLoad({
          ref_id: activityId,
          allow_archived: true,
        });

        if (activityResult.target_habit) {
          await apiClient.habits.habitRegen({
            ref_id: activityResult.target_habit.ref_id,
          });
        }

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${activityId}`,
            timePlanView,
          ),
        );
      }

      case "target-chore-update": {
        await apiClient.chores.choreUpdate({
          ref_id: form.targetChoreRefId,
          name: {
            should_change: true,
            value: form.targetChoreName,
          },
          is_key: {
            should_change: true,
            value: form.targetChoreIsKey,
          },
          aspect_ref_id:
            form.targetChoreAspect !== undefined
              ? { should_change: true, value: form.targetChoreAspect }
              : { should_change: false },
          chapter_ref_id:
            form.targetChoreAspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.targetChoreChapter !== undefined &&
                    form.targetChoreChapter !== ""
                      ? form.targetChoreChapter
                      : undefined,
                }
              : { should_change: false },
          goal_ref_id:
            form.targetChoreAspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.targetChoreGoal !== undefined &&
                    form.targetChoreGoal !== ""
                      ? form.targetChoreGoal
                      : undefined,
                }
              : { should_change: false },
          period: {
            should_change: true,
            value: form.targetChorePeriod,
          },
          eisen: {
            should_change: true,
            value: form.targetChoreEisen,
          },
          difficulty: {
            should_change: true,
            value: form.targetChoreDifficulty,
          },
          actionable_from_day: {
            should_change: true,
            value:
              form.targetChoreActionableFromDay === undefined ||
              form.targetChoreActionableFromDay === ""
                ? undefined
                : parseInt(form.targetChoreActionableFromDay),
          },
          actionable_from_month: {
            should_change: true,
            value:
              form.targetChoreActionableFromMonth === undefined ||
              form.targetChoreActionableFromMonth === ""
                ? undefined
                : parseInt(form.targetChoreActionableFromMonth),
          },
          due_at_day: {
            should_change: true,
            value:
              form.targetChoreDueAtDay === undefined ||
              form.targetChoreDueAtDay === ""
                ? undefined
                : parseInt(form.targetChoreDueAtDay),
          },
          due_at_month: {
            should_change: true,
            value:
              form.targetChoreDueAtMonth === undefined ||
              form.targetChoreDueAtMonth === ""
                ? undefined
                : parseInt(form.targetChoreDueAtMonth),
          },
          must_do: {
            should_change: true,
            value: form.targetChoreMustDo,
          },
          skip_rule: {
            should_change: true,
            value:
              form.targetChoreSkipRule === undefined ||
              form.targetChoreSkipRule === ""
                ? undefined
                : form.targetChoreSkipRule,
          },
          start_at_date: {
            should_change: true,
            value:
              form.targetChoreStartAtDate === undefined ||
              form.targetChoreStartAtDate === ""
                ? undefined
                : form.targetChoreStartAtDate,
          },
          end_at_date: {
            should_change: true,
            value:
              form.targetChoreEndAtDate === undefined ||
              form.targetChoreEndAtDate === ""
                ? undefined
                : form.targetChoreEndAtDate,
          },
        });

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${activityId}`,
            timePlanView,
          ),
        );
      }

      case "target-chore-create-note": {
        const activityResult = await apiClient.timePlans.timePlanActivityLoad({
          ref_id: activityId,
          allow_archived: true,
        });

        if (activityResult.target_chore) {
          await apiClient.notes.noteCreate({
            owner: noteStdOwner(
              NamedEntityTag.CHORE,
              activityResult.target_chore.ref_id,
            ),
            content: [],
          });
        }

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${activityId}`,
            timePlanView,
          ),
        );
      }

      case "target-chore-gen": {
        const activityResult = await apiClient.timePlans.timePlanActivityLoad({
          ref_id: activityId,
          allow_archived: true,
        });

        if (activityResult.target_chore) {
          await apiClient.chores.choreRegen({
            ref_id: activityResult.target_chore.ref_id,
          });
        }

        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${id}/${activityId}`,
            timePlanView,
          ),
        );
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function TimePlanActivity() {
  const { id, activityId } = useParams();
  const [query] = useSearchParams();
  const timePlanView = query.get(TIME_PLAN_VIEW_PARAM);
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const parentLoaderData = useRouteLoaderData<{
    timePlan: TimePlan;
    accessStatus: AccessStatus | null;
  }>("routes/app/workspace/time-plans/$id")!;
  const timePlan = parentLoaderData.timePlan;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const inputsEnabled =
    navigation.state === "idle" &&
    !loaderData.timePlanActivity.archived &&
    accessStatusAllowsWriterOrAbove(parentLoaderData.accessStatus);

  const sortedBigPlanInboxTasks = sortInboxTasksNaturally(
    loaderData.targetBigPlanInfo?.inbox_tasks ?? [],
    { dueDateAscending: false },
  );

  const cardActionFetcher = useFetcher();

  const sortedHabitInboxTasks = sortInboxTasksNaturally(
    loaderData.targetHabitInfo?.inbox_tasks ?? [],
    { dueDateAscending: false },
  );

  const sortedChoreInboxTasks = sortInboxTasksNaturally(
    loaderData.targetChoreInfo?.inbox_tasks ?? [],
    { dueDateAscending: false },
  );

  function handleHabitCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      { id: it.ref_id, status: InboxTaskStatus.DONE },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleChoreCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      { id: it.ref_id, status: InboxTaskStatus.DONE },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleBigPlanCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      { id: it.ref_id, status: InboxTaskStatus.DONE },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleBigPlanCardMarkNotDone(it: InboxTask) {
    cardActionFetcher.submit(
      { id: it.ref_id, status: InboxTaskStatus.NOT_DONE },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleHabitCardMarkNotDone(it: InboxTask) {
    cardActionFetcher.submit(
      { id: it.ref_id, status: InboxTaskStatus.NOT_DONE },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleChoreCardMarkNotDone(it: InboxTask) {
    cardActionFetcher.submit(
      { id: it.ref_id, status: InboxTaskStatus.NOT_DONE },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  const activityTimeEventEntries = (
    loaderData.activityTimeEventBlocks || []
  ).map((block) => ({
    time_event_in_tz: timeEventInDayBlockToTimezone(
      block,
      topLevelInfo.user.timezone,
    ),
    entry: {
      time_plan_activity: loaderData.timePlanActivity,
      target_inbox_task: loaderData.targetInboxTask,
      target_big_plan: loaderData.targetBigPlan,
      target_todo_task: loaderData.targetTodoTask,
      target_habit: loaderData.targetHabit,
      target_chore: loaderData.targetChore,
      time_events: [block],
    },
  }));
  const sortedActivityTimeEventEntries = sortInboxTaskTimeEventsNaturally(
    activityTimeEventEntries,
  );

  let newActivityTimeEventLocation: string | undefined = undefined;
  if (
    timePlan.period === RecurringTaskPeriod.DAILY ||
    timePlan.period === RecurringTaskPeriod.WEEKLY
  ) {
    const params = new URLSearchParams({
      date: timePlan.start_date,
      period: timePlan.period,
      view: "calendar",
      timePlanActivityRefId: activityId as string,
      timePlanRefId: id as string,
    });
    if (timePlanView !== null) {
      params.set(TIME_PLAN_VIEW_PARAM, timePlanView);
    }
    newActivityTimeEventLocation = `/app/workspace/calendar/time-event/in-day-block/new-for-time-plan-activity?${params.toString()}`;
  }

  return (
    <LeafPanel
      key={`time-plan-${id}/activity-${activityId}`}
      entityType={NamedEntityTag.TIME_PLAN_ACTIVITY}
      entityRefId={loaderData.timePlanActivity.ref_id}
      fakeKey={`time-plan-${id}/activity-${activityId}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.timePlanActivity.archived}
      returnLocation={withTimePlanView(
        `/app/workspace/time-plans/${id}`,
        timePlanView,
      )}
      initialExpansionState={LeafPanelExpansionState.MEDIUM}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="time-plan-activity-properties"
        title="Properties"
        actions={
          <SectionActions
            id="time-plan-activity-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Save",
                value: "update",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <Stack
          spacing={2}
          useFlexGap
          direction={isBigScreen ? "row" : "column"}
        >
          <FormControl fullWidth>
            <FormLabel id="kind">Kind</FormLabel>
            <TimePlanActivitKindSelect
              name="kind"
              defaultValue={loaderData.timePlanActivity.kind}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/kind" />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="feasability">Feasability</FormLabel>
            <TimePlanActivityFeasabilitySelect
              name="feasability"
              defaultValue={loaderData.timePlanActivity.feasability}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/feasability" />
          </FormControl>
        </Stack>
      </SectionCard>

      {loaderData.targetInboxTask && loaderData.targetInboxTaskInfo && (
        <>
          <InboxTaskPropertiesEditor
            title="Inbox Task"
            showLinkToInboxTask
            intentPrefix="target-inbox-task"
            namePrefix="targetInboxTask"
            topLevelInfo={topLevelInfo}
            inputsEnabled={
              inputsEnabled && !loaderData.targetInboxTask.archived
            }
            inboxTask={loaderData.targetInboxTask}
            inboxTaskInfo={loaderData.targetInboxTaskInfo}
            actionData={actionData}
          />
        </>
      )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.BIG_PLANS,
      ) &&
        loaderData.targetBigPlan &&
        loaderData.targetBigPlanInfo && (
          <>
            <BigPlanPropertiesEditor
              title="Big Plan"
              showLinkToBigPlan
              intentPrefix="target-big-plan"
              namePrefix="targetBigPlan"
              topLevelInfo={topLevelInfo}
              lifePlan={loaderData.lifePlan}
              allAspects={loaderData.allAspects ?? []}
              allChapters={loaderData.allChapters ?? []}
              allGoals={loaderData.allGoals ?? []}
              allMilestones={loaderData.allMilestones ?? []}
              inputsEnabled={
                inputsEnabled && !loaderData.targetBigPlan.archived
              }
              entityOwner={loaderData.targetBigPlanInfo.owner}
              bigPlan={loaderData.targetBigPlan}
              bigPlanInfo={loaderData.targetBigPlanInfo}
              actionData={actionData}
            />

            <SectionCard
              title="Note"
              actions={
                <SectionActions
                  id="target-big-plan-note"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    ActionSingle({
                      text: "Create",
                      value: "target-big-plan-create-note",
                      highlight: false,
                      disabled:
                        loaderData.targetBigPlanInfo.note !== null &&
                        loaderData.targetBigPlanInfo.note !== undefined,
                    }),
                  ]}
                />
              }
            >
              {loaderData.targetBigPlanInfo.note && (
                <EntityNoteEditor
                  initialNote={loaderData.targetBigPlanInfo.note}
                  inputsEnabled={inputsEnabled}
                />
              )}
            </SectionCard>

            <SectionCard
              id="target-big-plan-inbox-tasks"
              title="Inbox Tasks"
              actions={
                <SectionActions
                  id="target-big-plan-inbox-tasks"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    NavMultipleSpread({
                      navs: [
                        ...(timePlanAllowsInboxTasks(timePlan)
                          ? [
                              NavSingle({
                                text: "New Inbox Task",
                                link: withTimePlanView(
                                  `/app/workspace/big-plans/${loaderData.targetBigPlan.ref_id}/inbox-tasks/new?timePlanReason=for-time-plan&timePlanRefId=${id}&parentTimePlanActivityRefId=${activityId}`,
                                  timePlanView,
                                ),
                                highlight: true,
                              }),
                              NavSingle({
                                text: "From Big Plan Inbox Tasks",
                                link: withTimePlanView(
                                  `/app/workspace/time-plans/${id}/add-from-big-plan-inbox-tasks?bigPlanRefId=${loaderData.targetBigPlan.ref_id}&timePlanActivityRefId=${activityId}`,
                                  timePlanView,
                                ),
                              }),
                            ]
                          : []),
                      ],
                    }),
                  ]}
                />
              }
            >
              {sortedBigPlanInboxTasks.length > 0 && (
                <InboxTaskStack
                  topLevelInfo={topLevelInfo}
                  showOptions={{
                    showStatus: true,
                    showEisen: true,
                    showDifficulty: true,
                    showActionableDate: true,
                    showDueDate: true,
                    showHandleMarkDone: true,
                    showHandleMarkNotDone: true,
                  }}
                  inboxTasks={sortedBigPlanInboxTasks}
                  onCardMarkDone={handleBigPlanCardMarkDone}
                  onCardMarkNotDone={handleBigPlanCardMarkNotDone}
                />
              )}
            </SectionCard>
          </>
        )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.TODO_TASK,
      ) &&
        loaderData.targetTodoTask &&
        loaderData.targetTodoTaskInfo && (
          <>
            <TodoTaskPropertiesEditor
              title="Todo"
              showLinkToTodoTask
              intentPrefix="target-todo-task"
              namePrefix="targetTodoTask"
              topLevelInfo={topLevelInfo}
              lifePlan={loaderData.lifePlan}
              allAspects={loaderData.allAspects ?? []}
              allChapters={loaderData.allChapters ?? []}
              allGoals={loaderData.allGoals ?? []}
              allMilestones={loaderData.allMilestones ?? []}
              aspect={loaderData.targetTodoTaskInfo.aspect}
              chapter={loaderData.targetTodoTaskInfo.chapter}
              goal={loaderData.targetTodoTaskInfo.goal}
              allTags={loaderData.allTags ?? []}
              tags={loaderData.targetTodoTaskInfo.tags}
              allContacts={loaderData.allContacts ?? []}
              contacts={loaderData.targetTodoTaskInfo.contacts}
              inputsEnabled={
                inputsEnabled && !loaderData.targetTodoTask.archived
              }
              entityOwner={loaderData.targetTodoTaskInfo.owner}
              todoTask={loaderData.targetTodoTask}
              inboxTask={loaderData.targetTodoTaskInfo.inbox_task}
              actionData={actionData}
            />

            <SectionCard
              title="Note"
              actions={
                <SectionActions
                  id="target-todo-task-note"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    ActionSingle({
                      text: "Create",
                      value: "target-todo-task-create-note",
                      highlight: false,
                      disabled:
                        loaderData.targetTodoTaskInfo.note !== null &&
                        loaderData.targetTodoTaskInfo.note !== undefined,
                    }),
                  ]}
                />
              }
            >
              {loaderData.targetTodoTaskInfo.note && (
                <EntityNoteEditor
                  initialNote={loaderData.targetTodoTaskInfo.note}
                  inputsEnabled={inputsEnabled}
                />
              )}
            </SectionCard>
          </>
        )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.HABITS,
      ) &&
        loaderData.targetHabit &&
        loaderData.targetHabitInfo && (
          <>
            <HabitPropertiesEditor
              title="Habit"
              showLinkToHabit
              showGen
              intentPrefix="target-habit"
              namePrefix="targetHabit"
              topLevelInfo={topLevelInfo}
              lifePlan={loaderData.lifePlan}
              allAspects={loaderData.allAspects ?? []}
              allChapters={loaderData.allChapters ?? []}
              allGoals={loaderData.allGoals ?? []}
              allMilestones={loaderData.allMilestones ?? []}
              allTags={loaderData.allTags ?? []}
              tags={loaderData.targetHabitInfo.tags}
              allContacts={loaderData.allContacts ?? []}
              contacts={loaderData.targetHabitInfo.contacts}
              inputsEnabled={inputsEnabled && !loaderData.targetHabit.archived}
              entityOwner={loaderData.targetHabitInfo.owner}
              habit={loaderData.targetHabit}
              aspect={loaderData.targetHabitInfo.aspect}
              chapter={loaderData.targetHabitInfo.chapter}
              goal={loaderData.targetHabitInfo.goal}
              actionData={actionData}
            />

            <SectionCard
              title="Note"
              actions={
                <SectionActions
                  id="target-habit-note"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    ActionSingle({
                      text: "Create",
                      value: "target-habit-create-note",
                      highlight: false,
                      disabled:
                        loaderData.targetHabitInfo.note !== null &&
                        loaderData.targetHabitInfo.note !== undefined,
                    }),
                  ]}
                />
              }
            >
              {loaderData.targetHabitInfo.note && (
                <EntityNoteEditor
                  initialNote={loaderData.targetHabitInfo.note}
                  inputsEnabled={inputsEnabled}
                />
              )}
            </SectionCard>

            <SectionCard
              id="target-habit-inbox-tasks"
              title="Inbox Tasks"
              actions={
                <SectionActions
                  id="target-habit-inbox-tasks"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    ...(timePlanAllowsInboxTasks(timePlan)
                      ? [
                          NavMultipleSpread({
                            navs: [
                              NavSingle({
                                text: "From Habit Inbox Tasks",
                                link: withTimePlanView(
                                  `/app/workspace/time-plans/${id}/add-from-habit-inbox-tasks?habitRefId=${loaderData.targetHabit.ref_id}&timePlanActivityRefId=${activityId}`,
                                  timePlanView,
                                ),
                              }),
                            ],
                          }),
                        ]
                      : []),
                  ]}
                />
              }
            >
              {sortedHabitInboxTasks.length > 0 && (
                <InboxTaskStack
                  topLevelInfo={topLevelInfo}
                  showOptions={{
                    showStatus: true,
                    showDueDate: true,
                    showHandleMarkDone: true,
                    showHandleMarkNotDone: true,
                  }}
                  inputsEnabled={inputsEnabled}
                  inboxTasks={sortedHabitInboxTasks}
                  onCardMarkDone={handleHabitCardMarkDone}
                  onCardMarkNotDone={handleHabitCardMarkNotDone}
                />
              )}
            </SectionCard>
          </>
        )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.CHORES,
      ) &&
        loaderData.targetChore &&
        loaderData.targetChoreInfo && (
          <>
            <ChorePropertiesEditor
              title="Chore"
              showLinkToChore
              showGen
              intentPrefix="target-chore"
              namePrefix="targetChore"
              topLevelInfo={topLevelInfo}
              lifePlan={loaderData.lifePlan}
              allAspects={loaderData.allAspects ?? []}
              allChapters={loaderData.allChapters ?? []}
              allGoals={loaderData.allGoals ?? []}
              allMilestones={loaderData.allMilestones ?? []}
              allTags={loaderData.allTags ?? []}
              tags={loaderData.targetChoreInfo.tags}
              allContacts={loaderData.allContacts ?? []}
              contacts={loaderData.targetChoreInfo.contacts}
              inputsEnabled={inputsEnabled && !loaderData.targetChore.archived}
              entityOwner={loaderData.targetChoreInfo.owner}
              chore={loaderData.targetChore}
              aspect={loaderData.targetChoreInfo.aspect}
              chapter={loaderData.targetChoreInfo.chapter}
              goal={loaderData.targetChoreInfo.goal}
              actionData={actionData}
            />

            <SectionCard
              title="Note"
              actions={
                <SectionActions
                  id="target-chore-note"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    ActionSingle({
                      text: "Create",
                      value: "target-chore-create-note",
                      highlight: false,
                      disabled:
                        loaderData.targetChoreInfo.note !== null &&
                        loaderData.targetChoreInfo.note !== undefined,
                    }),
                  ]}
                />
              }
            >
              {loaderData.targetChoreInfo.note && (
                <EntityNoteEditor
                  initialNote={loaderData.targetChoreInfo.note}
                  inputsEnabled={inputsEnabled}
                />
              )}
            </SectionCard>

            <SectionCard
              id="target-chore-inbox-tasks"
              title="Inbox Tasks"
              actions={
                <SectionActions
                  id="target-chore-inbox-tasks"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    ...(timePlanAllowsInboxTasks(timePlan)
                      ? [
                          NavMultipleSpread({
                            navs: [
                              NavSingle({
                                text: "From Chore Inbox Tasks",
                                link: withTimePlanView(
                                  `/app/workspace/time-plans/${id}/add-from-chore-inbox-tasks?choreRefId=${loaderData.targetChore.ref_id}&timePlanActivityRefId=${activityId}`,
                                  timePlanView,
                                ),
                              }),
                            ],
                          }),
                        ]
                      : []),
                  ]}
                />
              }
            >
              {sortedChoreInboxTasks.length > 0 && (
                <InboxTaskStack
                  topLevelInfo={topLevelInfo}
                  showOptions={{
                    showStatus: true,
                    showDueDate: true,
                    showHandleMarkDone: true,
                    showHandleMarkNotDone: true,
                  }}
                  inputsEnabled={inputsEnabled}
                  inboxTasks={sortedChoreInboxTasks}
                  onCardMarkDone={handleChoreCardMarkDone}
                  onCardMarkNotDone={handleChoreCardMarkNotDone}
                />
              )}
            </SectionCard>
          </>
        )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.SCHEDULE,
      ) && (
        <TimeEventInDayBlockStack
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          title="Activity Time Events"
          createLocation={newActivityTimeEventLocation}
          entries={sortedActivityTimeEventEntries}
        />
      )}
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/time-plans",
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find activity ${params.activityId} in time plan ${params.id}!`,
    error: (params) =>
      `There was an error loading activity ${params.activityId} in time plan ${params.id}! Please try again!`,
  },
);
