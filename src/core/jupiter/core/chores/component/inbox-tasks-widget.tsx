import {
  InboxTaskSource,
  InboxTaskStatus,
  RecurringTaskPeriod,
} from "@jupiter/webapi-client";

import { aDateToDate } from "#/core/common/adate";
import {
  filterInboxTasksForDisplay,
  sortInboxTasksByEisenAndDifficulty,
} from "#/core/inbox_tasks/root";
import { InboxTaskStack } from "#/core/inbox_tasks/component/stack";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "#/core/infra/actionable-time";
import { InboxTasksNoTasksCard } from "#/core/inbox_tasks/component/no-tasks-card";
import { WidgetProps } from "#/core/home/component/common";

export function ChoreInboxTasksWidget(props: WidgetProps) {
  const choreTasks = props.choreTasks!;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const endOfTheWeek = today.endOf("week").endOf("day");
  const actionableTime = actionableTimeToDateTime(
    ActionableTime.ONE_WEEK,
    props.topLevelInfo.user.timezone,
  );

  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(
    choreTasks.choreInboxTasks,
  );

  const inboxTasksForChoresDueToday = filterInboxTasksForDisplay(
    sortedInboxTasks,
    choreTasks.choreEntriesByRefId,
    choreTasks.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.CHORE],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: today,
      allowPeriodsIfChore: [RecurringTaskPeriod.DAILY],
    },
  );

  const inboxTasksForChoresDueThisWeek = filterInboxTasksForDisplay(
    sortedInboxTasks,
    choreTasks.choreEntriesByRefId,
    choreTasks.optimisticUpdates,
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

  const choresStack = (
    <>
      <InboxTaskStack
        key="chore-due-today"
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
        inboxTasks={inboxTasksForChoresDueToday}
        optimisticUpdates={choreTasks.optimisticUpdates}
        moreInfoByRefId={choreTasks.choreEntriesByRefId}
        onCardMarkDone={choreTasks.onCardMarkDone}
        onCardMarkNotDone={choreTasks.onCardMarkNotDone}
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
        optimisticUpdates={choreTasks.optimisticUpdates}
        moreInfoByRefId={choreTasks.choreEntriesByRefId}
        onCardMarkDone={choreTasks.onCardMarkDone}
        onCardMarkNotDone={choreTasks.onCardMarkNotDone}
      />
    </>
  );

  if (
    inboxTasksForChoresDueToday.length === 0 &&
    inboxTasksForChoresDueThisWeek.length === 0
  ) {
    return (
      <InboxTasksNoTasksCard
        parent="chore"
        parentLabel="New Chore"
        parentNewLocations="/app/workspace/chores/new"
      />
    );
  }

  return choresStack;
}
