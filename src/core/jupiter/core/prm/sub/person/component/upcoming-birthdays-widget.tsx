import { InboxTaskSource, InboxTaskStatus } from "@jupiter/webapi-client";

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

export function UpcomingBirthdaysWidget(props: WidgetProps) {
  const personTasks = props.personTasks!;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const threeMonthsFromNow = today.plus({ months: 3 }).endOf("day");
  const actionableTime = actionableTimeToDateTime(
    ActionableTime.ONE_WEEK,
    props.topLevelInfo.user.timezone,
  );

  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(
    personTasks.personInboxTasks,
  );

  const upcomingBirthdays = filterInboxTasksForDisplay(
    sortedInboxTasks,
    personTasks.personEntriesByRefId,
    personTasks.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.PERSON_OCCASION],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: threeMonthsFromNow,
    },
  );

  if (upcomingBirthdays.length === 0) {
    return (
      <InboxTasksNoTasksCard
        parent="person"
        parentLabel="New Person"
        parentNewLocations="/app/workspace/prm/persons/new"
      />
    );
  }

  return (
    <InboxTaskStack
      key="upcoming-birthdays"
      topLevelInfo={props.topLevelInfo}
      showOptions={{
        showStatus: true,
        showDueDate: true,
        showHandleMarkDone: true,
        showHandleMarkNotDone: true,
      }}
      label="Upcoming Birthdays"
      inboxTasks={upcomingBirthdays}
      optimisticUpdates={personTasks.optimisticUpdates}
      moreInfoByRefId={personTasks.personEntriesByRefId}
      onCardMarkDone={personTasks.onCardMarkDone}
      onCardMarkNotDone={personTasks.onCardMarkNotDone}
    />
  );
}
