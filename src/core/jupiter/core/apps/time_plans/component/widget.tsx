import {
  InboxTask,
  TimePlan,
  TimePlanActivityDoneness,
  TimePlanActivity,
  Project,
  Habit,
  Chore,
  TodoTask,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  DocsHelpSubject,
} from "@jupiter/webapi-client";
import { Stack } from "@mui/material";

import { parentActivitiesByTargetRefId } from "#/core/apps/time_plans/sub/activity/group-by-parent";
import { filterActivityByFeasabilityWithParents } from "#/core/apps/time_plans/sub/activity/root";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { TimePlanListMergedActivities } from "#/core/apps/time_plans/component/list-merged-activities";
import { WidgetProps } from "#/core/home/component/common";

export function TimePlanViewWidget(props: WidgetProps) {
  const timePlans = props.timePlans!;

  if (!timePlans?.timePlanForToday && !timePlans?.timePlanForWeek) {
    return (
      <EntityNoNothingCard
        title="You Have To Start Somewhere"
        message="There are no time plans to show. You can create a new time plan."
        newEntityLocations={`/app/workspace/apps/time-plans/new`}
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
          targetTodoTasks={timePlans.timePlanForToday.targetTodoTasks}
          targetHabits={timePlans.timePlanForToday.targetHabits}
          targetChores={timePlans.timePlanForToday.targetChores}
          activityDoneness={timePlans.timePlanForToday.activityDoneness}
        />
      )}
      {timePlans.timePlanForWeek && (
        <SingleTimePlan
          timePlan={timePlans.timePlanForWeek.timePlan}
          activities={timePlans.timePlanForWeek.activities}
          targetInboxTasks={timePlans.timePlanForWeek.targetInboxTasks}
          targetProjects={timePlans.timePlanForWeek.targetProjects}
          targetTodoTasks={timePlans.timePlanForWeek.targetTodoTasks}
          targetHabits={timePlans.timePlanForWeek.targetHabits}
          targetChores={timePlans.timePlanForWeek.targetChores}
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
  targetTodoTasks: TodoTask[];
  targetHabits: Habit[];
  targetChores: Chore[];
  activityDoneness: Record<string, TimePlanActivityDoneness>;
}

function SingleTimePlan(props: SingleTimePlanProps) {
  const parentActivitiesByRefId = parentActivitiesByTargetRefId(
    props.activities,
  );
  const targetInboxTasksByRefId = new Map<string, InboxTask>(
    props.targetInboxTasks.map((it) => [it.ref_id, it]),
  );
  const targetProjectsByRefId = new Map<string, Project>(
    props.targetProjects.map((bp) => [bp.ref_id, bp]),
  );
  const targetTodoTasksByRefId = new Map<string, TodoTask>(
    props.targetTodoTasks.map((tt) => [tt.ref_id, tt]),
  );
  const targetHabitsByRefId = new Map<string, Habit>(
    props.targetHabits.map((h) => [h.ref_id, h]),
  );
  const targetChoresByRefId = new Map<string, Chore>(
    props.targetChores.map((c) => [c.ref_id, c]),
  );
  const mustDoActivities = filterActivityByFeasabilityWithParents(
    props.activities,
    parentActivitiesByRefId,
    targetInboxTasksByRefId,
    TimePlanActivityFeasability.MUST_DO,
  );
  const niceToHaveActivities = filterActivityByFeasabilityWithParents(
    props.activities,
    parentActivitiesByRefId,
    targetInboxTasksByRefId,
    TimePlanActivityFeasability.NICE_TO_HAVE,
  );
  const stretchActivities = filterActivityByFeasabilityWithParents(
    props.activities,
    parentActivitiesByRefId,
    targetInboxTasksByRefId,
    TimePlanActivityFeasability.STRETCH,
  );

  if (props.activities.length === 0) {
    return (
      <EntityNoNothingCard
        title="You Have To Start Somewhere"
        message="There are no activities to show. You can create a new activity."
        newEntityLocations={`/app/workspace/apps/time-plans/${props.timePlan.ref_id}/add-from-generated-inbox-tasks?showFromPeriod=${props.timePlan.period}`}
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
      targetTodoTasksByRefId={targetTodoTasksByRefId}
      targetHabitsByRefId={targetHabitsByRefId}
      targetChoresByRefId={targetChoresByRefId}
      activityDoneness={props.activityDoneness}
      timeEventsByRefId={new Map()}
      selectedKinds={Object.values(TimePlanActivityKind)}
      selectedFeasabilities={Object.values(TimePlanActivityFeasability)}
      selectedDoneness={[true, false]}
    />
  );
}
