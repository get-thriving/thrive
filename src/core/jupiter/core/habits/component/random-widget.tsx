import {
  InboxTaskSource,
  InboxTaskStatus,
  RecurringTaskPeriod,
} from "@jupiter/webapi-client";

import { aDateToDate } from "#/core/common/adate";
import { filterInboxTasksForDisplay } from "#/core/inbox_tasks/root";
import { InboxTaskStack } from "#/core/inbox_tasks/component/stack";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "#/core/infra/actionable-time";
import { InboxTasksNoTasksCard } from "#/core/inbox_tasks/component/no-tasks-card";
import {
  getDeterministicRandomElement,
  WidgetProps,
} from "#/core/home/component/common";

export function HabitRandomWidget(props: WidgetProps) {
  const habitTasks = props.habitTasks!;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const endOfTheMonth = today.endOf("month").endOf("day");
  const actionableTime = actionableTimeToDateTime(
    ActionableTime.ONE_WEEK,
    props.topLevelInfo.user.timezone,
  );

  // Get all habit tasks that are not done
  const allHabitTasks = filterInboxTasksForDisplay(
    habitTasks.habitInboxTasks,
    habitTasks.habitEntriesByRefId,
    habitTasks.optimisticUpdates,
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
      allowPeriodsIfHabit: [
        RecurringTaskPeriod.DAILY,
        RecurringTaskPeriod.WEEKLY,
        RecurringTaskPeriod.MONTHLY,
      ],
    },
  );

  // If no tasks, show the no tasks card
  if (allHabitTasks.length === 0) {
    return (
      <InboxTasksNoTasksCard
        parent="habit"
        parentLabel="New Habit"
        parentNewLocations="/app/workspace/habits/new"
      />
    );
  }

  // Pick a random task
  const randomTask = getDeterministicRandomElement(
    allHabitTasks,
    props.topLevelInfo.today,
  );

  return (
    <InboxTaskStack
      key="random-habit"
      topLevelInfo={props.topLevelInfo}
      showOptions={{
        showStatus: true,
        showEisen: true,
        showDifficulty: true,
        showParent: true,
        showHandleMarkDone: true,
        showHandleMarkNotDone: true,
      }}
      label="Do A Random Habit"
      inboxTasks={[randomTask]}
      optimisticUpdates={habitTasks.optimisticUpdates}
      moreInfoByRefId={habitTasks.habitEntriesByRefId}
      onCardMarkDone={habitTasks.onCardMarkDone}
      onCardMarkNotDone={habitTasks.onCardMarkNotDone}
    />
  );
}
