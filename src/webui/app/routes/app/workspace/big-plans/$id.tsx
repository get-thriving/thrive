import type {
  ChapterSummary,
  Contact,
  GoalSummary,
  InboxTask,
  LifePlan,
  MilestoneSummary,
  AspectSummary,
  Tag,
  Workspace,
} from "@jupiter/webapi-client";
import {
  NamedEntityTag,
  ApiError,
  BigPlanStatus,
  Difficulty,
  Eisen,
  InboxTaskStatus,
  TimePlanActivityTarget,
  WorkspaceFeature,
  SyncTarget,
} from "@jupiter/webapi-client";
import type { DragStart, DropResult } from "@hello-pangea/dnd";
import { DragDropContext } from "@hello-pangea/dnd";
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
import { Fragment, useContext, useState } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import { AnimatePresence } from "framer-motion";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ViewListIcon from "@mui/icons-material/ViewList";
import { eisenIcon, eisenName } from "@jupiter/core/common/eisen";
import { InboxTaskKanbanBoard } from "@jupiter/core/common/sub/inbox_tasks/components/kanban-board";
import {
  SmallScreenKanban,
  SmallScreenKanbanByEisen,
} from "@jupiter/core/common/sub/inbox_tasks/components/small-screen-kanban";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { ActionableTime } from "@jupiter/core/infra/actionable-time";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  isInboxTaskCoreFieldEditable,
  type InboxTaskOptimisticState,
} from "@jupiter/core/common/sub/inbox_tasks/root";
import type { SomeErrorNoData } from "@jupiter/core/infra/action-result";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockToTimezone,
} from "@jupiter/core/common/sub/time_events/time-event";
import { TimeEventInDayBlockStack } from "@jupiter/core/common/sub/time_events/sub/in_day_block/component/stack";
import { sortInboxTasksNaturally } from "#/core/common/sub/inbox_tasks/root";
import { BigPlanPropertiesEditor } from "@jupiter/core/big_plans/component/properties-editor";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { InboxTaskStack } from "@jupiter/core/common/sub/inbox_tasks/component/stack";
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
  FilterFewOptionsCompact,
} from "@jupiter/core/infra/component/section-actions";
import { BigPlanMilestoneStack } from "@jupiter/core/big_plans/sub/milestones/component/stack";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { LeafPanelExpansionState } from "#/core/infra/leaf-panel-expansion";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

enum InboxTasksView {
  KANBAN_BY_EISEN = "kanban-by-eisen",
  KANBAN = "kanban",
  LIST = "list",
}

const EISENS = [
  Eisen.IMPORTANT_AND_URGENT,
  Eisen.URGENT,
  Eisen.IMPORTANT,
  Eisen.REGULAR,
];

const ParamsSchema = z.object({
  id: z.string(),
});

