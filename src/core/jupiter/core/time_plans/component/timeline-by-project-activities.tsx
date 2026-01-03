import { Fragment, useContext } from "react";
import type {
  BigPlan,
  InboxTask,
  ProjectSummary,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { TimePlanActivityTarget } from "@jupiter/webapi-client";

import { computeProjectHierarchicalNameFromRoot } from "#/core/life_plan/sub/aspects/root";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TimePlanTimelineActivityBars } from "#/core/time_plans/sub/activity/component/timeline";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

interface TimePlanTimelineByProjectActivitiesProps {
  timePlan: TimePlan;
  mustDoActivities: TimePlanActivity[];
  otherActivities: TimePlanActivity[];
  targetInboxTasksByRefId: Map<string, InboxTask>;
  targetBigPlansByRefId: Map<string, BigPlan>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  timeEventsByRefId: Map<string, TimeEventInDayBlock[]>;
  selectedKinds: TimePlanActivityKind[];
  selectedFeasabilities: TimePlanActivityFeasability[];
  selectedDoneness: boolean[];
  projects: ProjectSummary[];
  projectsByRefId: Map<string, ProjectSummary>;
}

export function TimePlanTimelineByProjectActivities(
  props: TimePlanTimelineByProjectActivitiesProps,
) {
  const topLevelInfo = useContext(TopLevelInfoContext);

  return (
    <>
      {props.mustDoActivities.length > 0 && (
        <>
          <StandardDivider title="Must Do" size="large" />
          <TimePlanTimelineActivityBars
            timePlan={props.timePlan}
            activities={props.mustDoActivities}
            topLevelToday={topLevelInfo.today}
            inboxTasksByRefId={props.targetInboxTasksByRefId}
            bigPlansByRefId={props.targetBigPlansByRefId}
            activityDoneness={props.activityDoneness}
            timeEventsByRefId={props.timeEventsByRefId}
            filterKind={props.selectedKinds}
            filterFeasability={props.selectedFeasabilities}
            filterDoneness={props.selectedDoneness}
          />
        </>
      )}

      {props.projects.map((project) => {
        const projectActivities = props.otherActivities.filter((activity) => {
          switch (activity.target) {
            case TimePlanActivityTarget.INBOX_TASK:
              return (
                props.targetInboxTasksByRefId.get(activity.target_ref_id)
                  ?.project_ref_id === project.ref_id
              );
            case TimePlanActivityTarget.BIG_PLAN:
              return (
                props.targetBigPlansByRefId.get(activity.target_ref_id)
                  ?.project_ref_id === project.ref_id
              );
          }
        });

        if (projectActivities.length === 0) {
          return null;
        }

        const fullProjectName = computeProjectHierarchicalNameFromRoot(
          project,
          props.projectsByRefId,
        );

        return (
          <Fragment key={`project-${project.ref_id}`}>
            <StandardDivider title={fullProjectName} size="large" />
            <TimePlanTimelineActivityBars
              timePlan={props.timePlan}
              activities={projectActivities}
              topLevelToday={topLevelInfo.today}
              inboxTasksByRefId={props.targetInboxTasksByRefId}
              bigPlansByRefId={props.targetBigPlansByRefId}
              activityDoneness={props.activityDoneness}
              timeEventsByRefId={props.timeEventsByRefId}
              filterKind={props.selectedKinds}
              filterFeasability={props.selectedFeasabilities}
              filterDoneness={props.selectedDoneness}
            />
          </Fragment>
        );
      })}
    </>
  );
}
