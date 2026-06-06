import {
  InboxTask,
  TimePlan,
  TimePlanActivityDoneness,
  TimePlanActivity,
  Project,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  DocsHelpSubject,
} from "@jupiter/webapi-client";
import { Stack } from "@mui/material";

import { entityLinkRefIdFromWire } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { filterActivityByFeasabilityWithParents } from "#/core/time_plans/sub/activity/root";
import { isTimePlanActivityProjectTarget } from "#/core/time_plans/sub/activity/target-wire";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { TimePlanListMergedActivities } from "#/core/time_plans/component/list-merged-activities";
import { WidgetProps } from "#/core/home/component/common";

export function TimePlanViewWidget(props: WidgetProps) {
  const timePlans = props.timePlans!;

  if (!timePlans?.timePlanForToday && !timePlans?.timePlanForWeek) {
    return (
      <EntityNoNothingCard
        title="You Have To Start Somewhere"
        message="There are no time plans to show. You can create a new time plan."
        newEntityLocations={`/app/workspace/time-plans/new`}
        helpSubject={DocsHelpSubject.TIME_PLANS}
      />
    );
  }

  return (
    <Stack>
      {timePlans.timePlanForToday && (
        <SingleTimePlan
          timePlan={timePlans.timePlanForToday.timePlan}
          activities={timePlans.timePlanForToday.activities}
          targetInboxTasks={timePlans.timePlanForToday.targetInboxTasks}
          targetProjects={timePlans.timePlanForToday.targetProjects}
          activityDoneness={timePlans.timePlanForToday.activityDoneness}
        />
      )}
      {timePlans.timePlanForWeek && (
        <SingleTimePlan
          timePlan={timePlans.timePlanForWeek.timePlan}
          activities={timePlans.timePlanForWeek.activities}
          targetInboxTasks={timePlans.timePlanForWeek.targetInboxTasks}
          targetProjects={timePlans.timePlanForWeek.targetProjects}
          activityDoneness={timePlans.timePlanForWeek.activityDoneness}
        />
      )}
    </Stack>
  );
}

interface SingleTimePlanProps {
  timePlan: TimePlan;
  activities: TimePlanActivity[];
  targetInboxTasks: InboxTask[];
  targetProjects: Project[];
  activityDoneness: Record<string, TimePlanActivityDoneness>;
}

function SingleTimePlan(props: SingleTimePlanProps) {
  const actitiviesByProjectRefId = new Map<string, TimePlanActivity>(
    props.activities
      .filter((a) => isTimePlanActivityProjectTarget(a.target))
      .map((a) => [entityLinkRefIdFromWire(a.target), a]),
  );
  const targetInboxTasksByRefId = new Map<string, InboxTask>(
    props.targetInboxTasks.map((it) => [it.ref_id, it]),
  );
  const targetProjectsByRefId = new Map<string, Project>(
    props.targetProjects.map((bp) => [bp.ref_id, bp]),
  );
  const mustDoActivities = filterActivityByFeasabilityWithParents(
    props.activities,
    actitiviesByProjectRefId,
    targetInboxTasksByRefId,
    targetProjectsByRefId,
    TimePlanActivityFeasability.MUST_DO,
  );
  const niceToHaveActivities = filterActivityByFeasabilityWithParents(
    props.activities,
    actitiviesByProjectRefId,
    targetInboxTasksByRefId,
    targetProjectsByRefId,
    TimePlanActivityFeasability.NICE_TO_HAVE,
  );
  const stretchActivities = filterActivityByFeasabilityWithParents(
    props.activities,
    actitiviesByProjectRefId,
    targetInboxTasksByRefId,
    targetProjectsByRefId,
    TimePlanActivityFeasability.STRETCH,
  );

  if (props.activities.length === 0) {
    return (
      <EntityNoNothingCard
        title="You Have To Start Somewhere"
        message="There are no activities to show. You can create a new activity."
        newEntityLocations={`/app/workspace/time-plans/${props.timePlan.ref_id}/add-from-current-inbox-tasks`}
        helpSubject={DocsHelpSubject.TIME_PLANS}
      />
    );
  }

  return (
    <TimePlanListMergedActivities
      mustDoActivities={mustDoActivities}
      niceToHaveActivities={niceToHaveActivities}
      stretchActivities={stretchActivities}
      targetInboxTasksByRefId={targetInboxTasksByRefId}
      targetProjectsByRefId={targetProjectsByRefId}
      activityDoneness={props.activityDoneness}
      timeEventsByRefId={new Map()}
      selectedKinds={Object.values(TimePlanActivityKind)}
      selectedFeasabilities={Object.values(TimePlanActivityFeasability)}
      selectedDoneness={[true, false]}
    />
  );
}
