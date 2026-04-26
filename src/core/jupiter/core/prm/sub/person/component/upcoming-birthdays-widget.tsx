import { InboxTaskStatus } from "@jupiter/webapi-client";

import { aDateToDate } from "#/core/common/adate";
import { PERSON_OCCASION } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
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
      allowSources: [PERSON_OCCASION],
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
