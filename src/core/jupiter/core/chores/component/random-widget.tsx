import {
  InboxTaskSource,
  InboxTaskStatus,
  RecurringTaskPeriod,
} from "@jupiter/webapi-client";

import { aDateToDate } from "#/core/common/adate";
import { filterInboxTasksForDisplay } from "#/core/common/sub/inbox_tasks/root";
import { InboxTaskStack } from "#/core/common/sub/inbox_tasks/component/stack";
import {
  ActionableTime,
  actionableTimeToDateTime,
} from "#/core/infra/actionable-time";
import { InboxTasksNoTasksCard } from "#/core/common/sub/inbox_tasks/component/no-tasks-card";
import {
  getDeterministicRandomElement,
  WidgetProps,
} from "#/core/home/component/common";

export function ChoreRandomWidget(props: WidgetProps) {
  const choreTasks = props.choreTasks!;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const endOfTheMonth = today.endOf("month").endOf("day");
  const actionableTime = actionableTimeToDateTime(
    ActionableTime.ONE_WEEK,
    props.topLevelInfo.user.timezone,
  );

  // Get all chore tasks that are not done
  const allChoreTasks = filterInboxTasksForDisplay(
    choreTasks.choreInboxTasks,
    choreTasks.choreEntriesByRefId,
    choreTasks.optimisticUpdates,
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
      allowPeriodsIfChore: [
        RecurringTaskPeriod.DAILY,
        RecurringTaskPeriod.WEEKLY,
        RecurringTaskPeriod.MONTHLY,
      ],
    },
  );

  // If no tasks, show the no tasks card
  if (allChoreTasks.length === 0) {
    return (
      <InboxTasksNoTasksCard
        parent="chore"
        parentLabel="New Chore"
        parentNewLocations="/app/workspace/chores/new"
      />
    );
  }

  // Pick a random task
  const randomTask = getDeterministicRandomElement(
    allChoreTasks,
    props.topLevelInfo.today,
  );

  return (
    <>
      <InboxTaskStack
        key="random-chore"
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
        label="Do A Random Chore"
        inboxTasks={[randomTask]}
        optimisticUpdates={choreTasks.optimisticUpdates}
        moreInfoByRefId={choreTasks.choreEntriesByRefId}
        onCardMarkDone={choreTasks.onCardMarkDone}
        onCardMarkNotDone={choreTasks.onCardMarkNotDone}
      />
    </>
  );
}
