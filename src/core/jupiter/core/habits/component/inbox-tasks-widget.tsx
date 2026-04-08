import {
  InboxTaskNamespace,
  InboxTaskStatus,
  RecurringTaskPeriod,
} from "@jupiter/webapi-client";

import { aDateToDate } from "#/core/common/adate";
import {
  filterInboxTasksForDisplay,
  sortInboxTasksByEisenAndDifficulty,
} from "#/core/common/sub/inbox_tasks/root";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "#/core/infra/actionable-time";
import { WidgetProps } from "#/core/home/component/common";
import { InboxTaskStack } from "#/core/common/sub/inbox_tasks/component/stack";
import { InboxTasksNoTasksCard } from "#/core/common/sub/inbox_tasks/component/no-tasks-card";

export function HabitInboxTasksWidget(props: WidgetProps) {
  const habitTasks = props.habitTasks!;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const endOfTheWeek = today.endOf("week").endOf("day");
  const actionableTime = actionableTimeToDateTime(
    ActionableTime.ONE_WEEK,
    props.topLevelInfo.user.timezone,
  );

  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(
    habitTasks.habitInboxTasks,
  );

  const inboxTasksForHabitsDueToday = filterInboxTasksForDisplay(
    sortedInboxTasks,
    habitTasks.habitEntriesByRefId,
    habitTasks.optimisticUpdates,
    {
      allowSources: [InboxTaskNamespace.HABIT],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: today,
      allowPeriodsIfHabit: [RecurringTaskPeriod.DAILY],
    },
  );

  const inboxTasksForHabitsDueThisWeek = filterInboxTasksForDisplay(
    sortedInboxTasks,
    habitTasks.habitEntriesByRefId,
    habitTasks.optimisticUpdates,
    {
      allowSources: [InboxTaskNamespace.HABIT],
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

  const habitsStack = (
    <>
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
        optimisticUpdates={habitTasks.optimisticUpdates}
        moreInfoByRefId={habitTasks.habitEntriesByRefId}
        onCardMarkDone={habitTasks.onCardMarkDone}
        onCardMarkNotDone={habitTasks.onCardMarkNotDone}
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
        optimisticUpdates={habitTasks.optimisticUpdates}
        moreInfoByRefId={habitTasks.habitEntriesByRefId}
        onCardMarkDone={habitTasks.onCardMarkDone}
        onCardMarkNotDone={habitTasks.onCardMarkNotDone}
      />
    </>
  );

  if (
    inboxTasksForHabitsDueToday.length === 0 &&
    inboxTasksForHabitsDueThisWeek.length === 0
  ) {
    return (
      <InboxTasksNoTasksCard
        parent="habit"
        parentLabel="New Habit"
        parentNewLocations="/app/workspace/habits/new"
      />
    );
  }

  return habitsStack;
}
