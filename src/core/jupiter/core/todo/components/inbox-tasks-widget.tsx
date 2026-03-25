import { InboxTaskSource, InboxTaskStatus } from "@jupiter/webapi-client";

import { aDateToDate } from "#/core/common/adate";
import {
  filterInboxTasksForDisplay,
  sortInboxTasksNaturally,
} from "#/core/inbox_tasks/root";
import { InboxTaskStack } from "#/core/inbox_tasks/component/stack";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "#/core/infra/actionable-time";
import { InboxTasksNoTasksCard } from "#/core/inbox_tasks/component/no-tasks-card";
import { WidgetProps } from "#/core/home/component/common";

export function TodoInboxTasksWidget(props: WidgetProps) {
  const todoTasks = props.todoTasks!;
  const todayDate = aDateToDate(props.topLevelInfo.today);
  const startOfToday = todayDate.startOf("day");
  const endOfToday = todayDate.endOf("day");
  const endOfWeek = todayDate.endOf("week").endOf("day");
  const endOfMonth = todayDate.endOf("month").endOf("day");
  const startOfTomorrow = startOfToday.plus({ days: 1 });
  const startOfNextWeek = endOfWeek.plus({ days: 1 }).startOf("day");
  const startOfNextMonth = endOfMonth.plus({ days: 1 }).startOf("day");

  const actionableTime = actionableTimeToDateTime(
    ActionableTime.ONE_WEEK,
    props.topLevelInfo.user.timezone,
  );
  const sortedInboxTasks = sortInboxTasksNaturally(todoTasks.todoInboxTasks);

  const commonFilterOptions = {
    allowSources: [InboxTaskSource.TODO_TASK],
    allowStatuses: [
      InboxTaskStatus.NOT_STARTED,
      InboxTaskStatus.IN_PROGRESS,
      InboxTaskStatus.BLOCKED,
      InboxTaskStatus.NOT_DONE,
    ],
    includeIfNoActionableDate: true,
    actionableDateEnd: actionableTime,
  };

  const dueToday = filterInboxTasksForDisplay(
    sortedInboxTasks,
    todoTasks.todoEntriesByRefId,
    todoTasks.optimisticUpdates,
    {
      ...commonFilterOptions,
      dueDateStart: startOfToday,
      dueDateEnd: endOfToday,
    },
  );

  const dueThisWeek = filterInboxTasksForDisplay(
    sortedInboxTasks,
    todoTasks.todoEntriesByRefId,
    todoTasks.optimisticUpdates,
    {
      ...commonFilterOptions,
      dueDateStart: startOfTomorrow,
      dueDateEnd: endOfWeek,
    },
  );

  const dueThisMonth = filterInboxTasksForDisplay(
    sortedInboxTasks,
    todoTasks.todoEntriesByRefId,
    todoTasks.optimisticUpdates,
    {
      ...commonFilterOptions,
      dueDateStart: startOfNextWeek,
      dueDateEnd: endOfMonth,
    },
  );

  const dueLater = filterInboxTasksForDisplay(
    sortedInboxTasks,
    todoTasks.todoEntriesByRefId,
    todoTasks.optimisticUpdates,
    {
      ...commonFilterOptions,
      dueDateStart: startOfNextMonth,
      includeIfNoDueDate: true,
    },
  );

  if (
    dueToday.length === 0 &&
    dueThisWeek.length === 0 &&
    dueThisMonth.length === 0 &&
    dueLater.length === 0
  ) {
    return (
      <InboxTasksNoTasksCard
        parent="todo task"
        parentLabel="New Todo Task"
        parentNewLocations="/app/workspace/todos/new"
      />
    );
  }

  return (
    <>
      <InboxTaskStack
        key="todo-due-today"
        topLevelInfo={props.topLevelInfo}
        showOptions={{
          showStatus: true,
          showEisen: true,
          showDifficulty: true,
          showParent: true,
          showDueDate: true,
          showHandleMarkDone: true,
          showHandleMarkNotDone: true,
        }}
        label="Due Today"
        inboxTasks={dueToday}
        optimisticUpdates={todoTasks.optimisticUpdates}
        moreInfoByRefId={todoTasks.todoEntriesByRefId}
        cardLinkResolver={(_, parent) =>
          parent?.todoTask
            ? `/app/workspace/todos/${parent.todoTask.ref_id}`
            : "/app/workspace/core/inbox-tasks"
        }
        onCardMarkDone={todoTasks.onCardMarkDone}
        onCardMarkNotDone={todoTasks.onCardMarkNotDone}
      />

      <InboxTaskStack
        key="todo-due-this-week"
        topLevelInfo={props.topLevelInfo}
        showOptions={{
          showStatus: true,
          showEisen: true,
          showDifficulty: true,
          showParent: true,
          showDueDate: true,
          showHandleMarkDone: true,
          showHandleMarkNotDone: true,
        }}
        label="Due This Week"
        inboxTasks={dueThisWeek}
        optimisticUpdates={todoTasks.optimisticUpdates}
        moreInfoByRefId={todoTasks.todoEntriesByRefId}
        cardLinkResolver={(_, parent) =>
          parent?.todoTask
            ? `/app/workspace/todos/${parent.todoTask.ref_id}`
            : "/app/workspace/core/inbox-tasks"
        }
        onCardMarkDone={todoTasks.onCardMarkDone}
        onCardMarkNotDone={todoTasks.onCardMarkNotDone}
      />

      <InboxTaskStack
        key="todo-due-this-month"
        topLevelInfo={props.topLevelInfo}
        showOptions={{
          showStatus: true,
          showEisen: true,
          showDifficulty: true,
          showParent: true,
          showDueDate: true,
          showHandleMarkDone: true,
          showHandleMarkNotDone: true,
        }}
        label="Due This Month"
        inboxTasks={dueThisMonth}
        optimisticUpdates={todoTasks.optimisticUpdates}
        moreInfoByRefId={todoTasks.todoEntriesByRefId}
        cardLinkResolver={(_, parent) =>
          parent?.todoTask
            ? `/app/workspace/todos/${parent.todoTask.ref_id}`
            : "/app/workspace/core/inbox-tasks"
        }
        onCardMarkDone={todoTasks.onCardMarkDone}
        onCardMarkNotDone={todoTasks.onCardMarkNotDone}
      />

      <InboxTaskStack
        key="todo-due-later"
        topLevelInfo={props.topLevelInfo}
        showOptions={{
          showStatus: true,
          showEisen: true,
          showDifficulty: true,
          showParent: true,
          showDueDate: true,
          showHandleMarkDone: true,
          showHandleMarkNotDone: true,
        }}
        label="Due Later"
        inboxTasks={dueLater}
        optimisticUpdates={todoTasks.optimisticUpdates}
        moreInfoByRefId={todoTasks.todoEntriesByRefId}
        cardLinkResolver={(_, parent) =>
          parent?.todoTask
            ? `/app/workspace/todos/${parent.todoTask.ref_id}`
            : "/app/workspace/core/inbox-tasks"
        }
        onCardMarkDone={todoTasks.onCardMarkDone}
        onCardMarkNotDone={todoTasks.onCardMarkNotDone}
      />
    </>
  );
}
