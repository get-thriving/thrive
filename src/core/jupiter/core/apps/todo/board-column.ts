import { InboxTaskStatus } from "@jupiter/webapi-client";

/** The columns of the todo board. Fewer than the statuses, on purpose. */
export enum TodoBoardColumn {
  /** Not started, and blocked: nothing is moving on it right now. */
  TODO = "todo",
  /** In progress. */
  DOING = "doing",
  /** Done, and not done: the work is over, one way or the other. */
  DONE = "done",
}

export const TODO_BOARD_COLUMNS: ReadonlyArray<TodoBoardColumn> = [
  TodoBoardColumn.TODO,
  TodoBoardColumn.DOING,
  TodoBoardColumn.DONE,
];

export function todoBoardColumnName(column: TodoBoardColumn): string {
  switch (column) {
    case TodoBoardColumn.TODO:
      return "To do";
    case TodoBoardColumn.DOING:
      return "Doing";
    case TodoBoardColumn.DONE:
      return "Done";
  }
}

export function todoBoardColumnIcon(column: TodoBoardColumn): string {
  switch (column) {
    case TodoBoardColumn.TODO:
      return "📥";
    case TodoBoardColumn.DOING:
      return "🚧";
    case TodoBoardColumn.DONE:
      return "✅";
  }
}

/** The column a task with this status sits in. */
export function todoBoardColumnForStatus(
  status: InboxTaskStatus,
): TodoBoardColumn {
  switch (status) {
    case InboxTaskStatus.NOT_STARTED:
    case InboxTaskStatus.BLOCKED:
      return TodoBoardColumn.TODO;
    case InboxTaskStatus.IN_PROGRESS:
      return TodoBoardColumn.DOING;
    case InboxTaskStatus.DONE:
    case InboxTaskStatus.NOT_DONE:
      return TodoBoardColumn.DONE;
  }
}

/** The status a task gets when it is dropped into this column. */
export function todoBoardStatusForColumn(
  column: TodoBoardColumn,
): InboxTaskStatus {
  switch (column) {
    case TodoBoardColumn.TODO:
      return InboxTaskStatus.NOT_STARTED;
    case TodoBoardColumn.DOING:
      return InboxTaskStatus.IN_PROGRESS;
    case TodoBoardColumn.DONE:
      return InboxTaskStatus.DONE;
  }
}
