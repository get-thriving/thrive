import {
  Aspect,
  Chapter,
  Contact,
  Goal,
  InboxTask,
  InboxTaskStatus,
  Eisen,
  TodoTask,
  TodoTaskFindResultEntry,
  DocsHelpSubject,
} from "@jupiter/webapi-client";
import type { DragStart, DropResult } from "@hello-pangea/dnd";
import { DragDropContext } from "@hello-pangea/dnd";
import FlareIcon from "@mui/icons-material/Flare";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Grid, Tab, Tabs, Typography } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useFetcher } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { Fragment, useContext, useState } from "react";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { ADateTag } from "@jupiter/core/common/component/adate-tag";
import { DifficultyTag } from "@jupiter/core/common/component/difficulty-tag";
import { EisenTag } from "@jupiter/core/common/component/eisen-tag";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import type { TopLevelInfo } from "@jupiter/core/infra/top-level-context";
import {
  FilterFewOptionsCompact,
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { AspectTag } from "@jupiter/core/life_plan/sub/aspects/component/tag";
import { eisenIcon, eisenName } from "@jupiter/core/common/eisen";
import {
  filterInboxTasksForDisplay,
  isInboxTaskCoreFieldEditable,
  sortInboxTasksNaturally,
} from "@jupiter/core/inbox_tasks/root";
import type {
  InboxTaskOptimisticState,
  InboxTaskParent,
} from "@jupiter/core/inbox_tasks/root";
import { InboxTaskKanbanBoard } from "@jupiter/core/inbox_tasks/components/kanban-board";
import {
  SmallScreenKanban,
  SmallScreenKanbanByEisen,
} from "@jupiter/core/inbox_tasks/components/small-screen-kanban";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "@jupiter/core/infra/actionable-time";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import type { SomeErrorNoData } from "@jupiter/core/infra/action-result";
import { ChapterTag } from "#/core/life_plan/sub/chapters/components/tag";
import { GoalTag } from "#/core/life_plan/sub/goals/components/tag";
import { ContactTag } from "#/core/common/sub/contacts/component/contact-tag";
import { aDateToDate } from "#/core/common/adate";
import { TabPanel } from "#/core/infra/component/tab-panel";
import { InboxTaskStack } from "#/core/inbox_tasks/component/stack";
import { InboxTaskStatusTag } from "#/core/inbox_tasks/component/status-tag";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.todo.todoTaskFind({
    allow_archived: false,
    include_notes: false,
    include_life_plan: true,
    include_contacts: true,
    include_inbox_tasks: true,
  });

  const allContacts = await apiClient.contacts.contactFind({
    allow_archived: false,
  });

  return json({
    entries: response.entries,
    allContacts: allContacts.contacts as Array<Contact>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

enum View {
  SWIFTVIEW = "swiftview",
  LIST = "list",
  KANBAN_BY_EISEN = "kanban-by-eisen",
  KANBAN = "kanban",
}

const EISENS = [
  Eisen.IMPORTANT_AND_URGENT,
  Eisen.URGENT,
  Eisen.IMPORTANT,
  Eisen.REGULAR,
];

export default function Todos() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const kanbanBoardMoveFetcher = useFetcher<SomeErrorNoData>();

  const [selectedContactsRefId, setSelectedContactsRefId] = useState<string[]>(
    [],
  );
  const [selectedView, setSelectedView] = useState(View.SWIFTVIEW);
  const [selectedActionableTime, setSelectedActionableTime] = useState(
    ActionableTime.NOW,
  );
  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    [key: string]: InboxTaskOptimisticState;
  }>({});
  const [draggedInboxTaskId, setDraggedInboxTaskId] = useState<
    string | undefined
  >(undefined);

  const entries = loaderData.entries as Array<TodoTaskFindResultEntry>;

  const filteredEntries = entries.filter((entry) => {
    const contactsOk =
      selectedContactsRefId.length === 0 ||
      entry.contacts?.some((contact: Contact) =>
        selectedContactsRefId.includes(contact.ref_id),
      );
    return contactsOk;
  });

  const sortedTodoTasks: Array<TodoTask> = [...filteredEntries]
    .sort((a, b) => a.todo_task.name.localeCompare(b.todo_task.name))
    .map((e) => e.todo_task);

  const todoInboxEntries = filteredEntries.filter(
    (entry) => entry.inbox_task !== undefined && entry.inbox_task !== null,
  );
  const sortedTodoInboxTasks = sortInboxTasksNaturally(
    todoInboxEntries.map((entry) => entry.inbox_task as InboxTask),
  );

  const inboxTasksByRefId: { [key: string]: InboxTask } = {};
  const moreInfoByRefId: { [key: string]: InboxTaskParent } = {};
  for (const entry of todoInboxEntries) {
    const inboxTask = entry.inbox_task as InboxTask;
    inboxTasksByRefId[inboxTask.ref_id] = inboxTask;
    moreInfoByRefId[inboxTask.ref_id] = {
      todoTask: entry.todo_task,
    };
  }

  function onDragStart(start: DragStart) {
    setDraggedInboxTaskId(start.draggableId);
  }

  function onDragEnd(result: DropResult) {
    setDraggedInboxTaskId(undefined);

    if (!result.destination) {
      return;
    }

    const destination = result.destination.droppableId.split(":");
    const droppableEisen = destination[1];
    const status = destination[2] as InboxTaskStatus;
    const eisen =
      droppableEisen === "undefined" ? undefined : (droppableEisen as Eisen);

    const inboxTask = inboxTasksByRefId[result.draggableId];
    if (!inboxTask) {
      return;
    }

    if (!isInboxTaskCoreFieldEditable(inboxTask.source)) {
      if (eisen && inboxTask.eisen !== eisen) {
        return;
      }
    }

    setOptimisticUpdates((oldOptimisticUpdates) => ({
      ...oldOptimisticUpdates,
      [result.draggableId]: {
        status,
        eisen,
      },
    }));

    if (isInboxTaskCoreFieldEditable(inboxTask.source)) {
      kanbanBoardMoveFetcher.submit(
        {
          id: result.draggableId,
          eisen: eisen?.toString() || "no-go",
          status,
        },
        {
          method: "post",
          action: "/app/workspace/inbox-tasks/update-status-and-eisen",
        },
      );
    } else {
      kanbanBoardMoveFetcher.submit(
        {
          id: result.draggableId,
          eisen: "no-go",
          status,
        },
        {
          method: "post",
          action: "/app/workspace/inbox-tasks/update-status-and-eisen",
        },
      );
    }
  }

  function handleCardMarkDone(it: InboxTask) {
    setOptimisticUpdates((oldOptimisticUpdates) => ({
      ...oldOptimisticUpdates,
      [it.ref_id]: {
        status: InboxTaskStatus.DONE,
        eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen,
      },
    }));

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
    setOptimisticUpdates((oldOptimisticUpdates) => ({
      ...oldOptimisticUpdates,
      [it.ref_id]: {
        status: InboxTaskStatus.NOT_DONE,
        eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen,
      },
    }));

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

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  return (
    <TrunkPanel
      key={"todos"}
      createLocation="/app/workspace/todos/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="todos-actions"
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
                  value: View.LIST,
                  text: "List",
                  icon: <ViewListIcon />,
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
              ],
              setSelectedView,
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
              setSelectedActionableTime,
            ),
            FilterManyOptions(
              "Contacts",
              loaderData.allContacts.map((contact) => ({
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
        <GlobalError actionResult={kanbanBoardMoveFetcher.data} />
        <FieldError
          actionResult={kanbanBoardMoveFetcher.data}
          fieldName="/status"
        />
        <FieldError
          actionResult={kanbanBoardMoveFetcher.data}
          fieldName="/eisen"
        />

        {/* Display a single "no entries" card at the very top, depending on selectedView */}
        {sortedTodoTasks.length === 0 && (
          <EntityNoNothingCard
            helpSubject={DocsHelpSubject.TODOS}
            title="You Have To Start Somewhere"
            message="There are no todo tasks to show. You can create a new task."
            newEntityLocations="/app/workspace/todos/new"
          />
        )}

        {/* Main view rendering */}
        {selectedView === View.LIST && sortedTodoTasks.length > 0 && (
          <EntityStack>
            {sortedTodoTasks.map((todoTask) => {
              const entry = filteredEntries.find(
                (e) => e.todo_task.ref_id === todoTask.ref_id,
              );
              const inboxTask = entry?.inbox_task ?? undefined;
              return (
                <EntityCard
                  entityId={`todo-task-${todoTask.ref_id}`}
                  key={`todo-task-${todoTask.ref_id}`}
                  allowMarkDone={inboxTask !== undefined}
                  allowMarkNotDone={inboxTask !== undefined}
                  onMarkDone={() => {
                    if (inboxTask) {
                      handleCardMarkDone(inboxTask);
                    }
                  }}
                  onMarkNotDone={() => {
                    if (inboxTask) {
                      handleCardMarkNotDone(inboxTask);
                    }
                  }}
                >
                  <EntityLink to={`/app/workspace/todos/${todoTask.ref_id}`}>
                    <EntityNameComponent name={todoTask.name} />
                    {entry?.aspect && (
                      <AspectTag aspect={entry.aspect as Aspect} />
                    )}
                    {entry?.chapter && (
                      <ChapterTag chapter={entry.chapter as Chapter} />
                    )}
                    {entry?.goal && <GoalTag goal={entry.goal as Goal} />}
                    {entry?.contacts?.map((contact) => (
                      <ContactTag key={contact.ref_id} contact={contact} />
                    ))}
                    {inboxTask && (
                      <InboxTaskStatusTag
                        status={
                          optimisticUpdates[inboxTask.ref_id]?.status ??
                          inboxTask.status
                        }
                      />
                    )}
                    {inboxTask && (
                      <EisenTag
                        eisen={
                          optimisticUpdates[inboxTask.ref_id]?.eisen ??
                          inboxTask.eisen
                        }
                      />
                    )}
                    {inboxTask && (
                      <DifficultyTag difficulty={inboxTask.difficulty} />
                    )}
                    {inboxTask?.actionable_date && (
                      <ADateTag
                        label="Actionable from"
                        date={inboxTask.actionable_date}
                      />
                    )}
                    {inboxTask?.due_date && (
                      <ADateTag label="Due at" date={inboxTask.due_date} />
                    )}
                  </EntityLink>
                </EntityCard>
              );
            })}
          </EntityStack>
        )}

        {/* Kanban/Swift/Eisen views */}
        {selectedView === View.SWIFTVIEW && sortedTodoInboxTasks.length > 0 && (
          <>
            <TodoSwiftView
              topLevelInfo={topLevelInfo}
              isBigScreen={isBigScreen}
              inboxTasks={sortedTodoInboxTasks}
              optimisticUpdates={optimisticUpdates}
              moreInfoByRefId={moreInfoByRefId}
              actionableTime={selectedActionableTime}
              onCardMarkDone={handleCardMarkDone}
              onCardMarkNotDone={handleCardMarkNotDone}
            />
          </>
        )}

        {selectedView === View.KANBAN &&
          sortedTodoInboxTasks.length > 0 &&
          isBigScreen && (
            <>
              <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <InboxTaskKanbanBoard
                  topLevelInfo={topLevelInfo}
                  inboxTasks={sortedTodoInboxTasks}
                  optimisticUpdates={optimisticUpdates}
                  inboxTasksByRefId={inboxTasksByRefId}
                  moreInfoByRefId={moreInfoByRefId}
                  actionableTime={selectedActionableTime}
                  draggedInboxTaskId={draggedInboxTaskId}

                  showOptions={{
                    showSource: false,
                    showEisen: true,
                    showDifficulty: true,
                    showDueDate: true,
                  }}
                  cardLinkResolver={(inboxTask, parent) =>
                    parent?.todoTask
                      ? `/app/workspace/todos/${parent.todoTask.ref_id}`
                      : `/app/workspace/inbox-tasks/${inboxTask.ref_id}`
                  }
                />
              </DragDropContext>
            </>
          )}

        {selectedView === View.KANBAN_BY_EISEN &&
          sortedTodoInboxTasks.length > 0 &&
          isBigScreen && (
            <>
              <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                {EISENS.map((e) => (
                  <Fragment key={e}>
                    <StandardDivider
                      title={`${eisenIcon(e)} ${eisenName(e)}`}
                      size="large"
                    />
                    <InboxTaskKanbanBoard
                      topLevelInfo={topLevelInfo}
                      inboxTasks={sortedTodoInboxTasks}
                      optimisticUpdates={optimisticUpdates}
                      inboxTasksByRefId={inboxTasksByRefId}
                      moreInfoByRefId={moreInfoByRefId}
                      actionableTime={selectedActionableTime}
                      allowEisen={e}
                      draggedInboxTaskId={draggedInboxTaskId}
    
                      showOptions={{
                        showSource: false,
                        showEisen: false,
                        showDifficulty: true,
                        showDueDate: true,
                      }}
                      cardLinkResolver={(inboxTask, parent) =>
                        parent?.todoTask
                          ? `/app/workspace/todos/${parent.todoTask.ref_id}`
                          : `/app/workspace/inbox-tasks/${inboxTask.ref_id}`
                      }
                    />
                  </Fragment>
                ))}
              </DragDropContext>
            </>
          )}

        {selectedView === View.KANBAN &&
          sortedTodoInboxTasks.length > 0 &&
          !isBigScreen && (
            <>
              <SmallScreenKanban
                topLevelInfo={topLevelInfo}
                inboxTasks={sortedTodoInboxTasks}
                optimisticUpdates={optimisticUpdates}
                moreInfoByRefId={moreInfoByRefId}
                actionableTime={selectedActionableTime}
                onCardMarkDone={handleCardMarkDone}
                onCardMarkNotDone={handleCardMarkNotDone}
                emptyParent="todo task"
                emptyParentLabel="New Todo Task"
                emptyParentNewLocations="/app/workspace/todos/new"
                cardLinkResolver={(inboxTask, parent) =>
                  parent?.todoTask
                    ? `/app/workspace/todos/${parent.todoTask.ref_id}`
                    : `/app/workspace/inbox-tasks/${inboxTask.ref_id}`
                }
              />
            </>
          )}

        {selectedView === View.KANBAN_BY_EISEN &&
          sortedTodoInboxTasks.length > 0 &&
          !isBigScreen && (
            <>
              <SmallScreenKanbanByEisen
                topLevelInfo={topLevelInfo}
                inboxTasks={sortedTodoInboxTasks}
                optimisticUpdates={optimisticUpdates}
                moreInfoByRefId={moreInfoByRefId}
                actionableTime={selectedActionableTime}
                onCardMarkDone={handleCardMarkDone}
                onCardMarkNotDone={handleCardMarkNotDone}
                emptyParent="todo task"
                emptyParentLabel="New Todo Task"
                emptyParentNewLocations="/app/workspace/todos/new"
                cardLinkResolver={(inboxTask, parent) =>
                  parent?.todoTask
                    ? `/app/workspace/todos/${parent.todoTask.ref_id}`
                    : `/app/workspace/inbox-tasks/${inboxTask.ref_id}`
                }
              />
            </>
          )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

interface TodoSwiftViewProps {
  topLevelInfo: TopLevelInfo;
  isBigScreen: boolean;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  onCardMarkDone: (inboxTask: InboxTask) => void;
  onCardMarkNotDone: (inboxTask: InboxTask) => void;
}

function TodoSwiftView(props: TodoSwiftViewProps) {
  const endOfToday = aDateToDate(props.topLevelInfo.today).endOf("day");
  const endOfWeek = aDateToDate(props.topLevelInfo.today)
    .endOf("week")
    .endOf("day");
  const endOfMonth = aDateToDate(props.topLevelInfo.today)
    .endOf("month")
    .endOf("day");
  const startOfTomorrow = endOfToday.plus({ days: 1 }).startOf("day");
  const startAfterWeek = endOfWeek.plus({ days: 1 }).startOf("day");
  const startAfterMonth = endOfMonth.plus({ days: 1 }).startOf("day");
  const actionableDate = actionableTimeToDateTime(
    props.actionableTime,
    props.topLevelInfo.user.timezone,
  );

  const dueToday = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableDate,
      dueDateEnd: endOfToday,
    },
  );

  const dueThisWeek = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableDate,
      dueDateStart: startOfTomorrow,
      dueDateEnd: endOfWeek,
    },
  );

  const dueThisMonth = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableDate,
      dueDateStart: startAfterWeek,
      dueDateEnd: endOfMonth,
    },
  );

  const dueLater = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableDate,
      includeIfNoDueDate: true,
      dueDateStart: startAfterMonth,
    },
  );

  let initialSelectedTab = 0;
  if (dueToday.length > 0) {
    initialSelectedTab = 0;
  } else if (dueThisWeek.length > 0) {
    initialSelectedTab = 1;
  } else if (dueThisMonth.length > 0) {
    initialSelectedTab = 2;
  } else if (dueLater.length > 0) {
    initialSelectedTab = 3;
  }

  const [selectedTab, setSelectedTab] = useState(initialSelectedTab);

  const sharedProps = {
    topLevelInfo: props.topLevelInfo,
    showOptions: {
      showStatus: true,
      showSource: false,
      showEisen: true,
      showDifficulty: true,
      showDueDate: true,
      showParent: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true,
    },
    optimisticUpdates: props.optimisticUpdates,
    moreInfoByRefId: props.moreInfoByRefId,
    onCardMarkDone: props.onCardMarkDone,
    onCardMarkNotDone: props.onCardMarkNotDone,
    cardLinkResolver: (inboxTask: InboxTask, parent?: InboxTaskParent) =>
      parent?.todoTask
        ? `/app/workspace/todos/${parent.todoTask.ref_id}`
        : `/app/workspace/inbox-tasks/${inboxTask.ref_id}`,
  };

  function renderBucket(
    label: string,
    tasks: InboxTask[],
    options?: {
      showHeading?: boolean;
      initialDueDate?: "day" | "week" | "month" | "year";
    },
  ) {
    const showHeading = options?.showHeading ?? true;
    const newEntityLocation = options?.initialDueDate
      ? `/app/workspace/todos/new?initialDueDate=${options.initialDueDate}`
      : "/app/workspace/todos/new";
    return (
      <>
        {showHeading && (
          <Typography variant="h6" sx={{ mb: 1 }}>
            {label}
          </Typography>
        )}
        {tasks.length > 0 ? (
          <InboxTaskStack {...sharedProps} inboxTasks={tasks} />
        ) : (
          <EntityNoNothingCard
            helpSubject={DocsHelpSubject.TODOS}
            title="Nothing In This Bucket"
            message="No todo tasks match this due-date bucket and actionable filter."
            newEntityLocations={newEntityLocation}
          />
        )}
      </>
    );
  }

  if (props.isBigScreen) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          {renderBucket("Due today", dueToday, { initialDueDate: "day" })}
        </Grid>
        <Grid item xs={12} md={3}>
          {renderBucket("Due this week", dueThisWeek, {
            initialDueDate: "week",
          })}
        </Grid>
        <Grid item xs={12} md={3}>
          {renderBucket("Due this month", dueThisMonth, {
            initialDueDate: "month",
          })}
        </Grid>
        <Grid item xs={12} md={3}>
          {renderBucket("Due later", dueLater, { initialDueDate: "year" })}
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Tabs
        value={selectedTab}
        variant="fullWidth"
        onChange={(_, newValue) => setSelectedTab(newValue)}
      >
        <Tab label="Due today" />
        <Tab label="Due this week" />
        <Tab label="Due this month" />
        <Tab label="Due later" />
      </Tabs>
      <TabPanel value={selectedTab} index={0}>
        {renderBucket("Due today", dueToday, {
          showHeading: false,
          initialDueDate: "day",
        })}
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        {renderBucket("Due this week", dueThisWeek, {
          showHeading: false,
          initialDueDate: "week",
        })}
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        {renderBucket("Due this month", dueThisMonth, {
          showHeading: false,
          initialDueDate: "month",
        })}
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        {renderBucket("Due later", dueLater, {
          showHeading: false,
          initialDueDate: "year",
        })}
      </TabPanel>
    </>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the todo tasks! Please try again!`,
});
