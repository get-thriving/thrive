import { Draggable, Droppable } from "@hello-pangea/dnd";
import type { InboxTask, Eisen } from "@jupiter/webapi-client";
import { InboxTaskStatus } from "@jupiter/webapi-client";
import { Box, Stack, Typography, styled } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { memo } from "react";

import {
  ActionableTime,
  actionableTimeToDateTime,
} from "#/core/infra/actionable-time";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import type { InboxTaskShowOptions } from "#/core/common/sub/inbox_tasks/component/card";
import { InboxTaskCard } from "#/core/common/sub/inbox_tasks/component/card";
import { InboxTaskStatusTag } from "#/core/common/sub/inbox_tasks/component/status-tag";
import {
  canInboxTaskBeInStatus,
  filterInboxTasksForDisplay,
  isInboxTaskCoreFieldEditable,
} from "#/core/common/sub/inbox_tasks/root";
import type {
  InboxTaskOptimisticState,
  InboxTaskParent,
} from "#/core/common/sub/inbox_tasks/root";

enum DragTargetStatus {
  SOURCE_DRAG,
  SELECT_DRAG,
  ALLOW_DRAG,
  FORBID_DRAG,
  FREE,
}

const defaultShowOptions: InboxTaskShowOptions = {
  showSource: true,
  showEisen: true,
  showDifficulty: true,
  showDueDate: true,
};

export interface InboxTaskKanbanBoardProps {
  topLevelInfo: TopLevelInfo;
  inboxTasks: Array<InboxTask>;
  optimisticUpdates: { [key: string]: InboxTaskOptimisticState };
  inboxTasksByRefId: { [key: string]: InboxTask };
  moreInfoByRefId: { [key: string]: InboxTaskParent };
  actionableTime: ActionableTime;
  allowEisen?: Eisen;
  groupId?: string;
  draggedInboxTaskId?: string;
  showOptions?: InboxTaskShowOptions;
  cardLinkResolver?: (it: InboxTask, parent?: InboxTaskParent) => string;
}

export function InboxTaskKanbanBoard({
  topLevelInfo,
  inboxTasks,
  optimisticUpdates,
  inboxTasksByRefId,
  moreInfoByRefId,
  actionableTime,
  allowEisen,
  groupId,
  draggedInboxTaskId,
  showOptions,
  cardLinkResolver,
}: InboxTaskKanbanBoardProps) {
  const resolvedShowOptions = {
    ...defaultShowOptions,
    ...(showOptions ?? {}),
    showEisen: allowEisen === undefined && (showOptions?.showEisen ?? true),
  };

  const columnSize = 2.4;

  return (
    <Grid container spacing={2} style={{ paddingBottom: "1.25rem" }}>
      <Grid size={{ xs: columnSize }} sx={{ position: "relative" }}>
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
          showOptions={resolvedShowOptions}
          draggedInboxTaskId={draggedInboxTaskId}
          cardLinkResolver={cardLinkResolver}
        />
      </Grid>

      <Grid size={{ xs: columnSize }} sx={{ position: "relative" }}>
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
          showOptions={resolvedShowOptions}
          draggedInboxTaskId={draggedInboxTaskId}
          cardLinkResolver={cardLinkResolver}
        />
      </Grid>

      <Grid size={{ xs: columnSize }} sx={{ position: "relative" }}>
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
          showOptions={resolvedShowOptions}
          draggedInboxTaskId={draggedInboxTaskId}
          cardLinkResolver={cardLinkResolver}
        />
      </Grid>

      <Grid size={{ xs: columnSize }} sx={{ position: "relative" }}>
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
          showOptions={resolvedShowOptions}
          draggedInboxTaskId={draggedInboxTaskId}
          cardLinkResolver={cardLinkResolver}
        />
      </Grid>

      <Grid size={{ xs: columnSize }} sx={{ position: "relative" }}>
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
          showOptions={resolvedShowOptions}
          draggedInboxTaskId={draggedInboxTaskId}
          cardLinkResolver={cardLinkResolver}
        />
      </Grid>
    </Grid>
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
  cardLinkResolver?: (it: InboxTask, parent?: InboxTaskParent) => string;
}

function InboxTasksColumn(props: InboxTasksColumnProps) {
  function getColumnModifier(snapshot: {
    draggingFromThisWith?: string | null;
    isDraggingOver: boolean;
  }) {
    if (snapshot.draggingFromThisWith) {
      return DragTargetStatus.SOURCE_DRAG;
    }

    if (snapshot.isDraggingOver) {
      return DragTargetStatus.SELECT_DRAG;
    }

    if (props.draggedInboxTaskId !== undefined) {
      if (allowDraggingOverStatus() && allowDraggingOverEisen()) {
        return DragTargetStatus.ALLOW_DRAG;
      }
      return DragTargetStatus.FORBID_DRAG;
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

    if (isInboxTaskCoreFieldEditable(inboxTask.namespace)) {
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
                cardLinkResolver={props.cardLinkResolver}
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
  cardLinkResolver?: (it: InboxTask, parent?: InboxTaskParent) => string;
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
            {(provided) => (
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
                    showParent: true,
                    showHandleMarkDone: false,
                    showHandleMarkNotDone: false,
                  }}
                  inboxTask={inboxTask}
                  parent={entry}
                  linkResolver={props.cardLinkResolver}
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
