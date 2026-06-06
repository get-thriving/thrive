import type {
  InboxTask,
  LifePlan,
  AspectSummary,
  TimePlan,
} from "@jupiter/webapi-client";
import {
  NamedEntityTag,
  ApiError,
  ProjectStatus,
  Difficulty,
  Eisen,
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
import {
  isInboxTaskCoreFieldEditable,
  sortInboxTasksNaturally,
} from "#/core/common/sub/inbox_tasks/root";
import { ProjectPropertiesEditor } from "@jupiter/core/projects/component/properties-editor";
import { InboxTaskPropertiesEditor } from "@jupiter/core/common/sub/inbox_tasks/component/properties-editor";
import { InboxTaskStack } from "@jupiter/core/common/sub/inbox_tasks/component/stack";
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
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";

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
  targetInboxTaskProject: z.string().optional(),
  targetInboxTaskIsKey: CheckboxAsString,
  targetInboxTaskStatus: z.nativeEnum(InboxTaskStatus),
  targetInboxTaskEisen: z.nativeEnum(Eisen),
  targetInboxTaskDifficulty: z.nativeEnum(Difficulty),
  targetInboxTaskActionableDate: z.string().optional(),
  targetInboxTaskDueDate: z.string().optional(),
};

const UpdateFormTargetProjectSchema = {
  targetProjectRefId: z.string(),
  targetProjectName: z.string(),
  targetProjectStatus: z.nativeEnum(ProjectStatus),
  targetProjectAspect: z.string().optional(),
  targetProjectChapter: z.string().optional(),
  targetProjectGoal: z.string().optional(),
  targetProjectIsKey: CheckboxAsString,
  targetProjectEisen: z.nativeEnum(Eisen),
  targetProjectDifficulty: z.nativeEnum(Difficulty),
  targetProjectActionableDate: z.string().optional(),
  targetProjectDueDate: z.string().optional(),
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
    intent: z.literal("target-project-mark-done"),
    ...UpdateFormTargetProjectSchema,
  }),
  z.object({
    intent: z.literal("target-project-mark-not-done"),
    ...UpdateFormTargetProjectSchema,
  }),
  z.object({
    intent: z.literal("target-project-start"),
    ...UpdateFormTargetProjectSchema,
  }),
  z.object({
    intent: z.literal("target-project-restart"),
    ...UpdateFormTargetProjectSchema,
  }),
  z.object({
    intent: z.literal("target-project-block"),
    ...UpdateFormTargetProjectSchema,
  }),
  z.object({
    intent: z.literal("target-project-stop"),
    ...UpdateFormTargetProjectSchema,
  }),
  z.object({
    intent: z.literal("target-project-reactivate"),
    ...UpdateFormTargetProjectSchema,
  }),
  z.object({
    intent: z.literal("target-project-update"),
    ...UpdateFormTargetProjectSchema,
  }),
  z.object({
    intent: z.literal("target-project-create-note"),
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
    include_projects: true,
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
    if (result.target_project) {
      bigPlanResult = await apiClient.bigPlans.bigPlanLoad({
        ref_id: result.target_project.ref_id,
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
      targetProject: result.target_project,
      targetProjectInfo: bigPlanResult,
      activityTimeEventBlocks: result.time_event_blocks,
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

      case "target-project-mark-done":
      case "target-project-mark-not-done":
      case "target-project-start":
      case "target-project-restart":
      case "target-project-block":
      case "target-project-stop":
      case "target-project-reactivate":
      case "target-project-update": {
        let status = form.targetProjectStatus;
        if (form.intent === "target-project-mark-done") {
          status = ProjectStatus.DONE;
        } else if (form.intent === "target-project-mark-not-done") {
          status = ProjectStatus.NOT_DONE;
        } else if (form.intent === "target-project-start") {
          status = ProjectStatus.IN_PROGRESS;
        } else if (form.intent === "target-project-restart") {
          status = ProjectStatus.IN_PROGRESS;
        } else if (form.intent === "target-project-block") {
          status = ProjectStatus.BLOCKED;
        } else if (form.intent === "target-project-stop") {
          status = ProjectStatus.NOT_STARTED;
        } else if (form.intent === "target-project-reactivate") {
          status = ProjectStatus.NOT_STARTED;
        }

        const result = await apiClient.bigPlans.bigPlanUpdate({
          ref_id: form.targetProjectRefId,
          name: {
            should_change: true,
            value: form.targetProjectName,
          },
          status: {
            should_change: true,
            value: status,
          },
          aspect_ref_id: {
            should_change: true,
            value: form.targetProjectAspect,
          },
          chapter_ref_id: {
            should_change: true,
            value:
              form.targetProjectChapter !== undefined &&
              form.targetProjectChapter !== ""
                ? form.targetProjectChapter
                : undefined,
          },
          goal_ref_id: {
            should_change: true,
            value:
              form.targetProjectGoal !== undefined &&
              form.targetProjectGoal !== ""
                ? form.targetProjectGoal
                : undefined,
          },
          is_key: {
            should_change: true,
            value: form.targetProjectIsKey,
          },
          eisen: {
            should_change: true,
            value: form.targetProjectEisen,
          },
          difficulty: {
            should_change: true,
            value: form.targetProjectDifficulty,
          },
          actionable_date: {
            should_change: true,
            value:
              form.targetProjectActionableDate !== undefined &&
              form.targetProjectActionableDate !== ""
                ? form.targetProjectActionableDate
                : undefined,
          },
          due_date: {
            should_change: true,
            value:
              form.targetProjectDueDate !== undefined &&
              form.targetProjectDueDate !== ""
                ? form.targetProjectDueDate
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

      case "target-project-create-note": {
        const activityResult = await apiClient.timePlans.timePlanActivityLoad({
          ref_id: activityId,
          allow_archived: true,
        });

        if (activityResult.target_project) {
          await apiClient.notes.noteCreate({
            owner: noteStdOwner(
              NamedEntityTag.PROJECT,
              activityResult.target_project.ref_id,
            ),
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

  const sortedProjectInboxTasks = sortInboxTasksNaturally(
    loaderData.targetProjectInfo?.inbox_tasks ?? [],
    { dueDateAscending: false },
  );

  const cardActionFetcher = useFetcher();

  function handleProjectCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      { id: it.ref_id, status: InboxTaskStatus.DONE },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleProjectCardMarkNotDone(it: InboxTask) {
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
        </>
      )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.PROJECTS,
      ) &&
        loaderData.targetProject &&
        loaderData.targetProjectInfo && (
          <>
            <ProjectPropertiesEditor
              title="Project"
              showLinkToProject
              intentPrefix="target-project"
              namePrefix="targetProject"
              topLevelInfo={topLevelInfo}
              lifePlan={loaderData.lifePlan}
              allAspects={loaderData.allAspects ?? []}
              allChapters={loaderData.allChapters ?? []}
              allGoals={loaderData.allGoals ?? []}
              allMilestones={loaderData.allMilestones ?? []}
              inputsEnabled={
                inputsEnabled && !loaderData.targetProject.archived
              }
              bigPlan={loaderData.targetProject}
              bigPlanInfo={loaderData.targetProjectInfo}
              actionData={actionData}
            />

            <SectionCard
              title="Note"
              actions={
                <SectionActions
                  id="target-project-note"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    ActionSingle({
                      text: "Create",
                      value: "target-project-create-note",
                      highlight: false,
                      disabled:
                        loaderData.targetProjectInfo.note !== null &&
                        loaderData.targetProjectInfo.note !== undefined,
                    }),
                  ]}
                />
              }
            >
              {loaderData.targetProjectInfo.note && (
                <EntityNoteEditor
                  initialNote={loaderData.targetProjectInfo.note}
                  inputsEnabled={inputsEnabled}
                />
              )}
            </SectionCard>

            <SectionCard
              id="target-project-inbox-tasks"
              title="Inbox Tasks"
              actions={
                <SectionActions
                  id="target-project-inbox-tasks"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    NavMultipleSpread({
                      navs: [
                        ...(timePlanAllowsInboxTasks(timePlan)
                          ? [
                              NavSingle({
                                text: "New Inbox Task",
                                link: `/app/workspace/projects/${loaderData.targetProject.ref_id}/inbox-tasks/new?timePlanReason=for-time-plan&timePlanRefId=${id}&parentTimePlanActivityRefId=${activityId}`,
                                highlight: true,
                              }),
                              NavSingle({
                                text: "From Current Inbox Tasks",
                                link: `/app/workspace/time-plans/${id}/add-from-current-inbox-tasks?bigPlanReason=for-project&bigPlanRefId=${loaderData.targetProject.ref_id}&timePlanActivityRefId=${activityId}`,
                              }),
                            ]
                          : []),
                      ],
                    }),
                  ]}
                />
              }
            >
              {sortedProjectInboxTasks.length > 0 && (
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
                  inboxTasks={sortedProjectInboxTasks}
                  onCardMarkDone={handleProjectCardMarkDone}
                  onCardMarkNotDone={handleProjectCardMarkNotDone}
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
