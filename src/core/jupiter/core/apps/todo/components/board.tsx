import type { DragStart, DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { InboxTask } from "@jupiter/webapi-client";
import { InboxTaskStatus } from "@jupiter/webapi-client";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { Fragment, useState } from "react";

import {
  TODO_BOARD_COLUMNS,
  TodoBoardColumn,
  todoBoardColumnForStatus,
  todoBoardColumnName,
  todoBoardStatusForColumn,
} from "#/core/apps/todo/board-column";
import {
  groupTodoBoardDoneByDay,
  isTodoBoardRecentlyFinishedArchivedTask,
  todoBoardDayLabel,
} from "#/core/apps/todo/board-done-groups";
import { InboxTaskCard } from "#/core/common/sub/inbox_tasks/component/card";
import { accessStatusAllowsWriterOrAbove } from "#/core/common/sub/access/access-level";
import { isCompleted } from "#/core/common/sub/inbox_tasks/status";
import { filterInboxTasksForDisplay } from "#/core/common/sub/inbox_tasks/root";
import type {
  InboxTaskOptimisticState,
  InboxTaskParent,
} from "#/core/common/sub/inbox_tasks/root";
import type { ActionableTime } from "#/core/infra/actionable-time";
import { actionableTimeToDateTime } from "#/core/infra/actionable-time";
import { strataColors } from "#/core/infra/component/strata-tokens";
import { TabPanel } from "#/core/infra/component/tab-panel";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

export interface TodoBoardProps {
  topLevelInfo: TopLevelInfo;
  /** The inbox tasks of the todos that are not archived. */
  inboxTasks: Array<InboxTask>;
  /**
   * The inbox tasks of archived todos. Only those finished in the last seven
   * days are shown, in the done column.
   */
  archivedInboxTasks: Array<InboxTask>;
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  actionableTime: ActionableTime;
  /** Called when a card is dropped into a column it was not in. */
  onMove: (inboxTask: InboxTask, status: InboxTaskStatus) => void;
}

interface ColumnContent {
  column: TodoBoardColumn;
  /** All the tasks of the column, in the order they are drawn. */
  inboxTasks: Array<InboxTask>;
  /** Only the done column has day groups. */
  doneGroups?: Array<{ label: string; inboxTasks: Array<InboxTask> }>;
}

export function TodoBoard(props: TodoBoardProps) {
  const isBigScreen = useBigScreen();
  const [draggedRefId, setDraggedRefId] = useState<string | undefined>(
    undefined,
  );
  const [smallScreenTab, setSmallScreenTab] = useState(0);

  const timezone = props.topLevelInfo.user.timezone;
  const now = DateTime.now();
  const actionableTime = actionableTimeToDateTime(
    props.actionableTime,
    timezone,
  );

  function statusOf(inboxTask: InboxTask): InboxTaskStatus {
    return (
      props.optimisticUpdates[inboxTask.ref_id]?.status ?? inboxTask.status
    );
  }

  function columnOf(inboxTask: InboxTask): TodoBoardColumn {
    return todoBoardColumnForStatus(statusOf(inboxTask));
  }

  // The to do and doing columns respect the "actionable" filter, like the
  // other kanban views do. What is finished is shown whatever it said.
  const openInboxTasks = filterInboxTasksForDisplay(
    props.inboxTasks,
    props.moreInfoByRefId,
    props.optimisticUpdates,
    {
      allowArchived: false,
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      includeIfNoDueDate: true,
    },
  ).filter((inboxTask) => !isCompleted(statusOf(inboxTask)));

  const optimisticStatuses: { [refId: string]: InboxTaskStatus } = {};
  for (const [refId, update] of Object.entries(props.optimisticUpdates)) {
    optimisticStatuses[refId] = update.status;
  }

  const finishedInboxTasks = [
    ...props.inboxTasks.filter(
      (inboxTask) => !inboxTask.archived && isCompleted(statusOf(inboxTask)),
    ),
    ...props.archivedInboxTasks.filter((inboxTask) =>
      isTodoBoardRecentlyFinishedArchivedTask(inboxTask, timezone, now),
    ),
  ];
  const doneGroups = groupTodoBoardDoneByDay(
    finishedInboxTasks,
    timezone,
    now,
    optimisticStatuses,
  ).map((group) => ({
    label: todoBoardDayLabel(group.day, timezone, now),
    inboxTasks: group.inboxTasks,
  }));

  const columns: Array<ColumnContent> = [
    {
      column: TodoBoardColumn.TODO,
      inboxTasks: openInboxTasks.filter(
        (inboxTask) => columnOf(inboxTask) === TodoBoardColumn.TODO,
      ),
    },
    {
      column: TodoBoardColumn.DOING,
      inboxTasks: openInboxTasks.filter(
        (inboxTask) => columnOf(inboxTask) === TodoBoardColumn.DOING,
      ),
    },
    {
      column: TodoBoardColumn.DONE,
      inboxTasks: doneGroups.flatMap((group) => group.inboxTasks),
      doneGroups,
    },
  ];

  const inboxTasksByRefId: { [key: string]: InboxTask } = {};
  for (const inboxTask of [...props.inboxTasks, ...props.archivedInboxTasks]) {
    inboxTasksByRefId[inboxTask.ref_id] = inboxTask;
  }

  function canMove(inboxTask: InboxTask): boolean {
    if (inboxTask.archived) {
      return false;
    }
    const accessStatus = props.moreInfoByRefId[inboxTask.ref_id]?.accessStatus;
    return (
      accessStatus === undefined ||
      accessStatusAllowsWriterOrAbove(accessStatus)
    );
  }

  function onDragStart(start: DragStart) {
    setDraggedRefId(start.draggableId);
  }

  function onDragEnd(result: DropResult) {
    setDraggedRefId(undefined);

    if (!result.destination) {
      return;
    }

    const inboxTask = inboxTasksByRefId[result.draggableId];
    if (inboxTask === undefined || !canMove(inboxTask)) {
      return;
    }

    const destination = result.destination.droppableId.replace(
      "todo-board:",
      "",
    ) as TodoBoardColumn;
    if (destination === columnOf(inboxTask)) {
      return;
    }

    props.onMove(inboxTask, todoBoardStatusForColumn(destination));
  }

  const draggedColumn =
    draggedRefId !== undefined && inboxTasksByRefId[draggedRefId] !== undefined
      ? columnOf(inboxTasksByRefId[draggedRefId])
      : undefined;

  function renderCard(inboxTask: InboxTask) {
    const info = props.moreInfoByRefId[inboxTask.ref_id];
    if (info?.todoTask === undefined) {
      return null;
    }
    const status = statusOf(inboxTask);
    return (
      <InboxTaskCard
        topLevelInfo={props.topLevelInfo}
        dense
        showOptions={{
          // The column says which status it is, except for these two, which
          // share a column with what is not like them.
          showStatus:
            status === InboxTaskStatus.BLOCKED ||
            status === InboxTaskStatus.NOT_DONE,
          showEisen: true,
          showDifficulty: true,
          showDueDate: true,
        }}
        inboxTask={inboxTask}
        optimisticState={props.optimisticUpdates[inboxTask.ref_id]}
        parent={info}
        linkResolver={(_, parent) =>
          `/app/workspace/apps/todos/${parent?.todoTask?.ref_id}`
        }
      />
    );
  }

  if (!isBigScreen) {
    return (
      <Box>
        <Tabs
          value={smallScreenTab}
          variant="fullWidth"
          onChange={(_, newValue) => setSmallScreenTab(newValue)}
        >
          {columns.map((content) => (
            <Tab
              key={content.column}
              label={`${todoBoardColumnName(content.column)} ${content.inboxTasks.length}`}
            />
          ))}
        </Tabs>
        {columns.map((content, index) => (
          <TabPanel key={content.column} value={smallScreenTab} index={index}>
            <Box sx={boardListSx}>
              {content.doneGroups
                ? content.doneGroups.map((group) => (
                    <Fragment key={group.label}>
                      <DayHeader
                        label={group.label}
                        count={group.inboxTasks.length}
                      />
                      {group.inboxTasks.map((inboxTask) => (
                        <Fragment key={inboxTask.ref_id}>
                          {renderCard(inboxTask)}
                        </Fragment>
                      ))}
                    </Fragment>
                  ))
                : content.inboxTasks.map((inboxTask) => (
                    <Fragment key={inboxTask.ref_id}>
                      {renderCard(inboxTask)}
                    </Fragment>
                  ))}
              {content.inboxTasks.length === 0 && <EmptyColumn />}
            </Box>
          </TabPanel>
        ))}
      </Box>
    );
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "0.75rem",
          alignItems: "start",
        }}
      >
        {TODO_BOARD_COLUMNS.map((column) => {
          const content = columns.find((c) => c.column === column)!;
          // Dropping a card where it already is does nothing, so the column
          // it came from is not a target.
          const isTarget =
            draggedColumn !== undefined && draggedColumn !== column;
          let nextIndex = 0;

          return (
            <Box key={column}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.5rem",
                  padding: "0 4px 6px",
                }}
              >
                <Typography
                  component="h3"
                  variant="overline"
                  sx={{ color: strataColors.textFaint }}
                >
                  {todoBoardColumnName(column)}
                </Typography>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ color: strataColors.textFaintest }}
                >
                  {content.inboxTasks.length}
                </Typography>
              </Box>

              <Droppable
                type="todo-board"
                droppableId={`todo-board:${column}`}
                direction="vertical"
                isDropDisabled={!isTarget}
              >
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    data-testid={`todo-board-column-${column}`}
                    sx={{
                      ...boardListSx,
                      minHeight: "8rem",
                      maxHeight: "calc(100vh - 12rem)",
                      overflowY: "auto",
                      // A column that can take the card is outlined in amber, and
                      // the one it is over is tinted as well.
                      borderStyle: isTarget ? "dashed" : "solid",
                      borderColor: snapshot.isDraggingOver
                        ? strataColors.amber
                        : isTarget
                          ? strataColors.amberLine
                          : strataColors.line,
                      backgroundColor: snapshot.isDraggingOver
                        ? strataColors.amberTint
                        : strataColors.panel,
                    }}
                  >
                    {content.doneGroups === undefined &&
                      content.inboxTasks.map((inboxTask) => {
                        const index = nextIndex++;
                        return (
                          <DraggableCard
                            key={inboxTask.ref_id}
                            inboxTask={inboxTask}
                            index={index}
                            movable={canMove(inboxTask)}
                          >
                            {renderCard(inboxTask)}
                          </DraggableCard>
                        );
                      })}

                    {content.doneGroups?.map((group) => (
                      <Fragment key={group.label}>
                        <DayHeader
                          label={group.label}
                          count={group.inboxTasks.length}
                        />
                        {group.inboxTasks.map((inboxTask) => {
                          const index = nextIndex++;
                          return (
                            <DraggableCard
                              key={inboxTask.ref_id}
                              inboxTask={inboxTask}
                              index={index}
                              movable={canMove(inboxTask)}
                            >
                              {renderCard(inboxTask)}
                            </DraggableCard>
                          );
                        })}
                      </Fragment>
                    ))}

                    {provided.placeholder}

                    {content.inboxTasks.length === 0 && <EmptyColumn />}
                  </Box>
                )}
              </Droppable>
            </Box>
          );
        })}
      </Box>
    </DragDropContext>
  );
}

