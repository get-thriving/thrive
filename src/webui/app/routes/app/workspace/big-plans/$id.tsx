import type {
  ChapterSummary,
  GoalSummary,
  InboxTask,
  LifePlan,
  MilestoneSummary,
  ProjectSummary,
  Tag,
  Workspace,
} from "@jupiter/webapi-client";
import {
  ApiError,
  BigPlanStatus,
  Difficulty,
  Eisen,
  InboxTaskStatus,
  NoteNamespace,
  TagNamespace,
  TimePlanActivityTarget,
  WorkspaceFeature,
  SyncTarget,
} from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Outlet,
  useActionData,
  useFetcher,
  useNavigation,
} from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import { AnimatePresence } from "framer-motion";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockToTimezone,
} from "@jupiter/core/common/sub/time_events/time-event";
import { TimeEventInDayBlockStack } from "@jupiter/core/common/sub/time_events/sub/in_day_block/component/stack";
import { sortInboxTasksNaturally } from "@jupiter/core/inbox_tasks/root";
import { BigPlanPropertiesEditor } from "@jupiter/core/big_plans/component/properties-editor";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { InboxTaskStack } from "@jupiter/core/inbox_tasks/component/stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimePlanActivityList } from "@jupiter/core/time_plans/sub/activity/component/list";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  SectionActions,
  ActionSingle,
  NavSingle,
} from "@jupiter/core/infra/component/section-actions";
import { BigPlanMilestoneStack } from "@jupiter/core/big_plans/sub/milestones/component/stack";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const CommonParamsSchema = {
  name: z.string(),
  status: z.nativeEnum(BigPlanStatus),
  project: z.string(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  isKey: CheckboxAsString,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableDate: z.string().optional(),
  dueDate: z.string().optional(),
};

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("mark-done"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("mark-not-done"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("start"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("restart"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("block"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("stop"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("reactivate"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("update"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("create-note"),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
  z.object({
    intent: z.literal("refresh-stats"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_workspace: true,
    include_life_plan: true,
    include_projects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.BIG_PLAN],
  });

  try {
    const result = await apiClient.bigPlans.bigPlanLoad({
      ref_id: id,
      allow_archived: true,
    });

    const workspace = summaryResponse.workspace as Workspace;
    let timePlanEntries = undefined;
    if (isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.TIME_PLANS)) {
      const timePlanActivitiesResult =
        await apiClient.timePlans.timePlanActivityFindForTarget({
          allow_archived: true,
          target: TimePlanActivityTarget.BIG_PLAN,
          target_ref_id: id,
        });
      timePlanEntries = timePlanActivitiesResult.entries;
    }

    return json({
      bigPlan: result.big_plan,
      stats: result.stats,
      project: result.project,
      chapter: result.chapter,
      goal: result.goal,
      milestones: result.milestones,
      inboxTasks: result.inbox_tasks,
      tags: result.tags,
      note: result.note,
      timeEventBlocks: result.time_event_blocks,
      timePlanEntries: timePlanEntries,
      lifePlan: summaryResponse.life_plan as LifePlan,
      allProjects: summaryResponse.projects as Array<ProjectSummary>,
      allChapters: summaryResponse.chapters as Array<ChapterSummary>,
      allGoals: summaryResponse.goals as Array<GoalSummary>,
      allMilestones: summaryResponse.milestones as Array<MilestoneSummary>,
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

  try {
    switch (form.intent) {
      case "mark-done":
      case "mark-not-done":
      case "start":
      case "restart":
      case "block":
      case "stop":
      case "reactivate":
      case "update": {
        let status = form.status;
        if (form.intent === "mark-done") {
          status = BigPlanStatus.DONE;
        } else if (form.intent === "mark-not-done") {
          status = BigPlanStatus.NOT_DONE;
        } else if (form.intent === "start") {
          status = BigPlanStatus.IN_PROGRESS;
        } else if (form.intent === "restart") {
          status = BigPlanStatus.IN_PROGRESS;
        } else if (form.intent === "block") {
          status = BigPlanStatus.BLOCKED;
        } else if (form.intent === "stop") {
          status = BigPlanStatus.NOT_STARTED;
        } else if (form.intent === "reactivate") {
          status = BigPlanStatus.NOT_STARTED;
        }

        const result = await apiClient.bigPlans.bigPlanUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          status: {
            should_change: true,
            value: status,
          },
          project_ref_id: {
            should_change: true,
            value: form.project,
          },
          chapter_ref_id: {
            should_change: true,
            value:
              form.chapter !== undefined && form.chapter !== ""
                ? form.chapter
                : undefined,
          },
          goal_ref_id: {
            should_change: true,
            value:
              form.goal !== undefined && form.goal !== ""
                ? form.goal
                : undefined,
          },
          is_key: {
            should_change: true,
            value: form.isKey,
          },
          eisen: {
            should_change: true,
            value: form.eisen,
          },
          difficulty: {
            should_change: true,
            value: form.difficulty,
          },
          actionable_date: {
            should_change: true,
            value:
              form.actionableDate !== undefined && form.actionableDate !== ""
                ? form.actionableDate
                : undefined,
          },
          due_date: {
            should_change: true,
            value:
              form.dueDate !== undefined && form.dueDate !== ""
                ? form.dueDate
                : undefined,
          },
        });

        if (result.record_score_result) {
          return redirect(`/app/workspace/big-plans/${id}`, {
            headers: {
              "Set-Cookie": await saveScoreAction(result.record_score_result),
            },
          });
        }

        return redirect(`/app/workspace/big-plans`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.BIG_PLAN,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/big-plans/${id}`);
      }

      case "archive": {
        await apiClient.bigPlans.bigPlanArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/big-plans`);
      }

      case "remove": {
        await apiClient.bigPlans.bigPlanRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/big-plans`);
      }

      case "refresh-stats": {
        await apiClient.stats.statsDo({
          stats_targets: [SyncTarget.BIG_PLANS],
          filter_big_plan_ref_ids: [id],
          filter_habit_ref_ids: undefined,
          filter_journal_ref_ids: undefined,
        });
        return redirect(`/app/workspace/big-plans/${id}`);
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

export default function BigPlan() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.bigPlan.archived;

  const bigPlanInfo = {
    big_plan: loaderData.bigPlan,
    project: loaderData.project,
    chapter: loaderData.chapter,
    goal: loaderData.goal,
    milestones: loaderData.milestones,
    inbox_tasks: loaderData.inboxTasks,
    tags: loaderData.tags,
    note: loaderData.note,
    time_event_blocks: loaderData.timeEventBlocks,
    stats: loaderData.stats,
  };

  const bigPlansByRefId = new Map();
  bigPlansByRefId.set(loaderData.bigPlan.ref_id, loaderData.bigPlan);

  const timePlanActivities = loaderData.timePlanEntries?.map(
    (entry) => entry.time_plan_activity,
  );
  const timePlansByRefId = new Map();
  if (loaderData.timePlanEntries) {
    for (const entry of loaderData.timePlanEntries) {
      timePlansByRefId.set(entry.time_plan.ref_id, entry.time_plan);
    }
  }

  const timeEventsByRefId = new Map();

  const sortedInboxTasks = sortInboxTasksNaturally(loaderData.inboxTasks, {
    dueDateAscending: false,
  });

  const timeEventEntries = loaderData.timeEventBlocks.map((block) => ({
    time_event_in_tz: timeEventInDayBlockToTimezone(
      block,
      topLevelInfo.user.timezone,
    ),
    entry: {
      big_plan: loaderData.bigPlan,
      time_events: [block],
    },
  }));
  const sortedTimeEventEntries =
    sortInboxTaskTimeEventsNaturally(timeEventEntries);

  const cardActionFetcher = useFetcher();

  function handleCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.DONE,
      },
      {
        method: "post",
        action: "/app/workspace/inbox-tasks/update-status-and-eisen",
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
        action: "/app/workspace/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  return (
    <LeafPanel
      key={`big-plan-${loaderData.bigPlan.ref_id}`}
      fakeKey={`big-plan-${loaderData.bigPlan.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.bigPlan.archived}
      returnLocation={"/app/workspace/big-plans"}
      shouldShowALeaflet={shouldShowALeaflet}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaflet}>
        <GlobalError actionResult={actionData} />
        <BigPlanPropertiesEditor
          title="Properties"
          showRefreshStats
          topLevelInfo={topLevelInfo}
          lifePlan={loaderData.lifePlan}
          allProjects={loaderData.allProjects}
          allChapters={loaderData.allChapters}
          allGoals={loaderData.allGoals}
          allMilestones={loaderData.allMilestones}
          allTags={loaderData.allTags}
          tags={loaderData.tags}
          inputsEnabled={inputsEnabled}
          bigPlan={loaderData.bigPlan}
          bigPlanInfo={bigPlanInfo}
          actionData={actionData}
        />

        <SectionCard
          title="Note"
          actions={
            <SectionActions
              id="person-note"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  text: "Create Note",
                  value: "create-note",
                  highlight: false,
                  disabled: loaderData.note !== null,
                }),
              ]}
            />
          }
        >
          {loaderData.note && (
            <>
              <EntityNoteEditor
                initialNote={loaderData.note}
                inputsEnabled={inputsEnabled}
              />
            </>
          )}
        </SectionCard>

        <SectionCard
          id="big-plan-milestones"
          title="Milestones"
          actions={
            <SectionActions
              id="big-plan-milestones"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  text: "New",
                  link: `/app/workspace/big-plans/${loaderData.bigPlan.ref_id}/milestones/new`,
                }),
              ]}
            />
          }
        >
          <BigPlanMilestoneStack milestones={loaderData.milestones} />
        </SectionCard>

        <SectionCard
          id="big-plan-inbox-tasks"
          title="Inbox Tasks"
          actions={
            <SectionActions
              id="big-plan-inbox-tasks"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  text: "New",
                  link: `/app/workspace/inbox-tasks/new?bigPlanReason=for-big-plan&bigPlanRefId=${loaderData.bigPlan.ref_id}`,
                }),
              ]}
            />
          }
        >
          {sortedInboxTasks.length > 0 && (
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
              inboxTasks={sortedInboxTasks}
              onCardMarkDone={handleCardMarkDone}
              onCardMarkNotDone={handleCardMarkNotDone}
            />
          )}
        </SectionCard>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.SCHEDULE,
        ) && (
          <TimeEventInDayBlockStack
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            title="Time Events"
            createLocation={`/app/workspace/calendar/time-event/in-day-block/new-for-big-plan?bigPlanRefId=${loaderData.bigPlan.ref_id}`}
            entries={sortedTimeEventEntries}
          />
        )}

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.TIME_PLANS,
        ) &&
          timePlanActivities && (
            <SectionCard
              id="big-plan-time-plans"
              title="Time Plans"
              actions={
                <SectionActions
                  id="big-plan-time-plans-actions"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    NavSingle({
                      text: "Add",
                      highlight: false,
                      link: `/app/workspace/time-plans/add-big-plan-to-plans?bigPlanRefId=${loaderData.bigPlan.ref_id}`,
                    }),
                  ]}
                />
              }
            >
              <TimePlanActivityList
                topLevelInfo={topLevelInfo}
                activities={timePlanActivities}
                timePlansByRefId={timePlansByRefId}
                inboxTasksByRefId={new Map()}
                bigPlansByRefId={bigPlansByRefId}
                activityDoneness={{}}
                timeEventsByRefId={timeEventsByRefId}
                fullInfo={false}
                showTimePlanName={true}
              />
            </SectionCard>
          )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/big-plans",
  ParamsSchema,
  {
    notFound: (params) => `Could not find big plan with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading big plan with ID ${params.id}! Please try again!`,
  },
);
