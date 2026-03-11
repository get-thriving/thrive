import type {
  DragStart,
  DropResult,
  DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type {
  Goal,
  InboxTask,
  InboxTaskFindResultEntry,
  Project,
  Tag,
  Contact,
  ProjectSummary,
} from "@jupiter/webapi-client";
import {
  Eisen,
  InboxTaskSource,
  InboxTaskStatus,
  RecurringTaskPeriod,
  TagNamespace,
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
import { Fragment, memo, useContext, useMemo, useState } from "react";
import { z } from "zod";
import { aDateToDate } from "@jupiter/core/common/adate";
import { eisenIcon, eisenName } from "@jupiter/core/common/eisen";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { sortProjectsByTreeOrder } from "@jupiter/core/life_plan/sub/aspects/root";
import { sortGoalsNaturally } from "@jupiter/core/life_plan/sub/goals/root";
import {
  inboxTaskStatusIcon,
  inboxTaskStatusName,
} from "@jupiter/core/inbox_tasks/status";
import {
  canInboxTaskBeInStatus,
  filterInboxTasksForDisplay,
  inboxTaskFindEntryToParent,
  isInboxTaskCoreFieldEditable,
  sortInboxTasksByEisenAndDifficulty,
  sortInboxTasksNaturally,
} from "@jupiter/core/inbox_tasks/root";
import type {
  InboxTaskOptimisticState,
  InboxTaskParent,
} from "@jupiter/core/inbox_tasks/root";
import type { InboxTaskShowOptions } from "@jupiter/core/inbox_tasks/component/card";
import { InboxTaskCard } from "@jupiter/core/inbox_tasks/component/card";
import { InboxTaskStack } from "@jupiter/core/inbox_tasks/component/stack";
import { InboxTaskStatusTag } from "@jupiter/core/inbox_tasks/component/status-tag";
import { InboxTasksNoNothingCard } from "@jupiter/core/inbox_tasks/component/no-nothing-card";
import { InboxTasksNoTasksCard } from "@jupiter/core/inbox_tasks/component/no-tasks-card";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  FilterFewOptionsCompact,
  SectionActions,
  FilterManyOptions,
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

enum DragTargetStatus {
  SOURCE_DRAG,
  SELECT_DRAG,
  ALLOW_DRAG,
  FORBID_DRAG,
  FREE,
}

enum View {
  SWIFTVIEW = "siwiftview",
  KANBAN_BY_EISEN = "kanban-by-eisen",
  KANBAN_BY_PROJECT_AND_GOAL = "kanban-by-project-and-goal",
  KANBAN_BY_PROJECT = "kanban-by-project",
  KANBAN = "kanban",
  LIST_BY_PROJECT_AND_GOAL = "list-by-project-and-goal",
  LIST_BY_PROJECT = "list-by-project",
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
    include_notes: false,
    include_time_event_blocks: false,
    include_tags: true,
  });
  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.INBOX_TASK],
  });
  const allContacts = await apiClient.contacts.contactFind({
    allow_archived: false,
  });
  return json({
    entries: response.entries,
    allTags: allTags.tags as Array<Tag>,
    allContacts: allContacts.contacts as Array<Contact>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function InboxTasks() {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { entries, allTags, allContacts } =
    useLoaderDataSafeForAnimation<typeof loader>();

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

  const inboxTaskTagsByInboxTaskRefId = new Map<string, Array<Tag>>();
  for (const entry of entries) {
    inboxTaskTagsByInboxTaskRefId.set(
      entry.inbox_task.ref_id,
      entry.tags ?? [],
    );
  }

  const inboxTaskContactsByInboxTaskRefId = new Map<string, Array<Contact>>();
  for (const entry of entries) {
    inboxTaskContactsByInboxTaskRefId.set(
      entry.inbox_task.ref_id,
      (
        entry as InboxTaskFindResultEntry & {
          contacts?: Array<Contact>;
        }
      ).contacts ?? [],
    );
  }

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = useState<string[]>(
    [],
  );
  const filteredSortedInboxTasks = sortedInboxTasks.filter((it) => {
    // Filter by both tags and contacts
    const noTagFilter = selectedTagsRefId.length === 0;
    const noContactFilter = selectedContactsRefId.length === 0;

    const tags = inboxTaskTagsByInboxTaskRefId.get(it.ref_id) ?? [];
    const contacts = inboxTaskContactsByInboxTaskRefId.get(it.ref_id) ?? [];

    const matchTag =
      noTagFilter ||
      tags.some((tag: Tag) => selectedTagsRefId.includes(tag.ref_id));

    const matchContact =
      noContactFilter ||
      contacts.some((contact: Contact) =>
        selectedContactsRefId.includes(contact.ref_id),
      );

    return matchTag && matchContact;
  });

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
          action: "/app/workspace/inbox-tasks/update-status-and-eisen",
        },
      );
    } else {
      kanbanBoardMoveFetcher.submit(
        { id: result.draggableId, eisen: "no-go", status: status },
        {
          method: "post",
          action: "/app/workspace/inbox-tasks/update-status-and-eisen",
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
          action: "/app/workspace/inbox-tasks/update-status-and-eisen",
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
          action: "/app/workspace/inbox-tasks/update-status-and-eisen",
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
      createLocation="/app/workspace/inbox-tasks/new"
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
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.KANBAN_BY_PROJECT_AND_GOAL,
                  text: "Kanban by Project & Goal",
                  icon: <ViewKanbanIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.KANBAN_BY_PROJECT,
                  text: "Kanban by Project",
                  icon: <ViewKanbanIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.KANBAN,
                  text: "Kanban",
                  icon: <ViewKanbanIcon />,
                },
                {
                  value: View.LIST_BY_PROJECT_AND_GOAL,
                  text: "List by Project & Goal",
                  icon: <ViewListIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.LIST_BY_PROJECT,
                  text: "List by Project",
                  icon: <ViewListIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
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
            FilterManyOptions(
              "Tags",
              allTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              setSelectedTagsRefId,
            ),
            FilterManyOptions(
              "Contacts",
              allContacts.map((contact) => ({
                value: contact.ref_id,
                text: contact.name,
              })),
              setSelectedContactsRefId,
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
            inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
            inboxTaskContactsByInboxTaskRefId={
              inboxTaskContactsByInboxTaskRefId
            }
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
                  inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                  inboxTaskContactsByInboxTaskRefId={
                    inboxTaskContactsByInboxTaskRefId
                  }
                />
              </DragDropContext>
            )}

            {!isBigScreen && (
              <SmallScreenKanbanByEisen
                topLevelInfo={topLevelInfo}
                inboxTasks={filteredSortedInboxTasks}
                optimisticUpdates={optimisticUpdates}
                moreInfoByRefId={entriesByRefId}
                actionableTime={selectedActionableTime}
                onCardMarkDone={handleCardMarkDone}
                onCardMarkNotDone={handleCardMarkNotDone}
                inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                inboxTaskContactsByInboxTaskRefId={
                  inboxTaskContactsByInboxTaskRefId
                }
              />
            )}
          </>
        )}

        {selectedView === View.KANBAN_BY_PROJECT_AND_GOAL && (
          <>
            {isBigScreen && (
              <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <BigScreenKanbanByProjectAndGoal
                  topLevelInfo={topLevelInfo}
                  inboxTasks={filteredSortedInboxTasks}
                  optimisticUpdates={optimisticUpdates}
                  inboxTasksByRefId={inboxTasksByRefId}
                  moreInfoByRefId={entriesByRefId}
                  actionableTime={selectedActionableTime}
                  draggedInboxTaskId={draggedInboxTaskId}
                  inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                  inboxTaskContactsByInboxTaskRefId={
                    inboxTaskContactsByInboxTaskRefId
                  }
                />
              </DragDropContext>
            )}

            {!isBigScreen && (
              <SmallScreenKanbanByProjectAndGoal
                topLevelInfo={topLevelInfo}
                inboxTasks={filteredSortedInboxTasks}
                optimisticUpdates={optimisticUpdates}
                moreInfoByRefId={entriesByRefId}
                actionableTime={selectedActionableTime}
                onCardMarkDone={handleCardMarkDone}
                onCardMarkNotDone={handleCardMarkNotDone}
                inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                inboxTaskContactsByInboxTaskRefId={
                  inboxTaskContactsByInboxTaskRefId
                }
              />
            )}
          </>
        )}

        {selectedView === View.KANBAN_BY_PROJECT && (
          <>
            {isBigScreen && (
              <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <BigScreenKanbanByProject
                  topLevelInfo={topLevelInfo}
                  inboxTasks={filteredSortedInboxTasks}
                  optimisticUpdates={optimisticUpdates}
                  inboxTasksByRefId={inboxTasksByRefId}
                  moreInfoByRefId={entriesByRefId}
                  actionableTime={selectedActionableTime}
                  draggedInboxTaskId={draggedInboxTaskId}
                  inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                  inboxTaskContactsByInboxTaskRefId={
                    inboxTaskContactsByInboxTaskRefId
                  }
                />
              </DragDropContext>
            )}

            {!isBigScreen && (
              <SmallScreenKanbanByProject
                topLevelInfo={topLevelInfo}
                inboxTasks={filteredSortedInboxTasks}
                optimisticUpdates={optimisticUpdates}
                moreInfoByRefId={entriesByRefId}
                actionableTime={selectedActionableTime}
                onCardMarkDone={handleCardMarkDone}
                onCardMarkNotDone={handleCardMarkNotDone}
                inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                inboxTaskContactsByInboxTaskRefId={
                  inboxTaskContactsByInboxTaskRefId
                }
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
                  inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                  inboxTaskContactsByInboxTaskRefId={
                    inboxTaskContactsByInboxTaskRefId
                  }
                />
              </DragDropContext>
            )}

            {!isBigScreen && (
              <SmallScreenKanban
                topLevelInfo={topLevelInfo}
                inboxTasks={filteredSortedInboxTasks}
                optimisticUpdates={optimisticUpdates}
                moreInfoByRefId={entriesByRefId}
                actionableTime={selectedActionableTime}
                onCardMarkDone={handleCardMarkDone}
                onCardMarkNotDone={handleCardMarkNotDone}
                inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                inboxTaskContactsByInboxTaskRefId={
                  inboxTaskContactsByInboxTaskRefId
                }
              />
            )}
          </>
        )}

        {selectedView === View.LIST_BY_PROJECT_AND_GOAL && (
          <ListByProjectAndGoal
            topLevelInfo={topLevelInfo}
            inboxTasks={filteredSortedInboxTasks}
            optimisticUpdates={optimisticUpdates}
            moreInfoByRefId={entriesByRefId}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
            inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
            inboxTaskContactsByInboxTaskRefId={
              inboxTaskContactsByInboxTaskRefId
            }
          />
        )}

        {selectedView === View.LIST_BY_PROJECT && (
          <ListByProject
            topLevelInfo={topLevelInfo}
            inboxTasks={filteredSortedInboxTasks}
            optimisticUpdates={optimisticUpdates}
            moreInfoByRefId={entriesByRefId}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
            inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
            inboxTaskContactsByInboxTaskRefId={
              inboxTaskContactsByInboxTaskRefId
            }
          />
        )}

        {selectedView === View.LIST && (
          <List
            topLevelInfo={topLevelInfo}
            inboxTasks={filteredSortedInboxTasks}
            optimisticUpdates={optimisticUpdates}
            moreInfoByRefId={entriesByRefId}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
            inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
            inboxTaskContactsByInboxTaskRefId={
              inboxTaskContactsByInboxTaskRefId
            }
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
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function SwiftView(props: SwiftViewProps) {
  const swiftViewRestSources = [
    InboxTaskSource.USER,
    InboxTaskSource.WORKING_MEM_CLEANUP,
    InboxTaskSource.TIME_PLAN,
    InboxTaskSource.BIG_PLAN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
        InboxTaskStatus.NOT_STARTED_GEN,
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
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="habit-due-this-week"
          showOptions={{
            showStatus: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="habit-due-this-month"
          showOptions={{
            showStatus: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="habit-due-this-quarter"
          showOptions={{
            showStatus: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="habit-due-this-year"
          showOptions={{
            showStatus: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
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
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="chore-due-this-week"
          showOptions={{
            showStatus: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="chore-due-this-month"
          showOptions={{
            showStatus: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="chore-due-this-quarter"
          showOptions={{
            showStatus: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="chore-due-this-year"
          showOptions={{
            showStatus: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
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
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="rest-due-this-week"
          showOptions={{
            showStatus: true,
            showSource: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="rest-due-this-month"
          showOptions={{
            showStatus: true,
            showSource: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="rest-due-this-quarter"
          showOptions={{
            showStatus: true,
            showSource: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />

        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          key="rest-due-this-year"
          showOptions={{
            showStatus: true,
            showSource: true,
            showLifePlan: true,
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
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
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
  const noRestsCard = (
    <InboxTasksNoTasksCard
      parent="inbox task"
      parentLabel="New Task"
      parentNewLocations="/app/workspace/inbox-tasks/new"
    />
  );
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
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function BigScreenKanbanByEisen({
  topLevelInfo,
  inboxTasks,
  optimisticUpdates,
  inboxTasksByRefId,
  moreInfoByRefId,
  actionableTime,
  draggedInboxTaskId,
  inboxTaskTagsByInboxTaskRefId,
  inboxTaskContactsByInboxTaskRefId,
}: BigScreenKanbanByEisenProps) {
  return (
    <>
      {inboxTasks.length === 0 && (
        <InboxTasksNoTasksCard
          parent="inbox task"
          parentLabel="New Task"
          parentNewLocations="/app/workspace/inbox-tasks/new"
        />
      )}
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
                  inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                  inboxTaskContactsByInboxTaskRefId={
                    inboxTaskContactsByInboxTaskRefId
                  }
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
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
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
  inboxTaskTagsByInboxTaskRefId,
  inboxTaskContactsByInboxTaskRefId,
}: BigScreenKanbanProps) {
  return (
    <>
      {inboxTasks.length === 0 && (
        <InboxTasksNoTasksCard
          parent="inbox task"
          parentLabel="New Task"
          parentNewLocations="/app/workspace/inbox-tasks/new"
        />
      )}
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
          inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={inboxTaskContactsByInboxTaskRefId}
        />
      )}
    </>
  );
}

interface KanbanBoardProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  inboxTasksByRefId: { [key: string]: InboxTask };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  allowEisen?: Eisen;
  groupId?: string;
  draggedInboxTaskId?: string;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function KanbanBoard({
  topLevelInfo,
  inboxTasks,
  inboxTasksByRefId,
  moreInfoByRefId,
  actionableTime,
  allowEisen,
  groupId,
  optimisticUpdates,
  draggedInboxTaskId,
  inboxTaskTagsByInboxTaskRefId,
  inboxTaskContactsByInboxTaskRefId,
}: KanbanBoardProps) {
  return (
    <Grid container spacing={2} style={{ paddingBottom: "1.25rem" }}>
      <Grid size={{ xs: 2 }} sx={{ position: "relative" }}>
        <InboxTasksColumn
          topLevelInfo={topLevelInfo}
          inboxTasks={inboxTasks}
          optimisticUpdates={optimisticUpdates}
          inboxTasksByRefId={inboxTasksByRefId}
          moreInfoByRefId={moreInfoByRefId}
          actionableTime={actionableTime}
          allowStatus={InboxTaskStatus.NOT_STARTED}
          allowEisen={allowEisen}
          groupId={groupId}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: allowEisen === undefined,
            showDifficulty: true,
            showDueDate: true,
          }}
          draggedInboxTaskId={draggedInboxTaskId}
          inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={inboxTaskContactsByInboxTaskRefId}
        />
      </Grid>

      <Grid size={{ xs: 2 }} sx={{ position: "relative" }}>
        <InboxTasksColumn
          topLevelInfo={topLevelInfo}
          inboxTasks={inboxTasks}
          optimisticUpdates={optimisticUpdates}
          inboxTasksByRefId={inboxTasksByRefId}
          moreInfoByRefId={moreInfoByRefId}
          actionableTime={actionableTime}
          allowStatus={InboxTaskStatus.NOT_STARTED_GEN}
          allowEisen={allowEisen}
          groupId={groupId}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: allowEisen === undefined,
            showDifficulty: true,
            showDueDate: true,
          }}
          draggedInboxTaskId={draggedInboxTaskId}
          inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={inboxTaskContactsByInboxTaskRefId}
        />
      </Grid>

      <Grid size={{ xs: 2 }} sx={{ position: "relative" }}>
        <InboxTasksColumn
          topLevelInfo={topLevelInfo}
          inboxTasks={inboxTasks}
          optimisticUpdates={optimisticUpdates}
          inboxTasksByRefId={inboxTasksByRefId}
          moreInfoByRefId={moreInfoByRefId}
          actionableTime={actionableTime}
          allowStatus={InboxTaskStatus.IN_PROGRESS}
          allowEisen={allowEisen}
          groupId={groupId}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: allowEisen === undefined,
            showDifficulty: true,
            showDueDate: true,
          }}
          draggedInboxTaskId={draggedInboxTaskId}
          inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={inboxTaskContactsByInboxTaskRefId}
        />
      </Grid>

      <Grid size={{ xs: 2 }} sx={{ position: "relative" }}>
        <InboxTasksColumn
          topLevelInfo={topLevelInfo}
          inboxTasks={inboxTasks}
          optimisticUpdates={optimisticUpdates}
          inboxTasksByRefId={inboxTasksByRefId}
          moreInfoByRefId={moreInfoByRefId}
          actionableTime={actionableTime}
          allowStatus={InboxTaskStatus.BLOCKED}
          allowEisen={allowEisen}
          groupId={groupId}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: allowEisen === undefined,
            showDifficulty: true,
            showDueDate: true,
          }}
          draggedInboxTaskId={draggedInboxTaskId}
          inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={inboxTaskContactsByInboxTaskRefId}
        />
      </Grid>

      <Grid size={{ xs: 2 }} sx={{ position: "relative" }}>
        <InboxTasksColumn
          topLevelInfo={topLevelInfo}
          inboxTasks={inboxTasks}
          optimisticUpdates={optimisticUpdates}
          inboxTasksByRefId={inboxTasksByRefId}
          moreInfoByRefId={moreInfoByRefId}
          actionableTime={actionableTime}
          allowStatus={InboxTaskStatus.NOT_DONE}
          allowEisen={allowEisen}
          groupId={groupId}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: allowEisen === undefined,
            showDifficulty: true,
            showDueDate: true,
          }}
          draggedInboxTaskId={draggedInboxTaskId}
          inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={inboxTaskContactsByInboxTaskRefId}
        />
      </Grid>

      <Grid size={{ xs: 2 }} sx={{ position: "relative" }}>
        <InboxTasksColumn
          topLevelInfo={topLevelInfo}
          inboxTasks={inboxTasks}
          optimisticUpdates={optimisticUpdates}
          inboxTasksByRefId={inboxTasksByRefId}
          moreInfoByRefId={moreInfoByRefId}
          actionableTime={actionableTime}
          allowStatus={InboxTaskStatus.DONE}
          allowEisen={allowEisen}
          groupId={groupId}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: allowEisen === undefined,
            showDifficulty: true,
            showDueDate: true,
          }}
          draggedInboxTaskId={draggedInboxTaskId}
          inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={inboxTaskContactsByInboxTaskRefId}
        />
      </Grid>
    </Grid>
  );
}

interface SmallScreenKanbanByEisenProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  onCardMarkDone?: (it: InboxTask) => void;
  onCardMarkNotDone?: (it: InboxTask) => void;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function SmallScreenKanbanByEisen(props: SmallScreenKanbanByEisenProps) {
  const actionableDate = actionableTimeToDateTime(
    props.actionableTime,
    props.topLevelInfo.user.timezone,
  );
  const importantAndUrgentTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowEisens: [Eisen.IMPORTANT_AND_URGENT],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );
  const urgentTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowEisens: [Eisen.URGENT],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );
  const importantTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowEisens: [Eisen.IMPORTANT],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );
  const regularTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowEisens: [Eisen.REGULAR],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );

  let initialSmallScreenSelectedTab = 0;
  if (importantAndUrgentTasks.length > 0) {
    initialSmallScreenSelectedTab = 0;
  } else if (urgentTasks.length > 0) {
    initialSmallScreenSelectedTab = 1;
  } else if (importantTasks.length > 0) {
    initialSmallScreenSelectedTab = 2;
  } else if (regularTasks.length > 0) {
    initialSmallScreenSelectedTab = 3;
  }

  const [smallScreenSelectedTab, setSmallScreenSelectedTab] = useState(
    initialSmallScreenSelectedTab,
  );

  return (
    <>
      <Tabs
        value={smallScreenSelectedTab}
        variant="fullWidth"
        onChange={(_, newValue) => setSmallScreenSelectedTab(newValue)}
      >
        <Tab
          sx={{ minWidth: "25%" }}
          icon={eisenIcon(Eisen.IMPORTANT_AND_URGENT)}
        />
        <Tab sx={{ minWidth: "25%" }} icon={eisenIcon(Eisen.URGENT)} />
        <Tab sx={{ minWidth: "25%" }} icon={eisenIcon(Eisen.IMPORTANT)} />
        <Tab sx={{ minWidth: "25%" }} icon={eisenIcon(Eisen.REGULAR)} />
      </Tabs>

      <TabPanel value={smallScreenSelectedTab} index={0}>
        <SmallScreenKanban
          topLevelInfo={props.topLevelInfo}
          inboxTasks={importantAndUrgentTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          allowEisen={Eisen.IMPORTANT_AND_URGENT}
          actionableTime={props.actionableTime}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
        />
      </TabPanel>

      <TabPanel value={smallScreenSelectedTab} index={1}>
        <SmallScreenKanban
          topLevelInfo={props.topLevelInfo}
          inboxTasks={urgentTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          allowEisen={Eisen.URGENT}
          actionableTime={props.actionableTime}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
        />
      </TabPanel>

      <TabPanel value={smallScreenSelectedTab} index={2}>
        <SmallScreenKanban
          topLevelInfo={props.topLevelInfo}
          inboxTasks={importantTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          allowEisen={Eisen.IMPORTANT}
          actionableTime={props.actionableTime}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
        />
      </TabPanel>

      <TabPanel value={smallScreenSelectedTab} index={3}>
        <SmallScreenKanban
          topLevelInfo={props.topLevelInfo}
          inboxTasks={regularTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          allowEisen={Eisen.REGULAR}
          actionableTime={props.actionableTime}
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
        />
      </TabPanel>
    </>
  );
}

interface SmallScreenKanbanProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  allowEisen?: Eisen;
  actionableTime: ActionableTime;
  onCardMarkDone?: (it: InboxTask) => void;
  onCardMarkNotDone?: (it: InboxTask) => void;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function SmallScreenKanban(props: SmallScreenKanbanProps) {
  const actionableDate = actionableTimeToDateTime(
    props.actionableTime,
    props.topLevelInfo.user.timezone,
  );
  const notStartedTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.NOT_STARTED],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );
  const recurringTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.NOT_STARTED_GEN],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );
  const inProgressTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.IN_PROGRESS],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );
  const blockedTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.BLOCKED],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );
  const notDoneTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.NOT_DONE],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );
  const doneTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [InboxTaskStatus.DONE],
      includeIfNoActionableDate: true,
      includeIfNoDueDate: true,
      actionableDateEnd: actionableDate,
    },
  );

  let initialSmallScreenSelectedTab = 0;
  if (notStartedTasks.length > 0) {
    initialSmallScreenSelectedTab = 0;
  } else if (recurringTasks.length > 0) {
    initialSmallScreenSelectedTab = 1;
  } else if (inProgressTasks.length > 0) {
    initialSmallScreenSelectedTab = 2;
  } else if (blockedTasks.length > 0) {
    initialSmallScreenSelectedTab = 3;
  } else if (notDoneTasks.length > 0) {
    initialSmallScreenSelectedTab = 4;
  } else if (doneTasks.length > 0) {
    initialSmallScreenSelectedTab = 5;
  }

  const [smallScreenSelectedTab, setSmallScreenSelectedTab] = useState(
    initialSmallScreenSelectedTab,
  );

  return (
    <>
      <Tabs
        value={smallScreenSelectedTab}
        variant="scrollable"
        onChange={(_, newValue) => setSmallScreenSelectedTab(newValue)}
      >
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.NOT_STARTED)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.NOT_STARTED)}
        />
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.NOT_STARTED_GEN)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.NOT_STARTED_GEN)}
        />
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.IN_PROGRESS)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.IN_PROGRESS)}
        />
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.BLOCKED)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.BLOCKED)}
        />
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.NOT_DONE)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.NOT_DONE)}
        />
        <Tab
          icon={<p>{inboxTaskStatusIcon(InboxTaskStatus.DONE)}</p>}
          iconPosition="top"
          label={inboxTaskStatusName(InboxTaskStatus.DONE)}
        />
      </Tabs>

      <TabPanel value={smallScreenSelectedTab} index={0}>
        {notStartedTasks.length === 0 && (
          <InboxTasksNoTasksCard
            parent="inbox task"
            parentLabel="New Task"
            parentNewLocations="/app/workspace/inbox-tasks/new"
          />
        )}
        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: props.allowEisen === undefined,
            showDifficulty: true,
            showActionableDate: true,
            showDueDate: true,
            showParent: true,
          }}
          inboxTasks={notStartedTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />
      </TabPanel>

      <TabPanel value={smallScreenSelectedTab} index={1}>
        {recurringTasks.length === 0 && (
          <InboxTasksNoTasksCard
            parent="inbox task"
            parentLabel="New Task"
            parentNewLocations="/app/workspace/inbox-tasks/new"
          />
        )}
        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: props.allowEisen === undefined,
            showDifficulty: true,
            showActionableDate: true,
            showDueDate: true,
            showParent: true,
          }}
          inboxTasks={recurringTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />
      </TabPanel>

      <TabPanel value={smallScreenSelectedTab} index={2}>
        {inProgressTasks.length === 0 && (
          <InboxTasksNoTasksCard
            parent="inbox task"
            parentLabel="New Task"
            parentNewLocations="/app/workspace/inbox-tasks/new"
          />
        )}
        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: props.allowEisen === undefined,
            showDifficulty: true,
            showActionableDate: true,
            showDueDate: true,
            showParent: true,
          }}
          inboxTasks={inProgressTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />
      </TabPanel>

      <TabPanel value={smallScreenSelectedTab} index={3}>
        {blockedTasks.length === 0 && (
          <InboxTasksNoTasksCard
            parent="inbox task"
            parentLabel="New Task"
            parentNewLocations="/app/workspace/inbox-tasks/new"
          />
        )}
        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: props.allowEisen === undefined,
            showDifficulty: true,
            showActionableDate: true,
            showDueDate: true,
            showParent: true,
          }}
          inboxTasks={blockedTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />
      </TabPanel>

      <TabPanel value={smallScreenSelectedTab} index={4}>
        {notDoneTasks.length === 0 && (
          <InboxTasksNoTasksCard
            parent="inbox task"
            parentLabel="New Task"
            parentNewLocations="/app/workspace/inbox-tasks/new"
          />
        )}
        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: props.allowEisen === undefined,
            showDifficulty: true,
            showActionableDate: true,
            showDueDate: true,
            showParent: true,
          }}
          inboxTasks={notDoneTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />
      </TabPanel>

      <TabPanel value={smallScreenSelectedTab} index={5}>
        {doneTasks.length === 0 && (
          <InboxTasksNoTasksCard
            parent="inbox task"
            parentLabel="New Task"
            parentNewLocations="/app/workspace/inbox-tasks/new"
          />
        )}
        <InboxTaskStack
          topLevelInfo={props.topLevelInfo}
          showOptions={{
            showSource: true,
            showLifePlan: true,
            showEisen: props.allowEisen === undefined,
            showDifficulty: true,
            showActionableDate: true,
            showDueDate: true,
            showParent: true,
          }}
          inboxTasks={doneTasks}
          optimisticUpdates={props.optimisticUpdates}
          moreInfoByRefId={props.moreInfoByRefId}
          inboxTaskTagsByInboxTaskRefId={props.inboxTaskTagsByInboxTaskRefId}
          inboxTaskContactsByInboxTaskRefId={
            props.inboxTaskContactsByInboxTaskRefId
          }
          onCardMarkDone={props.onCardMarkDone}
          onCardMarkNotDone={props.onCardMarkNotDone}
        />
      </TabPanel>
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
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function List({
  topLevelInfo,
  inboxTasks,
  moreInfoByRefId,
  optimisticUpdates,
  onCardMarkDone,
  onCardMarkNotDone,
  inboxTaskTagsByInboxTaskRefId,
  inboxTaskContactsByInboxTaskRefId,
}: ListProps) {
  return (
    <>
      {inboxTasks.length === 0 && (
        <InboxTasksNoTasksCard
          parent="inbox task"
          parentLabel="New Task"
          parentNewLocations="/app/workspace/inbox-tasks/new"
        />
      )}
      <InboxTaskStack
        topLevelInfo={topLevelInfo}
        showOptions={{
          showStatus: true,
          showSource: true,
          showLifePlan: true,
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
        inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
        inboxTaskContactsByInboxTaskRefId={inboxTaskContactsByInboxTaskRefId}
        optimisticUpdates={optimisticUpdates}
        onCardMarkDone={onCardMarkDone}
        onCardMarkNotDone={onCardMarkNotDone}
      />
    </>
  );
}

function getUniqueProjectsSorted(moreInfoByRefId: {
  [key: string]: InboxTaskParent;
}): ProjectSummary[] {
  const projectMap = new Map<string, Project>();
  for (const parent of Object.values(moreInfoByRefId)) {
    if (parent.project) {
      projectMap.set(parent.project.ref_id, parent.project);
    }
  }
  return sortProjectsByTreeOrder([...projectMap.values()]);
}

function getUniqueGoalsForProject(
  moreInfoByRefId: { [key: string]: InboxTaskParent },
  projectRefId: string,
): Goal[] {
  const goalMap = new Map<string, Goal>();
  for (const parent of Object.values(moreInfoByRefId)) {
    if (parent.project?.ref_id === projectRefId && parent.goal) {
      goalMap.set(parent.goal.ref_id, parent.goal);
    }
  }
  return sortGoalsNaturally([...goalMap.values()]);
}

interface BigScreenKanbanByProjectProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  inboxTasksByRefId: { [key: string]: InboxTask };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  draggedInboxTaskId?: string;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function BigScreenKanbanByProject({
  topLevelInfo,
  inboxTasks,
  optimisticUpdates,
  inboxTasksByRefId,
  moreInfoByRefId,
  actionableTime,
  draggedInboxTaskId,
  inboxTaskTagsByInboxTaskRefId,
  inboxTaskContactsByInboxTaskRefId,
}: BigScreenKanbanByProjectProps) {
  const projects = useMemo(
    () => getUniqueProjectsSorted(moreInfoByRefId),
    [moreInfoByRefId],
  );

  return (
    <>
      {inboxTasks.length === 0 && (
        <InboxTasksNoTasksCard
          parent="inbox task"
          parentLabel="New Task"
          parentNewLocations="/app/workspace/inbox-tasks/new"
        />
      )}
      {inboxTasks.length > 0 && (
        <>
          {projects.map((project) => {
            const projectTasks = inboxTasks.filter(
              (it) => it.project_ref_id === project.ref_id,
            );
            if (projectTasks.length === 0) return null;
            return (
              <Fragment key={project.ref_id}>
                <StandardDivider title={project.name} size="large" />
                <KanbanBoard
                  topLevelInfo={topLevelInfo}
                  inboxTasks={projectTasks}
                  optimisticUpdates={optimisticUpdates}
                  inboxTasksByRefId={inboxTasksByRefId}
                  moreInfoByRefId={moreInfoByRefId}
                  actionableTime={actionableTime}
                  groupId={project.ref_id}
                  draggedInboxTaskId={draggedInboxTaskId}
                  inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                  inboxTaskContactsByInboxTaskRefId={
                    inboxTaskContactsByInboxTaskRefId
                  }
                />
              </Fragment>
            );
          })}
        </>
      )}
    </>
  );
}

interface SmallScreenKanbanByProjectProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  onCardMarkDone?: (it: InboxTask) => void;
  onCardMarkNotDone?: (it: InboxTask) => void;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function SmallScreenKanbanByProject(props: SmallScreenKanbanByProjectProps) {
  const projects = useMemo(
    () => getUniqueProjectsSorted(props.moreInfoByRefId),
    [props.moreInfoByRefId],
  );

  const [selectedTab, setSelectedTab] = useState(0);

  if (props.inboxTasks.length === 0) {
    return (
      <InboxTasksNoTasksCard
        parent="inbox task"
        parentLabel="New Task"
        parentNewLocations="/app/workspace/inbox-tasks/new"
      />
    );
  }

  return (
    <>
      <Tabs
        value={selectedTab}
        variant="scrollable"
        scrollButtons="auto"
        onChange={(_, newValue) => setSelectedTab(newValue)}
      >
        {projects.map((project) => (
          <Tab key={project.ref_id} label={project.name} />
        ))}
      </Tabs>

      {projects.map((project, index) => {
        const projectTasks = props.inboxTasks.filter(
          (it) => it.project_ref_id === project.ref_id,
        );
        return (
          <TabPanel key={project.ref_id} value={selectedTab} index={index}>
            <SmallScreenKanban
              topLevelInfo={props.topLevelInfo}
              inboxTasks={projectTasks}
              optimisticUpdates={props.optimisticUpdates}
              moreInfoByRefId={props.moreInfoByRefId}
              actionableTime={props.actionableTime}
              onCardMarkDone={props.onCardMarkDone}
              onCardMarkNotDone={props.onCardMarkNotDone}
              inboxTaskTagsByInboxTaskRefId={
                props.inboxTaskTagsByInboxTaskRefId
              }
              inboxTaskContactsByInboxTaskRefId={
                props.inboxTaskContactsByInboxTaskRefId
              }
            />
          </TabPanel>
        );
      })}
    </>
  );
}

interface BigScreenKanbanByProjectAndGoalProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  inboxTasksByRefId: { [key: string]: InboxTask };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  draggedInboxTaskId?: string;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function BigScreenKanbanByProjectAndGoal({
  topLevelInfo,
  inboxTasks,
  optimisticUpdates,
  inboxTasksByRefId,
  moreInfoByRefId,
  actionableTime,
  draggedInboxTaskId,
  inboxTaskTagsByInboxTaskRefId,
  inboxTaskContactsByInboxTaskRefId,
}: BigScreenKanbanByProjectAndGoalProps) {
  const projects = useMemo(
    () => getUniqueProjectsSorted(moreInfoByRefId),
    [moreInfoByRefId],
  );

  return (
    <>
      {inboxTasks.length === 0 && (
        <InboxTasksNoTasksCard
          parent="inbox task"
          parentLabel="New Task"
          parentNewLocations="/app/workspace/inbox-tasks/new"
        />
      )}
      {inboxTasks.length > 0 && (
        <>
          {projects.map((project) => {
            const projectTasks = inboxTasks.filter(
              (it) => it.project_ref_id === project.ref_id,
            );
            if (projectTasks.length === 0) return null;

            const goals = getUniqueGoalsForProject(
              moreInfoByRefId,
              project.ref_id,
            );
            const tasksWithoutGoal = projectTasks.filter(
              (it) => !moreInfoByRefId[it.ref_id]?.goal,
            );

            return (
              <Fragment key={project.ref_id}>
                <StandardDivider title={project.name} size="large" />

                {goals.map((goal) => {
                  const goalTasks = projectTasks.filter(
                    (it) =>
                      moreInfoByRefId[it.ref_id]?.goal?.ref_id === goal.ref_id,
                  );
                  if (goalTasks.length === 0) return null;
                  return (
                    <Fragment key={goal.ref_id}>
                      <StandardDivider title={goal.name} size="medium" />
                      <KanbanBoard
                        topLevelInfo={topLevelInfo}
                        inboxTasks={goalTasks}
                        optimisticUpdates={optimisticUpdates}
                        inboxTasksByRefId={inboxTasksByRefId}
                        moreInfoByRefId={moreInfoByRefId}
                        actionableTime={actionableTime}
                        groupId={`${project.ref_id}-${goal.ref_id}`}
                        draggedInboxTaskId={draggedInboxTaskId}
                        inboxTaskTagsByInboxTaskRefId={
                          inboxTaskTagsByInboxTaskRefId
                        }
                        inboxTaskContactsByInboxTaskRefId={
                          inboxTaskContactsByInboxTaskRefId
                        }
                      />
                    </Fragment>
                  );
                })}

                {tasksWithoutGoal.length > 0 && (
                  <Fragment key="no-goal">
                    {goals.length > 0 && (
                      <StandardDivider title="No Goal" size="medium" />
                    )}
                    <KanbanBoard
                      topLevelInfo={topLevelInfo}
                      inboxTasks={tasksWithoutGoal}
                      optimisticUpdates={optimisticUpdates}
                      inboxTasksByRefId={inboxTasksByRefId}
                      moreInfoByRefId={moreInfoByRefId}
                      actionableTime={actionableTime}
                      groupId={`${project.ref_id}-no-goal`}
                      draggedInboxTaskId={draggedInboxTaskId}
                      inboxTaskTagsByInboxTaskRefId={
                        inboxTaskTagsByInboxTaskRefId
                      }
                      inboxTaskContactsByInboxTaskRefId={
                        inboxTaskContactsByInboxTaskRefId
                      }
                    />
                  </Fragment>
                )}
              </Fragment>
            );
          })}
        </>
      )}
    </>
  );
}

interface SmallScreenKanbanByProjectAndGoalProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  onCardMarkDone?: (it: InboxTask) => void;
  onCardMarkNotDone?: (it: InboxTask) => void;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function SmallScreenKanbanByProjectAndGoal(
  props: SmallScreenKanbanByProjectAndGoalProps,
) {
  const projects = useMemo(
    () => getUniqueProjectsSorted(props.moreInfoByRefId),
    [props.moreInfoByRefId],
  );

  const [selectedTab, setSelectedTab] = useState(0);

  if (props.inboxTasks.length === 0) {
    return (
      <InboxTasksNoTasksCard
        parent="inbox task"
        parentLabel="New Task"
        parentNewLocations="/app/workspace/inbox-tasks/new"
      />
    );
  }

  return (
    <>
      <Tabs
        value={selectedTab}
        variant="scrollable"
        scrollButtons="auto"
        onChange={(_, newValue) => setSelectedTab(newValue)}
      >
        {projects.map((project) => (
          <Tab key={project.ref_id} label={project.name} />
        ))}
      </Tabs>

      {projects.map((project, index) => {
        const projectTasks = props.inboxTasks.filter(
          (it) => it.project_ref_id === project.ref_id,
        );
        const goals = getUniqueGoalsForProject(
          props.moreInfoByRefId,
          project.ref_id,
        );
        const tasksWithoutGoal = projectTasks.filter(
          (it) => !props.moreInfoByRefId[it.ref_id]?.goal,
        );

        return (
          <TabPanel key={project.ref_id} value={selectedTab} index={index}>
            {goals.map((goal) => {
              const goalTasks = projectTasks.filter(
                (it) =>
                  props.moreInfoByRefId[it.ref_id]?.goal?.ref_id ===
                  goal.ref_id,
              );
              if (goalTasks.length === 0) return null;
              return (
                <Fragment key={goal.ref_id}>
                  <StandardDivider title={goal.name} size="medium" />
                  <SmallScreenKanban
                    topLevelInfo={props.topLevelInfo}
                    inboxTasks={goalTasks}
                    optimisticUpdates={props.optimisticUpdates}
                    moreInfoByRefId={props.moreInfoByRefId}
                    actionableTime={props.actionableTime}
                    onCardMarkDone={props.onCardMarkDone}
                    onCardMarkNotDone={props.onCardMarkNotDone}
                    inboxTaskTagsByInboxTaskRefId={
                      props.inboxTaskTagsByInboxTaskRefId
                    }
                    inboxTaskContactsByInboxTaskRefId={
                      props.inboxTaskContactsByInboxTaskRefId
                    }
                  />
                </Fragment>
              );
            })}

            {tasksWithoutGoal.length > 0 && (
              <>
                {goals.length > 0 && (
                  <StandardDivider title="No Goal" size="medium" />
                )}
                <SmallScreenKanban
                  topLevelInfo={props.topLevelInfo}
                  inboxTasks={tasksWithoutGoal}
                  optimisticUpdates={props.optimisticUpdates}
                  moreInfoByRefId={props.moreInfoByRefId}
                  actionableTime={props.actionableTime}
                  onCardMarkDone={props.onCardMarkDone}
                  onCardMarkNotDone={props.onCardMarkNotDone}
                  inboxTaskTagsByInboxTaskRefId={
                    props.inboxTaskTagsByInboxTaskRefId
                  }
                  inboxTaskContactsByInboxTaskRefId={
                    props.inboxTaskContactsByInboxTaskRefId
                  }
                />
              </>
            )}
          </TabPanel>
        );
      })}
    </>
  );
}

interface ListByProjectProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  onCardMarkDone?: (it: InboxTask) => void;
  onCardMarkNotDone?: (it: InboxTask) => void;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function ListByProject({
  topLevelInfo,
  inboxTasks,
  moreInfoByRefId,
  optimisticUpdates,
  onCardMarkDone,
  onCardMarkNotDone,
  inboxTaskTagsByInboxTaskRefId,
  inboxTaskContactsByInboxTaskRefId,
}: ListByProjectProps) {
  const projects = useMemo(
    () => getUniqueProjectsSorted(moreInfoByRefId),
    [moreInfoByRefId],
  );

  return (
    <>
      {inboxTasks.length === 0 && (
        <InboxTasksNoTasksCard
          parent="inbox task"
          parentLabel="New Task"
          parentNewLocations="/app/workspace/inbox-tasks/new"
        />
      )}
      {projects.map((project) => {
        const projectTasks = inboxTasks.filter(
          (it) => it.project_ref_id === project.ref_id,
        );
        if (projectTasks.length === 0) return null;
        return (
          <Fragment key={project.ref_id}>
            <StandardDivider title={project.name} size="large" />
            <InboxTaskStack
              topLevelInfo={topLevelInfo}
              showOptions={{
                showStatus: true,
                showSource: true,
                showLifePlan: true,
                showEisen: true,
                showDifficulty: true,
                showActionableDate: true,
                showDueDate: true,
                showParent: true,
                showHandleMarkDone: true,
                showHandleMarkNotDone: true,
              }}
              inboxTasks={projectTasks}
              moreInfoByRefId={moreInfoByRefId}
              inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
              inboxTaskContactsByInboxTaskRefId={
                inboxTaskContactsByInboxTaskRefId
              }
              optimisticUpdates={optimisticUpdates}
              onCardMarkDone={onCardMarkDone}
              onCardMarkNotDone={onCardMarkNotDone}
            />
          </Fragment>
        );
      })}
    </>
  );
}

interface ListByProjectAndGoalProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  onCardMarkDone?: (it: InboxTask) => void;
  onCardMarkNotDone?: (it: InboxTask) => void;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function ListByProjectAndGoal({
  topLevelInfo,
  inboxTasks,
  moreInfoByRefId,
  optimisticUpdates,
  onCardMarkDone,
  onCardMarkNotDone,
  inboxTaskTagsByInboxTaskRefId,
  inboxTaskContactsByInboxTaskRefId,
}: ListByProjectAndGoalProps) {
  const projects = useMemo(
    () => getUniqueProjectsSorted(moreInfoByRefId),
    [moreInfoByRefId],
  );

  return (
    <>
      {inboxTasks.length === 0 && (
        <InboxTasksNoTasksCard
          parent="inbox task"
          parentLabel="New Task"
          parentNewLocations="/app/workspace/inbox-tasks/new"
        />
      )}
      {projects.map((project) => {
        const projectTasks = inboxTasks.filter(
          (it) => it.project_ref_id === project.ref_id,
        );
        if (projectTasks.length === 0) return null;

        const goals = getUniqueGoalsForProject(moreInfoByRefId, project.ref_id);
        const tasksWithoutGoal = projectTasks.filter(
          (it) => !moreInfoByRefId[it.ref_id]?.goal,
        );

        return (
          <Fragment key={project.ref_id}>
            <StandardDivider title={project.name} size="large" />

            {goals.map((goal) => {
              const goalTasks = projectTasks.filter(
                (it) =>
                  moreInfoByRefId[it.ref_id]?.goal?.ref_id === goal.ref_id,
              );
              if (goalTasks.length === 0) return null;
              return (
                <Fragment key={goal.ref_id}>
                  <StandardDivider title={goal.name} size="medium" />
                  <InboxTaskStack
                    topLevelInfo={topLevelInfo}
                    showOptions={{
                      showStatus: true,
                      showSource: true,
                      showLifePlan: true,
                      showEisen: true,
                      showDifficulty: true,
                      showActionableDate: true,
                      showDueDate: true,
                      showParent: true,
                      showHandleMarkDone: true,
                      showHandleMarkNotDone: true,
                    }}
                    inboxTasks={goalTasks}
                    moreInfoByRefId={moreInfoByRefId}
                    inboxTaskTagsByInboxTaskRefId={
                      inboxTaskTagsByInboxTaskRefId
                    }
                    inboxTaskContactsByInboxTaskRefId={
                      inboxTaskContactsByInboxTaskRefId
                    }
                    optimisticUpdates={optimisticUpdates}
                    onCardMarkDone={onCardMarkDone}
                    onCardMarkNotDone={onCardMarkNotDone}
                  />
                </Fragment>
              );
            })}

            {tasksWithoutGoal.length > 0 && (
              <Fragment key="no-goal">
                {goals.length > 0 && (
                  <StandardDivider title="No Goal" size="medium" />
                )}
                <InboxTaskStack
                  topLevelInfo={topLevelInfo}
                  showOptions={{
                    showStatus: true,
                    showSource: true,
                    showLifePlan: true,
                    showEisen: true,
                    showDifficulty: true,
                    showActionableDate: true,
                    showDueDate: true,
                    showParent: true,
                    showHandleMarkDone: true,
                    showHandleMarkNotDone: true,
                  }}
                  inboxTasks={tasksWithoutGoal}
                  moreInfoByRefId={moreInfoByRefId}
                  inboxTaskTagsByInboxTaskRefId={inboxTaskTagsByInboxTaskRefId}
                  inboxTaskContactsByInboxTaskRefId={
                    inboxTaskContactsByInboxTaskRefId
                  }
                  optimisticUpdates={optimisticUpdates}
                  onCardMarkDone={onCardMarkDone}
                  onCardMarkNotDone={onCardMarkNotDone}
                />
              </Fragment>
            )}
          </Fragment>
        );
      })}
    </>
  );
}

interface InboxTasksColumnProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  inboxTasksByRefId: { [key: string]: InboxTask };
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  collapsed?: boolean;
  allowStatus: InboxTaskStatus;
  allowEisen?: Eisen;
  groupId?: string;
  showOptions: InboxTaskShowOptions;
  draggedInboxTaskId?: string;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

function InboxTasksColumn(props: InboxTasksColumnProps) {
  function getColumnModifier(snapshot: DroppableStateSnapshot) {
    if (snapshot.draggingFromThisWith) {
      return DragTargetStatus.SOURCE_DRAG;
    }

    if (snapshot.isDraggingOver) {
      return DragTargetStatus.SELECT_DRAG;
    }

    if (props.draggedInboxTaskId !== undefined) {
      if (allowDraggingOverStatus() && allowDraggingOverEisen()) {
        return DragTargetStatus.ALLOW_DRAG;
      } else {
        return DragTargetStatus.FORBID_DRAG;
      }
    }

    return DragTargetStatus.FREE;
  }

  function allowDraggingOverEisen() {
    if (props.draggedInboxTaskId === undefined) {
      return true;
    }

    if (props.allowEisen === undefined) {
      return true;
    }

    const inboxTask = props.inboxTasksByRefId[props.draggedInboxTaskId];

    if (isInboxTaskCoreFieldEditable(inboxTask.source)) {
      return true;
    }

    return inboxTask.eisen === props.allowEisen;
  }

  function allowDraggingOverStatus() {
    if (props.draggedInboxTaskId === undefined) {
      return true;
    }

    const inboxTask = props.inboxTasksByRefId[props.draggedInboxTaskId];

    return canInboxTaskBeInStatus(inboxTask, props.allowStatus);
  }

  const actionableTime = actionableTimeToDateTime(
    props.actionableTime,
    props.topLevelInfo.user.timezone,
  );

  const filteredInboxTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [props.allowStatus],
      allowEisens: props.allowEisen ? [props.allowEisen] : undefined,
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      includeIfNoDueDate: true,
    },
  );

  const formattedCountStr = formatTasksCount(filteredInboxTasks.length);

  return (
    <>
      <Box
        sx={{
          height: "1rem",
          marginBottom: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <InboxTaskStatusTag status={props.allowStatus} />
        <Typography
          component="span"
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {formattedCountStr}
        </Typography>
      </Box>

      <Droppable
        type="inbox-task"
        droppableId={`inbox-tasks-column:${props.allowEisen}:${props.allowStatus}${props.groupId ? `:${props.groupId}` : ""}`}
        direction="vertical"
        isDropDisabled={
          !(allowDraggingOverStatus() && allowDraggingOverEisen())
        }
      >
        {(provided, snapshot) => (
          <InboxTasksColumnHighDiv
            divStatus={getColumnModifier(snapshot)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {!props.collapsed && (
              <InboxTaskColumnTasks
                topLevelInfo={props.topLevelInfo}
                inboxTasks={filteredInboxTasks}
                moreInfoByRefId={props.moreInfoByRefId}
                showOptions={props.showOptions}
                inboxTaskTagsByInboxTaskRefId={
                  props.inboxTaskTagsByInboxTaskRefId
                }
                inboxTaskContactsByInboxTaskRefId={
                  props.inboxTaskContactsByInboxTaskRefId
                }
              />
            )}

            {provided.placeholder}
          </InboxTasksColumnHighDiv>
        )}
      </Droppable>
    </>
  );
}

interface InboxTasksColumnHighDivProps {
  divStatus: DragTargetStatus;
}

const InboxTasksColumnHighDiv = styled("div")<InboxTasksColumnHighDivProps>(
  ({ theme, divStatus }) => ({
    minHeight: "100%",
    backgroundColor:
      divStatus === DragTargetStatus.SOURCE_DRAG
        ? "rgb(191, 204, 229)"
        : divStatus === DragTargetStatus.SELECT_DRAG
          ? "#f5f5f5"
          : divStatus === DragTargetStatus.ALLOW_DRAG
            ? "rgb(234, 246, 215)"
            : divStatus === DragTargetStatus.FORBID_DRAG
              ? "rgb(243, 196, 196)"
              : theme.palette.background.paper,
  }),
);

interface InboxTaskColumnTasksProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  showOptions: InboxTaskShowOptions;
  inboxTaskTagsByInboxTaskRefId: Map<string, Array<Tag>>;
  inboxTaskContactsByInboxTaskRefId: Map<string, Array<Contact>>;
}

const InboxTaskColumnTasks = memo(function InboxTaskColumnTasks(
  props: InboxTaskColumnTasksProps,
) {
  return (
    <Stack spacing={1} useFlexGap>
      {props.inboxTasks.map((inboxTask, index) => {
        const entry = props.moreInfoByRefId[inboxTask.ref_id];

        return (
          <Draggable
            key={inboxTask.ref_id}
            draggableId={inboxTask.ref_id}
            index={index}
          >
            {(provided, _snapshpt) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <InboxTaskCard
                  topLevelInfo={props.topLevelInfo}
                  compact
                  showOptions={{
                    ...props.showOptions,
                    showLifePlan: true,
                    showParent: true,
                    showHandleMarkDone: false,
                    showHandleMarkNotDone: false,
                  }}
                  inboxTask={inboxTask}
                  tags={
                    props.inboxTaskTagsByInboxTaskRefId.get(inboxTask.ref_id) ??
                    []
                  }
                  contacts={
                    props.inboxTaskContactsByInboxTaskRefId.get(
                      inboxTask.ref_id,
                    ) ?? []
                  }
                  parent={entry}
                />
              </div>
            )}
          </Draggable>
        );
      })}
    </Stack>
  );
});

function formatTasksCount(tasksCnt: number) {
  return tasksCnt === 0 ? "" : tasksCnt === 1 ? "1 task" : `${tasksCnt} tasks`;
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