interface DraggableCardProps {
  inboxTask: InboxTask;
  index: number;
  movable: boolean;
  children: React.ReactNode;
}

function DraggableCard(props: DraggableCardProps) {
  return (
    <Draggable
      draggableId={props.inboxTask.ref_id}
      index={props.index}
      isDragDisabled={!props.movable}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            // Rows have no surface, so one being carried needs its own.
            ...(snapshot.isDragging
              ? {
                  backgroundColor: strataColors.raised,
                  border: `1px solid ${strataColors.lineStrong}`,
                  borderRadius: 4,
                }
              : {}),
          }}
        >
          {props.children}
        </div>
      )}
    </Draggable>
  );
}

/** The list of rows of a column: one hairline box, the rows divided by lines. */
const boardListSx = {
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${strataColors.line}`,
  borderRadius: "4px",
  backgroundColor: strataColors.panel,
} as const;

/** A day of the done column: a mono label, with the count of what was finished. */
function DayHeader(props: { label: string; count: number }) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        display: "flex",
        alignItems: "baseline",
        gap: "0.5rem",
        padding: "2px 8px",
        // Opaque, so rows scroll under it instead of showing through.
        backgroundColor: strataColors.column,
        borderBottom: `1px solid ${strataColors.rowDivider}`,
      }}
    >
      <Typography
        component="span"
        variant="overline"
        sx={{ color: strataColors.textFaint }}
      >
        {props.label}
      </Typography>
      <Typography
        component="span"
        variant="caption"
        sx={{ color: strataColors.textFaintest }}
      >
        {props.count}
      </Typography>
    </Box>
  );
}

function EmptyColumn() {
  return (
    <Typography
      variant="caption"
      sx={{
        color: strataColors.textFaintest,
        textAlign: "center",
        py: "16px",
      }}
    >
      Nothing here
    </Typography>
  );
}
