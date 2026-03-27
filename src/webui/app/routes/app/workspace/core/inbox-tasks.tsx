import type { DragStart, DropResult } from "@hello-pangea/dnd";
import { DragDropContext } from "@hello-pangea/dnd";
import type {
  InboxTask,
  InboxTaskFindResultEntry,
} from "@jupiter/webapi-client";
import {
  Eisen,
  InboxTaskSource,
  InboxTaskStatus,
  RecurringTaskPeriod,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import FlareIcon from "@mui/icons-material/Flare";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Box, Stack, Tab, Tabs, Typography, styled } from "@mui/material";
import Grid from "@mui/material/Grid2";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link, Outlet, useFetcher } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { Fragment, useContext, useState } from "react";
import { z } from "zod";
import { aDateToDate } from "@jupiter/core/common/adate";
import { eisenIcon, eisenName } from "@jupiter/core/common/eisen";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  filterInboxTasksForDisplay,
  inboxTaskFindEntryToParent,
  isInboxTaskCoreFieldEditable,
  sortInboxTasksByEisenAndDifficulty,
  sortInboxTasksNaturally,
} from "#/core/common/sub/inbox_tasks/root";
import type {
  InboxTaskOptimisticState,
  InboxTaskParent,
} from "#/core/common/sub/inbox_tasks/root";
import { InboxTaskKanbanBoard as KanbanBoard } from "@jupiter/core/common/sub/inbox_tasks/components/kanban-board";
import {
  SmallScreenKanban as SharedSmallScreenKanban,
  SmallScreenKanbanByEisen as SharedSmallScreenKanbanByEisen,
} from "@jupiter/core/common/sub/inbox_tasks/components/small-screen-kanban";
import { InboxTaskStack } from "@jupiter/core/common/sub/inbox_tasks/component/stack";
import { InboxTasksNoNothingCard } from "@jupiter/core/common/sub/inbox_tasks/component/no-nothing-card";
import { InboxTasksNoTasksCard } from "@jupiter/core/common/sub/inbox_tasks/component/no-tasks-card";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  FilterFewOptionsCompact,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { TabPanel } from "@jupiter/core/infra/component/tab-panel";
import { ServicePropertiesContext } from "@jupiter/core/config-client";
import type { SomeErrorNoData } from "@jupiter/core/infra/action-result";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "@jupiter/core/infra/actionable-time";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import type { TopLevelInfo } from "@jupiter/core/infra/top-level-context";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

