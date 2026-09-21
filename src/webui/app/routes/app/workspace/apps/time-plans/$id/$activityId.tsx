import type {
  AccessStatus,
  AspectSummary,
  BigPlanSummary,
  ChapterSummary,
  Chore,
  ChoreStack,
  Contact,
  Habit,
  HabitStack,
  GoalSummary,
  InboxTask,
  LifePlan,
  MilestoneSummary,
  Tag,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  Note,
} from "@jupiter/webapi-client";
import {
  NamedEntityTag,
  InboxTaskStatus,
  RecurringTaskPeriod,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { FormControl, FormLabel, Stack } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useNavigate,
  useNavigation,
  useParams,
  useRouteLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useContext, useMemo, useState } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { TodoTaskPropertiesEditor } from "@jupiter/core/apps/todo/components/properties-editor";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockToTimezone,
} from "@jupiter/core/common/sub/time_events/time-event";
import { TIME_PLAN_ACTIVITY_TIME_EVENT_PARAM } from "@jupiter/core/calendar/component/calendar-navigation";
import {
  sortInboxTasksNaturally,
  type InboxTaskParent,
} from "#/core/common/sub/inbox_tasks/root";
import { BigPlanPropertiesEditor } from "@jupiter/core/apps/big_plans/component/properties-editor";
import { HabitPropertiesEditor } from "@jupiter/core/apps/habits/component/properties-editor";
import { HabitStackPropertiesEditor } from "@jupiter/core/apps/habits/component/stack-properties-editor";
import { sortHabitsNaturally } from "@jupiter/core/apps/habits/root";
import { ChoreStackPropertiesEditor } from "@jupiter/core/apps/chores/component/stack-properties-editor";
import { sortChoresNaturally } from "@jupiter/core/apps/chores/root";
import { PeriodTag } from "@jupiter/core/common/component/period-tag";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { entityLinkRefIdFromWire } from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";
import {
  choreActivitiesForStackMembers,
  habitActivitiesForStackMembers,
} from "@jupiter/core/apps/time_plans/sub/activity/habit-chore-group";
import { ChorePropertiesEditor } from "@jupiter/core/apps/chores/component/properties-editor";
import { InboxTaskPropertiesEditor } from "@jupiter/core/common/sub/inbox_tasks/component/properties-editor";
import { InboxTaskStack } from "@jupiter/core/common/sub/inbox_tasks/component/stack";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { withTimePlanView } from "@jupiter/core/apps/time_plans/view-mode";
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
import { TimeEventInDayBlockPropertiesEditor } from "@jupiter/core/common/sub/time_events/sub/in_day_block/component/properties-editor";
import { TimeEventInDayBlockStack } from "@jupiter/core/common/sub/time_events/sub/in_day_block/component/stack";
import { timePlanActivityTargetNameForEvent } from "@jupiter/core/apps/time_plans/sub/activity/root";
import { timePlanAllowsInboxTasks } from "@jupiter/core/apps/time_plans/root";
import { TimePlanActivityFeasabilitySelect } from "@jupiter/core/apps/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "@jupiter/core/apps/time_plans/sub/activity/component/kind-select";
import { useTimePlanStore } from "@jupiter/core/apps/time_plans/store/context";
import { useTimePlanMutation } from "@jupiter/core/apps/time_plans/store/mutation";
import {
  UPDATE_TIME_PLAN_ACTIVITY,
  updateTimePlanActivityArgsFromForm,
} from "@jupiter/core/apps/time_plans/store/mutations/update-activity";
import {
  UPDATE_INBOX_TASK,
  updateInboxTaskArgsFromForm,
} from "@jupiter/core/apps/time_plans/store/mutations/update-inbox-task";
import {
  UPDATE_TODO_TASK,
  updateTodoTaskArgsFromForm,
} from "@jupiter/core/apps/time_plans/store/mutations/update-todo-task";
import {
  UPDATE_BIG_PLAN,
  updateBigPlanArgsFromForm,
} from "@jupiter/core/apps/time_plans/store/mutations/update-big-plan";
import {
  UPDATE_HABIT,
  updateHabitArgsFromForm,
} from "@jupiter/core/apps/time_plans/store/mutations/update-habit";
import {
  UPDATE_HABIT_STACK,
  updateHabitStackArgsFromForm,
} from "@jupiter/core/apps/time_plans/store/mutations/update-habit-stack";
import {
  UPDATE_CHORE,
  updateChoreArgsFromForm,
} from "@jupiter/core/apps/time_plans/store/mutations/update-chore";
import {
  UPDATE_CHORE_STACK,
  updateChoreStackArgsFromForm,
} from "@jupiter/core/apps/time_plans/store/mutations/update-chore-stack";
import {
  ARCHIVE_TIME_PLAN_ACTIVITY,
  REMOVE_TIME_PLAN_ACTIVITY,
} from "@jupiter/core/apps/time_plans/store/mutations/archive-activity";
import {
  CREATE_NOTE,
  createdNoteKey,
} from "@jupiter/core/apps/time_plans/store/mutations/create-note";
import {
  ARCHIVE_TIME_EVENT,
  UPDATE_TIME_EVENT,
  archiveTimeEventArgsFromForm,
  updateTimeEventArgsFromForm,
} from "@jupiter/core/apps/time_plans/store/mutations/time-event";
import { UPDATE_INBOX_TASK_STATUS } from "@jupiter/core/apps/time_plans/store/mutations/update-inbox-task-status";
import {
  choreEditChangesGeneration,
  habitEditChangesGeneration,
} from "@jupiter/core/apps/time_plans/store/regen";
import { useRegen } from "@jupiter/core/apps/time_plans/store/regen-offer";
import { BIG_PLAN_STATUS_INTENTS } from "@jupiter/core/apps/big_plans/intents";
import {
  INBOX_TASK_DELAY_INTENTS,
  INBOX_TASK_STATUS_INTENTS,
} from "@jupiter/core/common/sub/inbox_tasks/intents";
import type { IntentHandler } from "@jupiter/core/infra/component/intent-interceptor";
import {
  latestEntities,
  latestEntity,
  latestEntityOrNull,
  selectTimePlanView,
} from "@jupiter/core/apps/time_plans/store/view";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { accessStatusAllowsWriterOrAbove } from "#/core/common/sub/access/access-level";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";
import { ignoringTimePlanQueryChanges } from "@jupiter/core/apps/time_plans/should-revalidate";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
  activityId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { activityId } = parseParams(params, ParamsSchema);

  try {
    // The time plan's own loader already has the summaries, tags, contacts and
    // the lists the editors pick from, plus the activity with its target; this
    // only gets what the panel adds on top.
    const result = await apiClient.timePlans.timePlanActivityLoadForPanel({
      ref_id: activityId,
      allow_archived: true,
    });

    return json({
      timePlanActivity: result.time_plan_activity,
      targetInboxTask: result.target_inbox_task,
      targetInboxTaskInfo: result.target_inbox_task_info,
      targetBigPlan: result.target_big_plan,
      targetBigPlanInfo: result.target_big_plan_info,
      targetTodoTask: result.target_todo_task,
      targetTodoTaskInfo: result.target_todo_task_info,
      targetHabit: result.target_habit,
      targetHabitInfo: result.target_habit_info,
      targetHabitStack: result.target_habit_stack,
      targetHabitStackInfo: result.target_habit_stack_info,
      targetChore: result.target_chore,
      targetChoreInfo: result.target_chore_info,
      targetChoreStack: result.target_chore_stack,
      targetChoreStackInfo: result.target_chore_stack_info,
      stackInboxTasks: result.target_habit_stack
        ? result.stack_inbox_tasks
        : [],
      choreStackInboxTasks: result.target_chore_stack
        ? result.stack_inbox_tasks
        : [],
      activityTimeEventBlocks: result.time_event_blocks,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

// The loader keys off the activity id alone, so nothing that only moves
// through the query string - the view, the grouping, which event on the
// calendar opened this - is a reason to load the panel again. The time plan
// around it, and the list of plans around that, skip them the same way.
export const shouldRevalidate: ShouldRevalidateFunction =
  ignoringTimePlanQueryChanges(standardShouldRevalidate);

export default function TimePlanActivity() {
  const { id, activityId } = useParams();
  const [query] = useSearchParams();
  const timePlanView = query;
  const rawLoaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const rawParentLoaderData = useRouteLoaderData<{
    timePlan: TimePlan;
    accessStatus: AccessStatus | null;
    activities: TimePlanActivity[];
    activityTimeEventBlocks: TimeEventInDayBlock[];
    lifePlan: LifePlan;
    allAspects?: AspectSummary[] | null;
    allChapters?: ChapterSummary[] | null;
    allGoals?: GoalSummary[] | null;
    allMilestones?: MilestoneSummary[] | null;
    allBigPlans?: BigPlanSummary[] | null;
    allTags: Tag[];
    allContacts: Contact[];
    allStacks: HabitStack[];
    allChoreStacks: ChoreStack[];
    allHabits: Habit[];
    allChores: Chore[];
  }>("routes/app/workspace/apps/time-plans/$id")!;
  const { entities } = useTimePlanStore();
  const planView = useMemo(
    () => selectTimePlanView(entities, rawParentLoaderData.timePlan),
    [entities, rawParentLoaderData.timePlan],
  );
  // The entities come from the time plan store, so they reflect local edits.
  // The store might not hold them any more while the panel animates away, so
  // the loader's copies are the fallback.
  const parentLoaderData = {
    ...rawParentLoaderData,
    activities: planView.activities,
    activityTimeEventBlocks: planView.activityTimeEventBlocks,
  };
  const {
    targetBigPlanInfo,
    targetTodoTaskInfo,
    targetHabitInfo,
    targetHabitStackInfo,
    targetChoreInfo,
    targetChoreStackInfo,
  } = rawLoaderData;
  const loaderData = {
    ...rawLoaderData,
    lifePlan: rawParentLoaderData.lifePlan,
    allAspects: rawParentLoaderData.allAspects,
    allChapters: rawParentLoaderData.allChapters,
    allGoals: rawParentLoaderData.allGoals,
    allMilestones: rawParentLoaderData.allMilestones,
    allBigPlans: rawParentLoaderData.allBigPlans,
    allTags: rawParentLoaderData.allTags,
    allContacts: rawParentLoaderData.allContacts,
    allStacks: rawParentLoaderData.allStacks,
    allChoreStacks: rawParentLoaderData.allChoreStacks,
    allHabits: rawParentLoaderData.allHabits,
    allChores: rawParentLoaderData.allChores,
    timePlanActivity: latestEntity(
      entities.activities,
      rawLoaderData.timePlanActivity,
    ),
    targetInboxTask: latestEntityOrNull(
      entities.inboxTasks,
      rawLoaderData.targetInboxTask,
    ),
    targetBigPlan: latestEntityOrNull(
      entities.bigPlans,
      rawLoaderData.targetBigPlan,
    ),
    targetBigPlanInfo: targetBigPlanInfo && {
      ...targetBigPlanInfo,
      inbox_tasks: latestEntities(
        entities.inboxTasks,
        targetBigPlanInfo.inbox_tasks,
      ),
    },
    targetTodoTask: latestEntityOrNull(
      entities.todoTasks,
      rawLoaderData.targetTodoTask,
    ),
    targetTodoTaskInfo: targetTodoTaskInfo && {
      ...targetTodoTaskInfo,
      inbox_task: latestEntity(
        entities.inboxTasks,
        targetTodoTaskInfo.inbox_task,
      ),
    },
    targetHabit: latestEntityOrNull(entities.habits, rawLoaderData.targetHabit),
    targetHabitInfo: targetHabitInfo && {
      ...targetHabitInfo,
      stack: latestEntityOrNull(entities.habitStacks, targetHabitInfo.stack),
      inbox_tasks: latestEntities(
        entities.inboxTasks,
        targetHabitInfo.inbox_tasks,
      ),
    },
    targetHabitStack: latestEntityOrNull(
      entities.habitStacks,
      rawLoaderData.targetHabitStack,
    ),
    targetHabitStackInfo: targetHabitStackInfo && {
      ...targetHabitStackInfo,
      habits: latestEntities(entities.habits, targetHabitStackInfo.habits),
    },
    targetChore: latestEntityOrNull(entities.chores, rawLoaderData.targetChore),
    targetChoreInfo: targetChoreInfo && {
      ...targetChoreInfo,
      stack: latestEntityOrNull(entities.choreStacks, targetChoreInfo.stack),
      inbox_tasks: latestEntities(
        entities.inboxTasks,
        targetChoreInfo.inbox_tasks,
      ),
    },
    targetChoreStack: latestEntityOrNull(
      entities.choreStacks,
      rawLoaderData.targetChoreStack,
    ),
    targetChoreStackInfo: targetChoreStackInfo && {
      ...targetChoreStackInfo,
      chores: latestEntities(entities.chores, targetChoreStackInfo.chores),
    },
    stackInboxTasks: latestEntities(
      entities.inboxTasks,
      rawLoaderData.stackInboxTasks,
    ),
    choreStackInboxTasks: latestEntities(
      entities.inboxTasks,
      rawLoaderData.choreStackInboxTasks,
    ),
    activityTimeEventBlocks: latestEntities(
      entities.timeEventBlocks,
      rawLoaderData.activityTimeEventBlocks,
    ),
  };
  const timePlan = parentLoaderData.timePlan;

  const topLevelInfo = useContext(TopLevelInfoContext);

  // Saving the properties of the activity or of what it targets is a local
  // edit: it shows up in the plan right away, and going back to the plan
  // doesn't reload it.
  const navigate = useNavigate();
  const { run: runUpdateActivity } = useTimePlanMutation(
    UPDATE_TIME_PLAN_ACTIVITY,
  );
  const { run: runUpdateInboxTask } = useTimePlanMutation(UPDATE_INBOX_TASK);
  const { run: runUpdateTodoTask } = useTimePlanMutation(UPDATE_TODO_TASK);
  const { run: runUpdateBigPlan } = useTimePlanMutation(UPDATE_BIG_PLAN);
  const { runForResult: runUpdateHabit } = useTimePlanMutation(UPDATE_HABIT);
  const { run: runUpdateHabitStack } = useTimePlanMutation(UPDATE_HABIT_STACK);
  const { runForResult: runUpdateChore } = useTimePlanMutation(UPDATE_CHORE);
  // Regen reloads the view. Saving a habit or chore in a way that changes what
  // it generates offers one, since its current tasks keep the old settings.
  const { regen, offerRegen } = useRegen();
  const { run: runUpdateChoreStack } = useTimePlanMutation(UPDATE_CHORE_STACK);
  const { run: runArchiveActivity } = useTimePlanMutation(
    ARCHIVE_TIME_PLAN_ACTIVITY,
  );
  const { run: runRemoveActivity } = useTimePlanMutation(
    REMOVE_TIME_PLAN_ACTIVITY,
  );
  const { run: runUpdateTimeEvent } = useTimePlanMutation(UPDATE_TIME_EVENT);
  const { run: runArchiveTimeEvent } = useTimePlanMutation(ARCHIVE_TIME_EVENT);
  // Creating a note shows its editor right away; the notes made here are
  // kept until the panel loads them itself.
  const { runForResult: runCreateNote } = useTimePlanMutation(CREATE_NOTE);
  const [createdNotes, setCreatedNotes] = useState<Record<string, Note>>({});
  const targetBigPlanNote =
    loaderData.targetBigPlanInfo?.note ??
    (loaderData.targetBigPlan
      ? createdNotes[
          createdNoteKey(
            NamedEntityTag.BIG_PLAN,
            loaderData.targetBigPlan.ref_id,
          )
        ]
      : undefined) ??
    null;
  const targetTodoTaskNote =
    loaderData.targetTodoTaskInfo?.note ??
    (loaderData.targetTodoTask
      ? createdNotes[
          createdNoteKey(
            NamedEntityTag.TODO_TASK,
            loaderData.targetTodoTask.ref_id,
          )
        ]
      : undefined) ??
    null;
  const targetHabitNote =
    loaderData.targetHabitInfo?.note ??
    (loaderData.targetHabit
      ? createdNotes[
          createdNoteKey(NamedEntityTag.HABIT, loaderData.targetHabit.ref_id)
        ]
      : undefined) ??
    null;
  const targetHabitStackNote =
    loaderData.targetHabitStackInfo?.note ??
    (loaderData.targetHabitStack
      ? createdNotes[
          createdNoteKey(
            NamedEntityTag.HABIT_STACK,
            loaderData.targetHabitStack.ref_id,
          )
        ]
      : undefined) ??
    null;
  const targetChoreStackNote =
    loaderData.targetChoreStackInfo?.note ??
    (loaderData.targetChoreStack
      ? createdNotes[
          createdNoteKey(
            NamedEntityTag.CHORE_STACK,
            loaderData.targetChoreStack.ref_id,
          )
        ]
      : undefined) ??
    null;
  const targetChoreNote =
    loaderData.targetChoreInfo?.note ??
    (loaderData.targetChore
      ? createdNotes[
          createdNoteKey(NamedEntityTag.CHORE, loaderData.targetChore.ref_id)
        ]
      : undefined) ??
    null;
  const targetInboxTask = loaderData.targetInboxTask;
  const targetTodoTask = loaderData.targetTodoTask;
  const targetTodoInboxTask = loaderData.targetTodoTaskInfo?.inbox_task ?? null;
  const targetHabit = loaderData.targetHabit;
  const targetChore = loaderData.targetChore;
  const hasTargetBigPlan = Boolean(loaderData.targetBigPlan);
  const activityTarget = loaderData.timePlanActivity.target;
  const intentHandlers = useMemo(() => {
    const timePlanLocation = withTimePlanView(
      `/app/workspace/apps/time-plans/${id}`,
      timePlanView,
    );
    const handlers: Record<string, IntentHandler> = {
      update: (formData) => {
        runUpdateActivity(
          updateTimePlanActivityArgsFromForm(activityId as string, formData),
        );
        navigate(timePlanLocation);
      },
    };
    if (targetInboxTask) {
      for (const intent of [
        ...INBOX_TASK_STATUS_INTENTS,
        ...INBOX_TASK_DELAY_INTENTS,
      ]) {
        handlers[`target-inbox-task-${intent}`] = (formData) => {
          runUpdateInboxTask(
            updateInboxTaskArgsFromForm(
              intent,
              formData,
              targetInboxTask,
              topLevelInfo.today,
              new Date().toISOString(),
              "targetInboxTask",
            ),
          );
          navigate(timePlanLocation);
        };
      }
    }
    if (targetTodoTask && targetTodoInboxTask) {
      for (const intent of [
        ...INBOX_TASK_STATUS_INTENTS,
        ...INBOX_TASK_DELAY_INTENTS,
      ]) {
        handlers[`target-todo-task-${intent}`] = (formData) => {
          runUpdateTodoTask(
            updateTodoTaskArgsFromForm(
              intent,
              formData,
              { todoTask: targetTodoTask, inboxTask: targetTodoInboxTask },
              topLevelInfo.today,
              new Date().toISOString(),
              "targetTodoTask",
            ),
          );
          navigate(timePlanLocation);
        };
      }
    }
    if (hasTargetBigPlan) {
      for (const intent of BIG_PLAN_STATUS_INTENTS) {
        handlers[`target-big-plan-${intent}`] = (formData) => {
          runUpdateBigPlan(
            updateBigPlanArgsFromForm(
              intent,
              formData,
              new Date().toISOString(),
              "targetBigPlan",
            ),
          );
          navigate(timePlanLocation);
        };
      }
    }
    const modifiedTime = () => new Date().toISOString();
    handlers["target-habit-update"] = (formData) => {
      const args = updateHabitArgsFromForm(
        formData,
        modifiedTime(),
        "targetHabit",
      );
      const changesGeneration =
        targetHabit !== null &&
        targetHabit !== undefined &&
        habitEditChangesGeneration(targetHabit, args);
      void runUpdateHabit(args).then((result) => {
        if (result !== null && changesGeneration) {
          offerRegen("habit", args.refId, args.name);
        }
      });
      navigate(timePlanLocation);
    };
    handlers["target-habit-gen"] = () => {
      if (targetHabit) {
        void regen("habit", targetHabit.ref_id);
      }
    };
    handlers["target-habit-stack-update"] = (formData) => {
      runUpdateHabitStack(
        updateHabitStackArgsFromForm(
          formData,
          modifiedTime(),
          "targetHabitStack",
        ),
      );
      navigate(timePlanLocation);
    };
    handlers["target-chore-update"] = (formData) => {
      const args = updateChoreArgsFromForm(
        formData,
        modifiedTime(),
        "targetChore",
      );
      const changesGeneration =
        targetChore !== null &&
        targetChore !== undefined &&
        choreEditChangesGeneration(targetChore, args);
      void runUpdateChore(args).then((result) => {
        if (result !== null && changesGeneration) {
          offerRegen("chore", args.refId, args.name);
        }
      });
      navigate(timePlanLocation);
    };
    handlers["target-chore-gen"] = () => {
      if (targetChore) {
        void regen("chore", targetChore.ref_id);
      }
    };
    handlers["target-chore-stack-update"] = (formData) => {
      runUpdateChoreStack(
        updateChoreStackArgsFromForm(
          formData,
          modifiedTime(),
          "targetChoreStack",
        ),
      );
      navigate(timePlanLocation);
    };
    handlers["archive"] = () => {
      runArchiveActivity({
        refId: activityId as string,
        modifiedTime: modifiedTime(),
      });
      navigate(timePlanLocation);
    };
    handlers["remove"] = () => {
      runRemoveActivity({ refId: activityId as string });
      navigate(timePlanLocation);
    };
    // Saving a time event leaves its editor open, like the redirect did.
    handlers["update-time-event"] = (formData) => {
      runUpdateTimeEvent(updateTimeEventArgsFromForm(formData, modifiedTime()));
    };
    handlers["remove-time-event"] = (formData) => {
      runArchiveTimeEvent(
        archiveTimeEventArgsFromForm(formData, modifiedTime()),
      );
      navigate(
        withTimePlanView(
          `/app/workspace/apps/time-plans/${id}/${activityId}`,
          timePlanView,
        ),
      );
    };
    const noteOwners: Array<[string, NamedEntityTag]> = [
      ["target-big-plan-create-note", NamedEntityTag.BIG_PLAN],
      ["target-todo-task-create-note", NamedEntityTag.TODO_TASK],
      ["target-habit-create-note", NamedEntityTag.HABIT],
      ["target-habit-stack-create-note", NamedEntityTag.HABIT_STACK],
      ["target-chore-stack-create-note", NamedEntityTag.CHORE_STACK],
      ["target-chore-create-note", NamedEntityTag.CHORE],
    ];
    for (const [intent, ownerTag] of noteOwners) {
      handlers[intent] = () => {
        const ownerRefId = entityLinkRefIdFromWire(activityTarget);
        void runCreateNote({ ownerTag, ownerRefId }).then((result) => {
          if (result !== null) {
            setCreatedNotes((notes) => ({
              ...notes,
              [createdNoteKey(ownerTag, ownerRefId)]: result.new_note,
            }));
          }
        });
      };
    }
    return handlers;
  }, [
    runUpdateActivity,
    runUpdateInboxTask,
    runUpdateTodoTask,
    runUpdateBigPlan,
    runUpdateHabit,
    runUpdateHabitStack,
    runUpdateChore,
    runUpdateChoreStack,
    runArchiveActivity,
    runRemoveActivity,
    runUpdateTimeEvent,
    runArchiveTimeEvent,
    runCreateNote,
    regen,
    offerRegen,
    activityTarget,
    navigate,
    id,
    activityId,
    timePlanView,
    targetInboxTask,
    targetTodoTask,
    targetTodoInboxTask,
    targetHabit,
    targetChore,
    hasTargetBigPlan,
    topLevelInfo.today,
  ]);
  // Every intent is a local edit or a regen, which report their errors in a
  // snackbar; the panel has no action of its own.
  const actionData = undefined;
  const navigation = useNavigation();
  const isBigScreen = useBigScreen();

  const inputsEnabled =
    navigation.state === "idle" &&
    !loaderData.timePlanActivity.archived &&
    accessStatusAllowsWriterOrAbove(parentLoaderData.accessStatus);

  const sortedBigPlanInboxTasks = sortInboxTasksNaturally(
    loaderData.targetBigPlanInfo?.inbox_tasks ?? [],
    { dueDateAscending: false },
  );

  // Marking a card done or not done is a local edit, like the panel's other
  // edits.
  const { run: runUpdateInboxTaskStatus } = useTimePlanMutation(
    UPDATE_INBOX_TASK_STATUS,
  );

  const sortedHabitInboxTasks = sortInboxTasksNaturally(
    loaderData.targetHabitInfo?.inbox_tasks ?? [],
    { dueDateAscending: false },
  );
  const habitMoreInfoByRefId: { [key: string]: InboxTaskParent } = {};
  if (loaderData.targetHabit && loaderData.targetHabitInfo) {
    for (const inboxTask of loaderData.targetHabitInfo.inbox_tasks) {
      habitMoreInfoByRefId[inboxTask.ref_id] = {
        habit: loaderData.targetHabit,
        habitStack: loaderData.targetHabitInfo.stack ?? undefined,
        owner: loaderData.targetHabitInfo.owner,
        accessStatus: loaderData.targetHabitInfo.access_status ?? undefined,
      };
    }
  }

  const sortedChoreInboxTasks = sortInboxTasksNaturally(
    loaderData.targetChoreInfo?.inbox_tasks ?? [],
    { dueDateAscending: false },
  );

  const sortedStackHabits = sortHabitsNaturally(
    loaderData.targetHabitStackInfo?.habits ?? [],
  );
  const sortedStackInboxTasks = sortInboxTasksNaturally(
    loaderData.stackInboxTasks ?? [],
    { dueDateAscending: false },
  );
  const sortedStackChores = sortChoresNaturally(
    loaderData.targetChoreStackInfo?.chores ?? [],
  );
  const sortedChoreStackInboxTasks = sortInboxTasksNaturally(
    loaderData.choreStackInboxTasks ?? [],
    { dueDateAscending: false },
  );
  const stackMoreInfoByRefId: { [key: string]: InboxTaskParent } = {};
  if (loaderData.targetHabitStack && loaderData.targetHabitStackInfo) {
    const stackHabitsByRefId = new Map(
      loaderData.targetHabitStackInfo.habits.map((habit) => [
        habit.ref_id,
        habit,
      ]),
    );
    for (const inboxTask of loaderData.stackInboxTasks ?? []) {
      const habit = stackHabitsByRefId.get(
        entityLinkRefIdFromWire(inboxTask.owner),
      );
      stackMoreInfoByRefId[inboxTask.ref_id] = {
        habit,
        habitStack: loaderData.targetHabitStack,
        owner: loaderData.targetHabitStackInfo.owner,
        accessStatus:
          loaderData.targetHabitStackInfo.access_status ?? undefined,
      };
    }
  }

  const choreStackMoreInfoByRefId: { [key: string]: InboxTaskParent } = {};
  if (loaderData.targetChoreStack && loaderData.targetChoreStackInfo) {
    const stackChoresByRefId = new Map(
      loaderData.targetChoreStackInfo.chores.map((chore) => [
        chore.ref_id,
        chore,
      ]),
    );
    for (const inboxTask of loaderData.choreStackInboxTasks ?? []) {
      const chore = stackChoresByRefId.get(
        entityLinkRefIdFromWire(inboxTask.owner),
      );
      choreStackMoreInfoByRefId[inboxTask.ref_id] = {
        chore,
        owner: loaderData.targetChoreStackInfo.owner,
        accessStatus:
          loaderData.targetChoreStackInfo.access_status ?? undefined,
      };
    }
  }

  function markCard(it: InboxTask, status: InboxTaskStatus) {
    runUpdateInboxTaskStatus({
      refId: it.ref_id,
      status,
      eisen: null,
      modifiedTime: new Date().toISOString(),
    });
  }

  function handleHabitCardMarkDone(it: InboxTask) {
    markCard(it, InboxTaskStatus.DONE);
  }

  function handleChoreCardMarkDone(it: InboxTask) {
    markCard(it, InboxTaskStatus.DONE);
  }

  function handleBigPlanCardMarkDone(it: InboxTask) {
    markCard(it, InboxTaskStatus.DONE);
  }

  function handleBigPlanCardMarkNotDone(it: InboxTask) {
    markCard(it, InboxTaskStatus.NOT_DONE);
  }

  function handleHabitCardMarkNotDone(it: InboxTask) {
    markCard(it, InboxTaskStatus.NOT_DONE);
  }

  function handleChoreCardMarkNotDone(it: InboxTask) {
    markCard(it, InboxTaskStatus.NOT_DONE);
  }

  const activityTimeEventBlocks = [
    ...(loaderData.activityTimeEventBlocks || []),
  ];
  if (loaderData.targetHabitStack && loaderData.targetHabitStackInfo) {
    const memberActivities = habitActivitiesForStackMembers(
      parentLoaderData.activities ?? [],
      loaderData.targetHabitStackInfo.habits,
    );
    const memberActivityRefIds = new Set(
      memberActivities.map((activity) => activity.ref_id),
    );
    for (const block of parentLoaderData.activityTimeEventBlocks ?? []) {
      const { refId } = parseEntityLinkStd(block.owner);
      if (
        memberActivityRefIds.has(refId) &&
        !activityTimeEventBlocks.some(
          (existing) => existing.ref_id === block.ref_id,
        )
      ) {
        activityTimeEventBlocks.push(block);
      }
    }
  }
  if (loaderData.targetChoreStack && loaderData.targetChoreStackInfo) {
    const memberActivities = choreActivitiesForStackMembers(
      parentLoaderData.activities ?? [],
      loaderData.targetChoreStackInfo.chores,
    );
    const memberActivityRefIds = new Set(
      memberActivities.map((activity) => activity.ref_id),
    );
    for (const block of parentLoaderData.activityTimeEventBlocks ?? []) {
      const { refId } = parseEntityLinkStd(block.owner);
      if (
        memberActivityRefIds.has(refId) &&
        !activityTimeEventBlocks.some(
          (existing) => existing.ref_id === block.ref_id,
        )
      ) {
        activityTimeEventBlocks.push(block);
      }
    }
  }
  const activityTimeEventEntries = activityTimeEventBlocks.map((block) => ({
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
      target_habit_stack: loaderData.targetHabitStack,
      target_chore: loaderData.targetChore,
      target_chore_stack: loaderData.targetChoreStack,
      time_events: [block],
    },
  }));
  const sortedActivityTimeEventEntries = sortInboxTaskTimeEventsNaturally(
    activityTimeEventEntries,
  );
  const calendarTimeEventRefId = query.get(TIME_PLAN_ACTIVITY_TIME_EVENT_PARAM);
  const calendarTimeEvent = activityTimeEventBlocks.find(
    (block) => block.ref_id === calendarTimeEventRefId,
  );

  let newActivityTimeEventLocation: string | undefined = undefined;
  if (
    timePlan.period === RecurringTaskPeriod.DAILY ||
    timePlan.period === RecurringTaskPeriod.WEEKLY
  ) {
    const params = new URLSearchParams({
      timePlanActivityRefId: activityId as string,
      date: timePlan.start_date,
    });
    newActivityTimeEventLocation = withTimePlanView(
      `/app/workspace/apps/time-plans/${id}/new-activity-time-event?${params.toString()}`,
      timePlanView,
    );
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
        `/app/workspace/apps/time-plans/${id}`,
        timePlanView,
      )}
      initialExpansionState={LeafPanelExpansionState.SMALL}
      intentHandlers={intentHandlers}
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
              allBigPlans={loaderData.allBigPlans ?? []}
              allTags={loaderData.allTags ?? []}
              tags={loaderData.targetBigPlanInfo.tags}
              allContacts={loaderData.allContacts ?? []}
              contacts={loaderData.targetBigPlanInfo.contacts}
              location={loaderData.targetBigPlanInfo.location ?? null}
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
                        targetBigPlanNote !== null &&
                        targetBigPlanNote !== undefined,
                    }),
                  ]}
                />
              }
            >
              {targetBigPlanNote && (
                <EntityNoteEditor
                  initialNote={targetBigPlanNote}
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
                                  `/app/workspace/apps/time-plans/${id}/new-big-plan-inbox-task?bigPlanRefId=${loaderData.targetBigPlan.ref_id}&parentActivityRefId=${activityId}`,
                                  timePlanView,
                                ),
                                highlight: true,
                              }),
                              NavSingle({
                                text: "From Big Plan Inbox Tasks",
                                link: withTimePlanView(
                                  `/app/workspace/apps/time-plans/${id}/add-from-big-plan-inbox-tasks?bigPlanRefId=${loaderData.targetBigPlan.ref_id}&timePlanActivityRefId=${activityId}`,
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
              location={loaderData.targetTodoTaskInfo.location ?? null}
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
                        targetTodoTaskNote !== null &&
                        targetTodoTaskNote !== undefined,
                    }),
                  ]}
                />
              }
            >
              {targetTodoTaskNote && (
                <EntityNoteEditor
                  initialNote={targetTodoTaskNote}
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
              location={loaderData.targetHabitInfo.location ?? null}
              inputsEnabled={inputsEnabled && !loaderData.targetHabit.archived}
              entityOwner={loaderData.targetHabitInfo.owner}
              habit={loaderData.targetHabit}
              allStacks={loaderData.allStacks}
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
                        targetHabitNote !== null &&
                        targetHabitNote !== undefined,
                    }),
                  ]}
                />
              }
            >
              {targetHabitNote && (
                <EntityNoteEditor
                  initialNote={targetHabitNote}
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
                                  `/app/workspace/apps/time-plans/${id}/add-from-habit-inbox-tasks?habitRefId=${loaderData.targetHabit.ref_id}&timePlanActivityRefId=${activityId}`,
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
                  moreInfoByRefId={habitMoreInfoByRefId}
                  onCardMarkDone={handleHabitCardMarkDone}
                  onCardMarkNotDone={handleHabitCardMarkNotDone}
                />
              )}
            </SectionCard>
          </>
        )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.HABITS,
      ) &&
        loaderData.targetHabitStack &&
        loaderData.targetHabitStackInfo && (
          <>
            <HabitStackPropertiesEditor
              title="Habit Stack"
              showLinkToHabitStack
              intentPrefix="target-habit-stack"
              namePrefix="targetHabitStack"
              topLevelInfo={topLevelInfo}
              lifePlan={loaderData.lifePlan}
              allAspects={loaderData.allAspects ?? []}
              allChapters={loaderData.allChapters ?? []}
              allGoals={loaderData.allGoals ?? []}
              allMilestones={loaderData.allMilestones ?? []}
              allHabits={loaderData.allHabits}
              habits={loaderData.targetHabitStackInfo.habits}
              allTags={loaderData.allTags ?? []}
              tags={loaderData.targetHabitStackInfo.tags}
              allContacts={loaderData.allContacts ?? []}
              contacts={loaderData.targetHabitStackInfo.contacts}
              location={loaderData.targetHabitStackInfo.location ?? null}
              inputsEnabled={
                inputsEnabled && !loaderData.targetHabitStack.archived
              }
              entityOwner={loaderData.targetHabitStackInfo.owner}
              habitStack={loaderData.targetHabitStack}
              aspect={loaderData.targetHabitStackInfo.aspect}
              chapter={loaderData.targetHabitStackInfo.chapter}
              goal={loaderData.targetHabitStackInfo.goal}
              actionData={actionData}
            />

            <SectionCard title="Habits">
              <EntityStack>
                {sortedStackHabits.map((habit) => (
                  <EntityCard
                    key={`habit-${habit.ref_id}`}
                    entityId={`habit-${habit.ref_id}`}
                  >
                    <EntityLink
                      to={`/app/workspace/apps/habits/habits/${habit.ref_id}`}
                    >
                      <EntityNameComponent name={habit.name} />
                      <PeriodTag period={habit.gen_params.period} />
                    </EntityLink>
                  </EntityCard>
                ))}
              </EntityStack>
            </SectionCard>

            <SectionCard
              title="Note"
              actions={
                <SectionActions
                  id="target-habit-stack-note"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    ActionSingle({
                      text: "Create",
                      value: "target-habit-stack-create-note",
                      highlight: false,
                      disabled:
                        targetHabitStackNote !== null &&
                        targetHabitStackNote !== undefined,
                    }),
                  ]}
                />
              }
            >
              {targetHabitStackNote && (
                <EntityNoteEditor
                  initialNote={targetHabitStackNote}
                  inputsEnabled={inputsEnabled}
                />
              )}
            </SectionCard>

            <SectionCard
              id="target-habit-stack-inbox-tasks"
              title="Inbox Tasks"
            >
              {sortedStackInboxTasks.length > 0 && (
                <InboxTaskStack
                  topLevelInfo={topLevelInfo}
                  showOptions={{
                    showStatus: true,
                    showDueDate: true,
                    showHandleMarkDone: true,
                    showHandleMarkNotDone: true,
                  }}
                  inputsEnabled={inputsEnabled}
                  inboxTasks={sortedStackInboxTasks}
                  moreInfoByRefId={stackMoreInfoByRefId}
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
        loaderData.targetChoreStack &&
        loaderData.targetChoreStackInfo && (
          <>
            <ChoreStackPropertiesEditor
              title="Chore Stack"
              showLinkToChoreStack
              intentPrefix="target-chore-stack"
              namePrefix="targetChoreStack"
              topLevelInfo={topLevelInfo}
              lifePlan={loaderData.lifePlan}
              allAspects={loaderData.allAspects ?? []}
              allChapters={loaderData.allChapters ?? []}
              allGoals={loaderData.allGoals ?? []}
              allMilestones={loaderData.allMilestones ?? []}
              allChores={loaderData.allChores}
              chores={loaderData.targetChoreStackInfo.chores}
              allTags={loaderData.allTags ?? []}
              tags={loaderData.targetChoreStackInfo.tags}
              allContacts={loaderData.allContacts ?? []}
              contacts={loaderData.targetChoreStackInfo.contacts}
              location={loaderData.targetChoreStackInfo.location ?? null}
              inputsEnabled={
                inputsEnabled && !loaderData.targetChoreStack.archived
              }
              entityOwner={loaderData.targetChoreStackInfo.owner}
              choreStack={loaderData.targetChoreStack}
              aspect={loaderData.targetChoreStackInfo.aspect}
              chapter={loaderData.targetChoreStackInfo.chapter}
              goal={loaderData.targetChoreStackInfo.goal}
              actionData={actionData}
            />

            <SectionCard title="Chores">
              <EntityStack>
                {sortedStackChores.map((chore) => (
                  <EntityCard
                    key={`chore-${chore.ref_id}`}
                    entityId={`chore-${chore.ref_id}`}
                  >
                    <EntityLink
                      to={`/app/workspace/apps/chores/chores/${chore.ref_id}`}
                    >
                      <EntityNameComponent name={chore.name} />
                      <PeriodTag period={chore.gen_params.period} />
                    </EntityLink>
                  </EntityCard>
                ))}
              </EntityStack>
            </SectionCard>

            <SectionCard
              title="Note"
              actions={
                <SectionActions
                  id="target-chore-stack-note"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    ActionSingle({
                      text: "Create",
                      value: "target-chore-stack-create-note",
                      highlight: false,
                      disabled:
                        targetChoreStackNote !== null &&
                        targetChoreStackNote !== undefined,
                    }),
                  ]}
                />
              }
            >
              {targetChoreStackNote && (
                <EntityNoteEditor
                  initialNote={targetChoreStackNote}
                  inputsEnabled={inputsEnabled}
                />
              )}
            </SectionCard>

            <SectionCard
              id="target-chore-stack-inbox-tasks"
              title="Inbox Tasks"
            >
              {sortedChoreStackInboxTasks.length > 0 && (
                <InboxTaskStack
                  topLevelInfo={topLevelInfo}
                  showOptions={{
                    showStatus: true,
                    showDueDate: true,
                    showHandleMarkDone: true,
                    showHandleMarkNotDone: true,
                  }}
                  inputsEnabled={inputsEnabled}
                  inboxTasks={sortedChoreStackInboxTasks}
                  moreInfoByRefId={choreStackMoreInfoByRefId}
                  onCardMarkDone={handleChoreCardMarkDone}
                  onCardMarkNotDone={handleChoreCardMarkNotDone}
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
              location={loaderData.targetChoreInfo.location ?? null}
              inputsEnabled={inputsEnabled && !loaderData.targetChore.archived}
              entityOwner={loaderData.targetChoreInfo.owner}
              chore={loaderData.targetChore}
              allStacks={loaderData.allChoreStacks}
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
                        targetChoreNote !== null &&
                        targetChoreNote !== undefined,
                    }),
                  ]}
                />
              }
            >
              {targetChoreNote && (
                <EntityNoteEditor
                  initialNote={targetChoreNote}
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
                                  `/app/workspace/apps/time-plans/${id}/add-from-chore-inbox-tasks?choreRefId=${loaderData.targetChore.ref_id}&timePlanActivityRefId=${activityId}`,
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

      {calendarTimeEvent && (
        <TimeEventInDayBlockPropertiesEditor
          key={calendarTimeEvent.ref_id}
          title="Time Event"
          name={timePlanActivityTargetNameForEvent(
            loaderData.targetInboxTask,
            loaderData.targetBigPlan,
            loaderData.timePlanActivity.ref_id,
            loaderData.targetTodoTask,
            loaderData.targetHabit,
            loaderData.targetChore,
            loaderData.targetHabitStack,
            loaderData.targetChoreStack,
          )}
          inDayBlock={calendarTimeEvent}
          timezone={topLevelInfo.user.timezone}
          inputsEnabled={inputsEnabled && !calendarTimeEvent.archived}
          topLevelInfo={topLevelInfo}
          actionData={actionData}
        />
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
  "/app/workspace/apps/time-plans",
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find activity ${params.activityId} in time plan ${params.id}!`,
    error: (params) =>
      `There was an error loading activity ${params.activityId} in time plan ${params.id}! Please try again!`,
  },
);
