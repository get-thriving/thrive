import { InboxTaskSource, InboxTaskStatus } from "@jupiter/webapi-client";

import { aDateToDate } from "#/core/common/adate";
import {
  filterInboxTasksForDisplay,
  sortInboxTasksByEisenAndDifficulty,
} from "#/core/inbox_tasks/root";
import { InboxTaskStack } from "#/core/inbox_tasks/component/stack";
import { InboxTasksNoTasksCard } from "#/core/inbox_tasks/component/no-tasks-card";
import { WidgetProps } from "#/core/home/component/common";

export function UpcomingCatchUpsWidget(props: WidgetProps) {
  const personTasks = props.personTasks!;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const oneMonthFromNow = today.plus({ months: 1 }).endOf("day");

  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(
    personTasks.personInboxTasks,
  );

  const upcomingCatchUps = filterInboxTasksForDisplay(
    sortedInboxTasks,
    personTasks.personEntriesByRefId,
    personTasks.optimisticUpdates,
    {
      allowSources: [InboxTaskSource.PERSON_CATCH_UP],
      allowStatuses: [
        InboxTaskStatus.NOT_STARTED,
        InboxTaskStatus.NOT_STARTED_GEN,
        InboxTaskStatus.IN_PROGRESS,
        InboxTaskStatus.BLOCKED,
      ],
      includeIfNoActionableDate: true,
      dueDateEnd: oneMonthFromNow,
    },
  );

  if (upcomingCatchUps.length === 0) {
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
      key="upcoming-catch-ups"
      topLevelInfo={props.topLevelInfo}
      showOptions={{
        showStatus: true,
        showDueDate: true,
        showHandleMarkDone: true,
        showHandleMarkNotDone: true,
      }}
      label="Upcoming Catch Ups"
      inboxTasks={upcomingCatchUps}
      optimisticUpdates={personTasks.optimisticUpdates}
      moreInfoByRefId={personTasks.personEntriesByRefId}
      onCardMarkDone={personTasks.onCardMarkDone}
      onCardMarkNotDone={personTasks.onCardMarkNotDone}
    />
  );
}