enum View {
  SWIFTVIEW = "siwiftview",
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

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.inboxTasks.inboxTaskFind({
    allow_archived: false,
  });
  return json({
    entries: response.entries,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function InboxTasks() {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { entries } = useLoaderDataSafeForAnimation<typeof loader>();

  const serviceProperties = useContext(ServicePropertiesContext);

  const isBigScreen = useBigScreen();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  const sortedInboxTasks = sortInboxTasksNaturally(
    entries.map((e) => e.inbox_task),
  );
  const inboxTasksByRefId: { [key: string]: InboxTask } = {};
  for (const entry of entries) {
    inboxTasksByRefId[entry.inbox_task.ref_id] = entry.inbox_task;
  }
  const entriesByRefId: { [key: string]: InboxTaskParent } = {};
  for (const entry of entries) {
    entriesByRefId[entry.inbox_task.ref_id] = inboxTaskFindEntryToParent(entry);
  }

  const filteredSortedInboxTasks = sortedInboxTasks;

  const [selectedView, setSelectedView] = useState(View.SWIFTVIEW);

  const kanbanBoardMoveFetcher = useFetcher<SomeErrorNoData>();
  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    [key: string]: InboxTaskOptimisticState;
  }>({});
  const [draggedInboxTaskId, setDraggedInboxTaskId] = useState<
    string | undefined
  >(undefined);

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

    if (!isInboxTaskCoreFieldEditable(inboxTask.source)) {
      if (eisen && inboxTask.eisen !== eisen) {
        return null;
      }
    }

    setOptimisticUpdates((oldOptimisticUpdates) => {
      return {
        ...oldOptimisticUpdates,
        [result.draggableId]: {
          status: status,
          eisen: eisen,
        },
      };
    });

    if (isInboxTaskCoreFieldEditable(inboxTask.source)) {
      kanbanBoardMoveFetcher.submit(
        {
          id: result.draggableId,
          eisen: eisen?.toString() || "no-go",
          status: status,
        },
        {
          method: "post",
          action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
        },
      );
    } else {
      kanbanBoardMoveFetcher.submit(
        { id: result.draggableId, eisen: "no-go", status: status },
        {
          method: "post",
          action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
        },
      );
    }
  }

  function handleCardMarkDone(it: InboxTask) {
    setOptimisticUpdates((oldOptimisticUpdates) => {
      return {
        ...oldOptimisticUpdates,
        [it.ref_id]: {
          status: InboxTaskStatus.DONE,
          eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen,
        },
      };
    });

    setTimeout(() => {
      kanbanBoardMoveFetcher.submit(
        {
          id: it.ref_id,
          status: InboxTaskStatus.DONE,
        },
        {
          method: "post",
          action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
        },
      );
    }, 0);
  }

  function handleCardMarkNotDone(it: InboxTask) {
    setOptimisticUpdates((oldOptimisticUpdates) => {
      return {
        ...oldOptimisticUpdates,
        [it.ref_id]: {
          status: InboxTaskStatus.NOT_DONE,
          eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen,
        },
      };
    });

    setTimeout(() => {
      kanbanBoardMoveFetcher.submit(
        {
          id: it.ref_id,
          status: InboxTaskStatus.NOT_DONE,
        },
        {
          method: "post",
          action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
        },
      );
    }, 0);
  }

  const [selectedActionableTime, setSelectedActionableTime] = useState(
    ActionableTime.NOW,
  );

  const shouldDoAGc = figureOutIfGcIsRecommended(
    entries,
    optimisticUpdates,
    serviceProperties.inboxTasksToAskForGC,
  );

  return (
    <TrunkPanel
      key={"inbox-tasks"}
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="inbox-tasks-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterFewOptionsCompact(
              "View",
              selectedView,
              [
                {
                  value: View.SWIFTVIEW,
                  text: "SwiftView",
                  icon: <FlareIcon />,
                },
                {
                  value: View.KANBAN_BY_EISEN,
                  text: "Kanban by Eisen",
                  icon: <ViewKanbanIcon />,
                },
                {
                  value: View.KANBAN,
                  text: "Kanban",
                  icon: <ViewKanbanIcon />,
                },
                { value: View.LIST, text: "List", icon: <ViewListIcon /> },
              ],
              (selected) => setSelectedView(selected),
            ),
            FilterFewOptionsCompact(
              "Actionable",
              selectedActionableTime,
              [
                {
                  value: ActionableTime.NOW,
                  text: "From Now",
                  icon: <FlareIcon />,
                },
                {
                  value: ActionableTime.ONE_WEEK,
                  text: "From One Week",
                  icon: <FlareIcon />,
                },
                {
                  value: ActionableTime.ONE_MONTH,
                  text: "From One Month",
                  icon: <FlareIcon />,
                },
              ],
              (selected) => setSelectedActionableTime(selected),
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        {shouldDoAGc && (
          <GCSection>
            There are quite a lot of finished inbox tasks. Consider doing a{" "}
            <Link to="/app/workspace/tools/gc">GC</Link> to decultter and speed
            things up.
          </GCSection>
        )}

        <>
          <GlobalError actionResult={kanbanBoardMoveFetcher.data} />
          <FieldError
            actionResult={kanbanBoardMoveFetcher.data}
            fieldName="/status"
          />
          <FieldError
            actionResult={kanbanBoardMoveFetcher.data}
            fieldName="/eisen"
          />
        </>

        {selectedView === View.SWIFTVIEW && (
          <SwiftView
            topLevelInfo={topLevelInfo}
            isBigScreen={isBigScreen}
            inboxTasks={filteredSortedInboxTasks}
            optimisticUpdates={optimisticUpdates}
            moreInfoByRefId={entriesByRefId}
            actionableTime={selectedActionableTime}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
          />
        )}

        {selectedView === View.KANBAN_BY_EISEN && (
          <>
            {isBigScreen && (
              <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <BigScreenKanbanByEisen
                  topLevelInfo={topLevelInfo}
                  inboxTasks={filteredSortedInboxTasks}
                  optimisticUpdates={optimisticUpdates}
                  inboxTasksByRefId={inboxTasksByRefId}
                  moreInfoByRefId={entriesByRefId}
                  actionableTime={selectedActionableTime}
                  draggedInboxTaskId={draggedInboxTaskId}
                />
              </DragDropContext>
            )}

            {!isBigScreen && (
              <SharedSmallScreenKanbanByEisen
                topLevelInfo={topLevelInfo}
                inboxTasks={filteredSortedInboxTasks}
                optimisticUpdates={optimisticUpdates}
                moreInfoByRefId={entriesByRefId}
                actionableTime={selectedActionableTime}
                onCardMarkDone={handleCardMarkDone}
                onCardMarkNotDone={handleCardMarkNotDone}
                emptyParent="inbox task"
              />
            )}
          </>
        )}

        {selectedView === View.KANBAN && (
          <>
            {isBigScreen && (
              <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <BigScreenKanban
                  topLevelInfo={topLevelInfo}
                  inboxTasks={filteredSortedInboxTasks}
                  optimisticUpdates={optimisticUpdates}
                  inboxTasksByRefId={inboxTasksByRefId}
                  moreInfoByRefId={entriesByRefId}
                  actionableTime={selectedActionableTime}
                  draggedInboxTaskId={draggedInboxTaskId}
                />
              </DragDropContext>
            )}

            {!isBigScreen && (
              <SharedSmallScreenKanban
                topLevelInfo={topLevelInfo}
                inboxTasks={filteredSortedInboxTasks}
                optimisticUpdates={optimisticUpdates}
                moreInfoByRefId={entriesByRefId}
                actionableTime={selectedActionableTime}
                onCardMarkDone={handleCardMarkDone}
                onCardMarkNotDone={handleCardMarkNotDone}
                emptyParent="inbox task"
              />
            )}
          </>
        )}

        {selectedView === View.LIST && (
          <List
            topLevelInfo={topLevelInfo}
            inboxTasks={filteredSortedInboxTasks}
            optimisticUpdates={optimisticUpdates}
            moreInfoByRefId={entriesByRefId}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
          />
        )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the inbox tasks! Please try again!`,
});

const GCSection = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[100],
  color:
    theme.palette.mode === "dark"
      ? theme.palette.grey[300]
      : theme.palette.grey[900],
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  "& a": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.grey[100]
        : theme.palette.primary.dark,
    fontWeight: 600,
  },
}));

interface SwiftViewProps {
  topLevelInfo: TopLevelInfo;
  isBigScreen: boolean;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  onCardMarkDone: (inboxTask: InboxTask) => void;
  onCardMarkNotDone: (inboxTask: InboxTask) => void;
}

function SwiftView(props: SwiftViewProps) {
  const swiftViewRestSources = [
    InboxTaskSource.WORKING_MEM_CLEANUP,
    InboxTaskSource.TIME_PLAN,
    InboxTaskSource.JOURNAL,
    InboxTaskSource.METRIC,
    InboxTaskSource.LIFE_PLAN_EVAL,
    InboxTaskSource.PERSON_OCCASION,
    InboxTaskSource.PERSON_CATCH_UP,
    InboxTaskSource.SLACK_TASK,
    InboxTaskSource.EMAIL_TASK,
    InboxTaskSource.LIFE_PLAN_EVAL,
  ];

  const endOfTheWeek = aDateToDate(props.topLevelInfo.today)
    .endOf("week")
    .endOf("day");
  const endOfTheMonth = aDateToDate(props.topLevelInfo.today)
    .endOf("month")
    .endOf("day");
  const endOfTheQuarter = aDateToDate(props.topLevelInfo.today)
    .endOf("quarter")
    .endOf("day");
  const endOfTheYear = aDateToDate(props.topLevelInfo.today)
    .endOf("year")
    .endOf("day");
  const actionableTime = actionableTimeToDateTime(
    props.actionableTime,
    props.topLevelInfo.user.timezone,
  );

  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(props.inboxTasks);

  const inboxTasksForHabitsDueToday = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.HABIT],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: aDateToDate(props.topLevelInfo.today),
      allowPeriodsIfHabit: [RecurringTaskPeriod.DAILY],
    },
  );

  const inboxTasksForHabitsDueThisWeek = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.HABIT],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: endOfTheWeek,
      allowPeriodsIfHabit: [RecurringTaskPeriod.WEEKLY],
    },
  );

  const inboxTasksForHabitsDueThisMonth = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.HABIT],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: endOfTheMonth,
      allowPeriodsIfHabit: [RecurringTaskPeriod.MONTHLY],
    },
  );

  const inboxTasksForHabitsDueThisQuarter = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.HABIT],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: endOfTheQuarter,
      allowPeriodsIfHabit: [RecurringTaskPeriod.QUARTERLY],
    },
  );

  const inboxTasksForHabitsDueThisYear = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.HABIT],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      includeIfNoDueDate: true,
      dueDateEnd: endOfTheYear,
      allowPeriodsIfHabit: [RecurringTaskPeriod.YEARLY],
    },
  );

  const inboxTasksForChoresDueToday = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.CHORE],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: aDateToDate(props.topLevelInfo.today),
      allowPeriodsIfChore: [RecurringTaskPeriod.DAILY],
    },
  );

  const inboxTasksForChoresDueThisWeek = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.CHORE],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: endOfTheWeek,
      allowPeriodsIfChore: [RecurringTaskPeriod.WEEKLY],
    },
  );

  const inboxTasksForChoresDueThisMonth = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.CHORE],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: endOfTheMonth,
      allowPeriodsIfChore: [RecurringTaskPeriod.MONTHLY],
    },
  );

  const inboxTasksForChoresDueThisQuarter = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.CHORE],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: endOfTheQuarter,
      allowPeriodsIfChore: [RecurringTaskPeriod.QUARTERLY],
    },
  );

  const inboxTasksForChoresDueThisYear = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.CHORE],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      includeIfNoDueDate: true,
      dueDateEnd: endOfTheYear,
      allowPeriodsIfChore: [RecurringTaskPeriod.YEARLY],
    },
  );

  const inboxTasksForRestsDueToday = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: swiftViewRestSources,
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: aDateToDate(props.topLevelInfo.today),
    },
  );

  const inboxTasksForRestsDueThisWeek = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: swiftViewRestSources,
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateStart: aDateToDate(props.topLevelInfo.today),
      dueDateEnd: endOfTheWeek,
    },
  );

  const inboxTasksForRestsDueThisMonth = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: swiftViewRestSources,
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateStart: endOfTheWeek,
      dueDateEnd: endOfTheMonth,
    },
  );

  const inboxTasksForRestsDueThisQuarter = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: swiftViewRestSources,
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateStart: endOfTheMonth,
      dueDateEnd: endOfTheQuarter,
    },
  );

  const inboxTasksForRestsDueThisYear = filterInboxTasksForDisplay(
    sortedInboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowSources: swiftViewRestSources,
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      includeIfNoDueDate: true,
      dueDateStart: endOfTheQuarter,
      dueDateEnd: endOfTheYear,
    },
  );

  const habitsStack = (
    <Stack>
      <AnimatePresence>
        <InboxTaskStack
          key="habit-due-today"
          topLevelInfo={props.topLevelInfo}
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due Today"
          inboxTasks={inboxTasksForHabitsDueToday}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="habit-due-this-week"
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Week"
          inboxTasks={inboxTasksForHabitsDueThisWeek}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="habit-due-this-month"
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Month"
          inboxTasks={inboxTasksForHabitsDueThisMonth}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="habit-due-this-quarter"
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Quarter"
          inboxTasks={inboxTasksForHabitsDueThisQuarter}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="habit-due-this-year"
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Year"
          inboxTasks={inboxTasksForHabitsDueThisYear}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />
      </AnimatePresence>
    </Stack>
  );

  const choresStack = (
    <Stack>
      <AnimatePresence>
        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="chore-due-today"
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due Today"
          inboxTasks={inboxTasksForChoresDueToday}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="chore-due-this-week"
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Week"
          inboxTasks={inboxTasksForChoresDueThisWeek}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="chore-due-this-month"
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Month"
          inboxTasks={inboxTasksForChoresDueThisMonth}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="chore-due-this-quarter"
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Quarter"
          inboxTasks={inboxTasksForChoresDueThisQuarter}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="chore-due-this-year"
          showOptions={{
            showStatus: true,
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Year"
          inboxTasks={inboxTasksForChoresDueThisYear}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />
      </AnimatePresence>
    </Stack>
  );

  const restStack = (
    <Stack>
      <AnimatePresence>
        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="rest-due-today"
          showOptions={{
            showStatus: true,
            showSource: true,
            showEisen: true,
            showDifficulty: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due Today"
          inboxTasks={inboxTasksForRestsDueToday}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="rest-due-this-week"
          showOptions={{
            showStatus: true,
            showSource: true,
            showEisen: true,
            showDifficulty: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Week"
          inboxTasks={inboxTasksForRestsDueThisWeek}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="rest-due-this-month"
          showOptions={{
            showStatus: true,
            showSource: true,
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Month"
          inboxTasks={inboxTasksForRestsDueThisMonth}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="rest-due-this-quarter"
          showOptions={{
            showStatus: true,
            showSource: true,
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Quarter"
          inboxTasks={inboxTasksForRestsDueThisQuarter}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="rest-due-this-year"
          showOptions={{
            showStatus: true,
            showSource: true,
            showEisen: true,
            showDifficulty: true,
            showDueDate: true,
            showParent: true,
            showHandleMarkDone: true,
            showHandleMarkNotDone: true,
          }}
          label="Due This Year"
          inboxTasks={inboxTasksForRestsDueThisYear}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />
      </AnimatePresence>
    </Stack>
  );

  const noHabits =
    inboxTasksForHabitsDueToday.length === 0 &&
    inboxTasksForHabitsDueThisWeek.length === 0 &&
    inboxTasksForHabitsDueThisMonth.length === 0 &&
    inboxTasksForHabitsDueThisQuarter.length === 0 &&
    inboxTasksForHabitsDueThisYear.length === 0;
  const noChores =
    inboxTasksForChoresDueToday.length === 0 &&
    inboxTasksForChoresDueThisWeek.length === 0 &&
    inboxTasksForChoresDueThisMonth.length === 0 &&
    inboxTasksForChoresDueThisQuarter.length === 0 &&
    inboxTasksForChoresDueThisYear.length === 0;
  const noRests =
    inboxTasksForRestsDueToday.length === 0 &&
    inboxTasksForRestsDueThisWeek.length === 0 &&
    inboxTasksForRestsDueThisMonth.length === 0 &&
    inboxTasksForRestsDueThisQuarter.length === 0 &&
    inboxTasksForRestsDueThisYear.length === 0;
  const noNothing = noHabits && noChores && noRests;

  const noHabitsCard = (
    <InboxTasksNoTasksCard
      parent="habit"
      parentLabel="New Habit"
      parentNewLocations="/app/workspace/habits/new"
    />
  );
  const noChoresCard = (
    <InboxTasksNoTasksCard
      parent="chore"
      parentLabel="New Chore"
      parentNewLocations="/app/workspace/chores/new"
    />
  );
  const noRestsCard = <InboxTasksNoTasksCard parent="inbox task" />;
  const noNothingCard = (
    <InboxTasksNoNothingCard topLevelInfo={props.topLevelInfo} />
  );

  let initialSmallScreenSelectedTab = 0;
  if (!noHabits) {
    initialSmallScreenSelectedTab = 0;
  } else if (!noChores) {
    initialSmallScreenSelectedTab = 1;
  } else if (!noRests) {
    initialSmallScreenSelectedTab = 2;
  }

  const [smallScreenSelectedTab, setSmallScreenSelectedTab] = useState(
    initialSmallScreenSelectedTab,
  );

  if (noNothing) {
    return <>{noNothingCard}</>;
  }

  return (
    <Grid container spacing={2}>
      {props.isBigScreen && !noNothing && (
        <>
          {isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.HABITS,
          ) && (
            <Grid size={{ md: 4 }}>
              <Typography variant="h5">💪 Habits</Typography>
              {!noHabits && habitsStack}
              {noHabits && noHabitsCard}
            </Grid>
          )}

          {isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.CHORES,
          ) && (
            <Grid size={{ md: 4 }}>
              <Typography variant="h5">♻️ Chores</Typography>
              {!noChores && choresStack}
              {noChores && noChoresCard}
            </Grid>
          )}

          <Grid size={{ md: 4 }}>
            <Typography variant="h5">🌍 Other Tasks</Typography>
            {!noRests && restStack}
            {noRests && noRestsCard}
          </Grid>
        </>
      )}

      {!props.isBigScreen && !noNothing && (
        <Grid size={{ xs: 12 }}>
          <Tabs
            value={smallScreenSelectedTab}
            variant="fullWidth"
            onChange={(_, newValue) => setSmallScreenSelectedTab(newValue)}
          >
            <Tab icon={<p>💪</p>} iconPosition="top" label="Habits" />
            <Tab icon={<p>♻️</p>} iconPosition="top" label="Chores" />
            <Tab icon={<p>🌍</p>} iconPosition="top" label="Rest" />
          </Tabs>

          <TabPanel value={smallScreenSelectedTab} index={0}>
            {!noHabits && habitsStack}
            {noHabits && noHabitsCard}
          </TabPanel>

          <TabPanel value={smallScreenSelectedTab} index={1}>
            {!noChores && choresStack}
            {noChores && noChoresCard}
          </TabPanel>

          <TabPanel value={smallScreenSelectedTab} index={2}>
            {!noRests && restStack}
            {noRests && noRestsCard}
          </TabPanel>
        </Grid>
      )}
    </Grid>
  );
}

interface BigScreenKanbanByEisenProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  inboxTasksByRefId: { [key: string]: InboxTask };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  draggedInboxTaskId?: string;
}

function BigScreenKanbanByEisen({
  topLevelInfo,
  inboxTasks,
  optimisticUpdates,
  inboxTasksByRefId,
  moreInfoByRefId,
  actionableTime,
  draggedInboxTaskId,
}: BigScreenKanbanByEisenProps) {
  return (
    <>
      {inboxTasks.length === 0 && <InboxTasksNoTasksCard parent="inbox task" />}
      {inboxTasks.length > 0 && (
        <>
          {EISENS.map((e) => {
            return (
              <Fragment key={e}>
                <StandardDivider
                  title={`${eisenIcon(e)} ${eisenName(e)}`}
                  size="large"
                />
                <KanbanBoard
                  topLevelInfo={topLevelInfo}
                  inboxTasks={inboxTasks}
                  optimisticUpdates={optimisticUpdates}
                  inboxTasksByRefId={inboxTasksByRefId}
                  moreInfoByRefId={moreInfoByRefId}
                  actionableTime={actionableTime}
                  allowEisen={e}
                  draggedInboxTaskId={draggedInboxTaskId}
                />
              </Fragment>
            );
          })}
        </>
      )}
    </>
  );
}

interface BigScreenKanbanProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  inboxTasksByRefId: { [key: string]: InboxTask };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  allowEisen?: Eisen;
  draggedInboxTaskId?: string;
}

function BigScreenKanban({
  topLevelInfo,
  inboxTasks,
  optimisticUpdates,
  inboxTasksByRefId,
  moreInfoByRefId,
  actionableTime,
  allowEisen,
  draggedInboxTaskId,
}: BigScreenKanbanProps) {
  return (
    <>
      {inboxTasks.length === 0 && <InboxTasksNoTasksCard parent="inbox task" />}
      {inboxTasks.length > 0 && (
        <KanbanBoard
          topLevelInfo={topLevelInfo}
          inboxTasks={inboxTasks}
          optimisticUpdates={optimisticUpdates}
          inboxTasksByRefId={inboxTasksByRefId}
          moreInfoByRefId={moreInfoByRefId}
          actionableTime={actionableTime}
          allowEisen={allowEisen}
          draggedInboxTaskId={draggedInboxTaskId}
        />
      )}
    </>
  );
}

interface ListProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  onCardMarkDone?: (it: InboxTask) => void;
  onCardMarkNotDone?: (it: InboxTask) => void;
}

function List({
  topLevelInfo,
  inboxTasks,
  moreInfoByRefId,
  optimisticUpdates,
  onCardMarkDone,
  onCardMarkNotDone,
}: ListProps) {
  return (
    <>
      {inboxTasks.length === 0 && <InboxTasksNoTasksCard parent="inbox task" />}
      <InboxTaskStack
        topLevelInfo={topLevelInfo}
        showOptions={{
          showStatus: true,
          showSource: true,
          showEisen: true,
          showDifficulty: true,
          showActionableDate: true,
          showDueDate: true,
          showParent: true,
          showHandleMarkDone: true,
          showHandleMarkNotDone: true,
        }}
        inboxTasks={inboxTasks}
        moreInfoByRefId={moreInfoByRefId}
        optimisticUpdates={optimisticUpdates}
        onCardMarkDone={onCardMarkDone}
        onCardMarkNotDone={onCardMarkNotDone}
      />
    </>
  );
}

function figureOutIfGcIsRecommended(
  entries: Array<InboxTaskFindResultEntry>,
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState },
  inboxTasksToAskForGC: number,
): boolean {
  let finishedTasksCnt = 0;

  for (const entry of entries) {
    if (entry.inbox_task.ref_id in optimisticUpdates) {
      if (
        optimisticUpdates[entry.inbox_task.ref_id].status ===
        InboxTaskStatus.DONE
      ) {
        finishedTasksCnt++;
      } else if (
        optimisticUpdates[entry.inbox_task.ref_id].status ===
        InboxTaskStatus.NOT_DONE
      ) {
        finishedTasksCnt++;
      }
    } else if (entry.inbox_task.status === InboxTaskStatus.DONE) {
      finishedTasksCnt++;
    } else if (entry.inbox_task.status === InboxTaskStatus.NOT_DONE) {
      finishedTasksCnt++;
    }
  }

  return finishedTasksCnt > inboxTasksToAskForGC;
}
