import type {
  InboxTask,
  LifePlan,
  AspectSummary,
  TimePlan,
} from "@jupiter/webapi-client";
import { DateTime } from "luxon";
import {
  ApiError,
  BigPlanStatus,
  Difficulty,
  Eisen,
  InboxTaskSource,
  InboxTaskStatus,
  NoteNamespace,
  RecurringTaskPeriod,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
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
} from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockToTimezone,
} from "@jupiter/core/common/sub/time_events/time-event";
import { allowUserChanges } from "@jupiter/core/inbox_tasks/source";
import {
  isInboxTaskCoreFieldEditable,
  sortInboxTasksNaturally,
} from "@jupiter/core/inbox_tasks/root";
import { BigPlanPropertiesEditor } from "@jupiter/core/big_plans/component/properties-editor";
import { InboxTaskPropertiesEditor } from "@jupiter/core/inbox_tasks/component/properties-editor";
import { InboxTaskStack } from "@jupiter/core/inbox_tasks/component/stack";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
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
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
  activityId: z.string(),
});

const UpdateFormTargetInboxTaskSchema = {
  targetInboxTaskRefId: z.string(),
  targetInboxTaskSource: z.nativeEnum(InboxTaskSource),
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
    const result = await apiClient.timePlans.timePlanActivityLoad({
      ref_id: activityId,
      allow_archived: true,
    });

    let inboxTaskResult = null;
    if (result.target_inbox_task) {
      inboxTaskResult = await apiClient.inboxTasks.inboxTaskLoad({
        ref_id: result.target_inbox_task.ref_id,
        allow_archived: true,
      });
    }

    let bigPlanResult = null;
    if (result.target_big_plan) {
      bigPlanResult = await apiClient.bigPlans.bigPlanLoad({
        ref_id: result.target_big_plan.ref_id,
        allow_archived: true,
      });
    }

    return json({
      rootAspect: summaryResponse.root_aspect as AspectSummary,
      lifePlan: summaryResponse.life_plan as LifePlan,
      allAspects: summaryResponse.aspects,
      allChapters: summaryResponse.chapters,
      allGoals: summaryResponse.goals,
      allMilestones: summaryResponse.milestones,
      timePlanActivity: result.time_plan_activity,
      targetInboxTask: result.target_inbox_task,
      targetInboxTaskInfo: inboxTaskResult,
      targetInboxTaskTimeEventBlocks: inboxTaskResult?.time_event_blocks,
      targetBigPlan: result.target_big_plan,
      targetBigPlanInfo: bigPlanResult,
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

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id, activityId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

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

        return redirect(`/app/workspace/time-plans/${id}`);
      }

      case "archive": {
        await apiClient.timePlans.timePlanActivityArchive({
          ref_id: activityId,
        });

        return redirect(`/app/workspace/time-plans/${id}`);
      }

      case "remove": {
        await apiClient.timePlans.timePlanActivityRemove({
          ref_id: activityId,
        });

        return redirect(`/app/workspace/time-plans/${id}`);
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
          form.targetInboxTaskSource,
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
          status = allowUserChanges(form.targetInboxTaskSource)
            ? InboxTaskStatus.NOT_STARTED
            : InboxTaskStatus.NOT_STARTED_GEN;
        } else if (form.intent === "target-inbox-task-reactivate") {
          status = allowUserChanges(form.targetInboxTaskSource)
            ? InboxTaskStatus.NOT_STARTED
            : InboxTaskStatus.NOT_STARTED_GEN;
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

        return redirect(`/app/workspace/time-plans/${id}`);
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

        return redirect(`/app/workspace/time-plans/${id}`);
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

        return redirect(`/app/workspace/time-plans/${id}`);
      }

      case "target-big-plan-create-note": {
        const activityResult = await apiClient.timePlans.timePlanActivityLoad({
          ref_id: activityId,
          allow_archived: true,
        });

        if (activityResult.target_big_plan) {
          await apiClient.notes.noteCreate({
            namespace: NoteNamespace.BIG_PLAN,
            source_entity_ref_id: activityResult.target_big_plan.ref_id,
            content: [],
          });
        }

        return redirect(`/app/workspace/time-plans/${id}/${activityId}`);
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

export default function TimePlanActivity() {
  const { id, activityId } = useParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const timePlan = useRouteLoaderData<{ timePlan: TimePlan }>(
    "routes/app/workspace/time-plans/$id",
  )!.timePlan;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.timePlanActivity.archived;

  const inboxTaskTimeEventEntries = (
    loaderData.targetInboxTaskTimeEventBlocks || []
  ).map((block) => ({
    time_event_in_tz: timeEventInDayBlockToTimezone(
      block,
      topLevelInfo.user.timezone,
    ),
    entry: {
      inbox_task: loaderData.targetInboxTask!,
      time_events: [block],
    },
  }));
  const sortedInboxTaskTimeEventEntries = sortInboxTaskTimeEventsNaturally(
    inboxTaskTimeEventEntries,
  );

  const sortedBigPlanInboxTasks = sortInboxTasksNaturally(
    loaderData.targetBigPlanInfo?.inbox_tasks ?? [],
    { dueDateAscending: false },
  );

  const cardActionFetcher = useFetcher();

  function handleBigPlanCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      { id: it.ref_id, status: InboxTaskStatus.DONE },
      {
        method: "post",
        action: "/app/workspace/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleBigPlanCardMarkNotDone(it: InboxTask) {
    cardActionFetcher.submit(
      { id: it.ref_id, status: InboxTaskStatus.NOT_DONE },
      {
        method: "post",
        action: "/app/workspace/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  let newInboxTaskTimeEventLocation = undefined;

  if (
    loaderData.targetInboxTask &&
    (timePlan.period === RecurringTaskPeriod.DAILY ||
      timePlan.period === RecurringTaskPeriod.WEEKLY)
  ) {
    const params = new URLSearchParams({
      date: timePlan.start_date,
      period: timePlan.period,
      view: "calendar",
      inboxTaskRefId: loaderData.targetInboxTask!.ref_id,
      timePlanReason: "for-time-plan",
      timePlanRefId: id as string,
      timePlanActivityRefId: activityId as string,
    });

    newInboxTaskTimeEventLocation = `/app/workspace/calendar/time-event/in-day-block/new-for-inbox-task?${params.toString()}`;
  }

  return (
    <LeafPanel
      key={`time-plan-${id}/activity-${activityId}`}
      fakeKey={`time-plan-${id}/activity-${activityId}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.timePlanActivity.archived}
      returnLocation={`/app/workspace/time-plans/${id}`}
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

      {loaderData.targetInboxTask && (
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
            inboxTaskInfo={loaderData.targetInboxTaskInfo!}
            actionData={actionData}
          />

          {isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.SCHEDULE,
          ) && (
            <TimeEventInDayBlockStack
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              title="Time Events"
              createLocation={newInboxTaskTimeEventLocation}
              entries={sortedInboxTaskTimeEventEntries}
            />
          )}
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
                                link: `/app/workspace/big-plans/${loaderData.targetBigPlan.ref_id}/inbox-tasks/new?timePlanReason=for-time-plan&timePlanRefId=${id}&parentTimePlanActivityRefId=${activityId}`,
                                highlight: true,
                              }),
                              NavSingle({
                                text: "From Current Inbox Tasks",
                                link: `/app/workspace/time-plans/${id}/add-from-current-inbox-tasks?bigPlanReason=for-big-plan&bigPlanRefId=${loaderData.targetBigPlan.ref_id}&timePlanActivityRefId=${activityId}`,
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