const CommonParamsSchema = {
  name: z.string(),
  status: z.nativeEnum(BigPlanStatus),
  aspect: z.string().optional(),
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
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
  });
  const allContacts = await apiClient.contacts.contactFind({
    allow_archived: false,
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
      aspect: result.aspect,
      chapter: result.chapter,
      goal: result.goal,
      milestones: result.milestones,
      inboxTasks: result.inbox_tasks,
      tags: result.tags,
      contacts:
        (
          result as {
            contacts?: Array<Contact>;
          }
        ).contacts ?? [],
      note: result.note,
      timeEventBlocks: result.time_event_blocks,
      timePlanEntries: timePlanEntries,
      lifePlan: summaryResponse.life_plan as LifePlan | null,
      allAspects: summaryResponse.aspects as Array<AspectSummary> | null,
      allChapters: summaryResponse.chapters as Array<ChapterSummary> | null,
      allGoals: summaryResponse.goals as Array<GoalSummary> | null,
      allMilestones:
        summaryResponse.milestones as Array<MilestoneSummary> | null,
      allTags: allTags.tags as Array<Tag>,
      allContacts: allContacts.contacts as Array<Contact>,
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
          aspect_ref_id:
            form.aspect !== undefined
              ? { should_change: true, value: form.aspect }
              : { should_change: false },
          chapter_ref_id:
            form.aspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.chapter !== undefined && form.chapter !== ""
                      ? form.chapter
                      : undefined,
                }
              : { should_change: false },
          goal_ref_id:
            form.aspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.goal !== undefined && form.goal !== ""
                      ? form.goal
                      : undefined,
                }
              : { should_change: false },
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
          owner: noteStdOwner(NamedEntityTag.BIG_PLAN, id),
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
  const isBigScreen = useBigScreen();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.bigPlan.archived;

  const bigPlanInfo = {
    big_plan: loaderData.bigPlan,
    aspect: loaderData.aspect,
    chapter: loaderData.chapter,
    goal: loaderData.goal,
    milestones: loaderData.milestones,
    inbox_tasks: loaderData.inboxTasks,
    tags: loaderData.tags,
    contacts: loaderData.contacts,
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

  const inboxTasksByRefId: { [key: string]: InboxTask } = {};
  for (const it of loaderData.inboxTasks) {
    inboxTasksByRefId[it.ref_id] = it;
  }

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

  const [selectedInboxTasksView, setSelectedInboxTasksView] = useState(
    isBigScreen ? InboxTasksView.KANBAN_BY_EISEN : InboxTasksView.KANBAN,
  );
  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    [key: string]: InboxTaskOptimisticState;
  }>({});
  const [draggedInboxTaskId, setDraggedInboxTaskId] = useState<
    string | undefined
  >(undefined);

  const cardActionFetcher = useFetcher();
  const kanbanMoveFetcher = useFetcher<SomeErrorNoData>();

  function onDragStart(start: DragStart) {
    setDraggedInboxTaskId(start.draggableId);
  }

  function onDragEnd(result: DropResult) {
    setDraggedInboxTaskId(undefined);

    if (!result.destination) {
      return null;
    }

    const destination = result.destination.droppableId.split(":");

    const eisenSchema = z
      .nativeEnum(Eisen)
      .or(z.literal("undefined").transform((_) => undefined));
    const statusSchema = z.nativeEnum(InboxTaskStatus);

    const eisen = eisenSchema.parse(destination[1]);
    const status = statusSchema.parse(destination[2]);

    const inboxTask = inboxTasksByRefId[result.draggableId];

    if (!isInboxTaskCoreFieldEditable(inboxTask.namespace)) {
      if (eisen && inboxTask.eisen !== eisen) {
        return null;
      }
    }

    setOptimisticUpdates((prev) => ({
      ...prev,
      [result.draggableId]: { status, eisen },
    }));

    if (isInboxTaskCoreFieldEditable(inboxTask.namespace)) {
      kanbanMoveFetcher.submit(
        {
          id: result.draggableId,
          eisen: eisen?.toString() || "no-go",
          status,
        },
        {
          method: "post",
          action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
        },
      );
    } else {
      kanbanMoveFetcher.submit(
        { id: result.draggableId, eisen: "no-go", status },
        {
          method: "post",
          action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
        },
      );
    }
  }

  function handleCardMarkDone(it: InboxTask) {
    setOptimisticUpdates((prev) => ({
      ...prev,
      [it.ref_id]: {
        status: InboxTaskStatus.DONE,
        eisen: prev[it.ref_id]?.eisen ?? it.eisen,
      },
    }));
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
    setOptimisticUpdates((prev) => ({
      ...prev,
      [it.ref_id]: {
        status: InboxTaskStatus.NOT_DONE,
        eisen: prev[it.ref_id]?.eisen ?? it.eisen,
      },
    }));
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

  return (
    <LeafPanel
      key={`big-plan-${loaderData.bigPlan.ref_id}`}
      entityType={NamedEntityTag.BIG_PLAN}
      entityRefId={loaderData.bigPlan.ref_id}
      fakeKey={`big-plan-${loaderData.bigPlan.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.bigPlan.archived}
      returnLocation={"/app/workspace/big-plans"}
      shouldShowALeaflet={shouldShowALeaflet}
      initialExpansionState={LeafPanelExpansionState.MEDIUM}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaflet}>
        <GlobalError actionResult={actionData} />
        <BigPlanPropertiesEditor
          title="Properties"
          showRefreshStats
          topLevelInfo={topLevelInfo}
          lifePlan={loaderData.lifePlan}
          allAspects={loaderData.allAspects ?? []}
          allChapters={loaderData.allChapters ?? []}
          allGoals={loaderData.allGoals ?? []}
          allMilestones={loaderData.allMilestones ?? []}
          allTags={loaderData.allTags}
          tags={loaderData.tags}
          allContacts={loaderData.allContacts}
          contacts={loaderData.contacts}
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
                  link: `/app/workspace/big-plans/${loaderData.bigPlan.ref_id}/inbox-tasks/new`,
                }),
                FilterFewOptionsCompact(
                  "View",
                  selectedInboxTasksView,
                  [
                    {
                      value: InboxTasksView.KANBAN_BY_EISEN,
                      text: "Kanban by Eisen",
                      icon: <ViewKanbanIcon />,
                    },
                    {
                      value: InboxTasksView.KANBAN,
                      text: "Kanban",
                      icon: <ViewKanbanIcon />,
                    },
                    {
                      value: InboxTasksView.LIST,
                      text: "List",
                      icon: <ViewListIcon />,
                    },
                  ],
                  (selected) => setSelectedInboxTasksView(selected),
                ),
              ]}
            />
          }
        >
          {selectedInboxTasksView === InboxTasksView.KANBAN_BY_EISEN && (
            <>
              {isBigScreen && (
                <DragDropContext
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                >
                  <>
                    {EISENS.map((e) => (
                      <Fragment key={e}>
                        <StandardDivider
                          title={`${eisenIcon(e)} ${eisenName(e)}`}
                          size="large"
                        />
                        <InboxTaskKanbanBoard
                          topLevelInfo={topLevelInfo}
                          inboxTasks={sortedInboxTasks}
                          optimisticUpdates={optimisticUpdates}
                          inboxTasksByRefId={inboxTasksByRefId}
                          moreInfoByRefId={{}}
                          actionableTime={ActionableTime.NOW}
                          allowEisen={e}
                          draggedInboxTaskId={draggedInboxTaskId}
                          cardLinkResolver={(it) =>
                            `/app/workspace/big-plans/${loaderData.bigPlan.ref_id}/inbox-tasks/${it.ref_id}`
                          }
                        />
                      </Fragment>
                    ))}
                  </>
                </DragDropContext>
              )}
              {!isBigScreen && (
                <SmallScreenKanbanByEisen
                  topLevelInfo={topLevelInfo}
                  inboxTasks={sortedInboxTasks}
                  optimisticUpdates={optimisticUpdates}
                  moreInfoByRefId={{}}
                  actionableTime={ActionableTime.NOW}
                  onCardMarkDone={handleCardMarkDone}
                  onCardMarkNotDone={handleCardMarkNotDone}
                  emptyParent="inbox task"
                  cardLinkResolver={(it) =>
                    `/app/workspace/big-plans/${loaderData.bigPlan.ref_id}/inbox-tasks/${it.ref_id}`
                  }
                />
              )}
            </>
          )}

          {selectedInboxTasksView === InboxTasksView.KANBAN && (
            <>
              {isBigScreen && (
                <DragDropContext
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                >
                  <InboxTaskKanbanBoard
                    topLevelInfo={topLevelInfo}
                    inboxTasks={sortedInboxTasks}
                    optimisticUpdates={optimisticUpdates}
                    inboxTasksByRefId={inboxTasksByRefId}
                    moreInfoByRefId={{}}
                    actionableTime={ActionableTime.NOW}
                    draggedInboxTaskId={draggedInboxTaskId}
                    cardLinkResolver={(it) =>
                      `/app/workspace/big-plans/${loaderData.bigPlan.ref_id}/inbox-tasks/${it.ref_id}`
                    }
                  />
                </DragDropContext>
              )}
              {!isBigScreen && (
                <SmallScreenKanban
                  topLevelInfo={topLevelInfo}
                  inboxTasks={sortedInboxTasks}
                  optimisticUpdates={optimisticUpdates}
                  moreInfoByRefId={{}}
                  actionableTime={ActionableTime.NOW}
                  onCardMarkDone={handleCardMarkDone}
                  onCardMarkNotDone={handleCardMarkNotDone}
                  emptyParent="inbox task"
                  cardLinkResolver={(it) =>
                    `/app/workspace/big-plans/${loaderData.bigPlan.ref_id}/inbox-tasks/${it.ref_id}`
                  }
                />
              )}
            </>
          )}

          {selectedInboxTasksView === InboxTasksView.LIST && (
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
              optimisticUpdates={optimisticUpdates}
              cardLinkResolver={(it) =>
                `/app/workspace/big-plans/${loaderData.bigPlan.ref_id}/inbox-tasks/${it.ref_id}`
              }
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
