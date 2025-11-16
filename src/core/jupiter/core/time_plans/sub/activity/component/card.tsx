import {
  BigPlan,
  InboxTask,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  BigPlanStatus,
  InboxTaskStatus,
  TimePlanActivityTarget,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import { isWorkspaceFeatureAvailable } from "~/workspaces/root";

import { BigPlanStatusTag } from "~/big_plans/component/status-tag";
import { InboxTaskStatusTag } from "~/inbox_tasks/component/status-tag";
import { EntityCard, EntityLink } from "~/infra/component/entity-card";
import { TimePlanActivityFeasabilityTag } from "~/time_plans/sub/activity/component/feasability-tag";
import { TimePlanActivityKindTag } from "~/time_plans/sub/activity/component/kind-tag";
import type { TopLevelInfo } from "~/infra/top-level-context";
import { ADateTag } from "~/common/component/adate-tag";
import { TimePlanTag } from "~/time_plans/component/tag";
import { IsKeyTag } from "~/common/component/is-key-tag";

interface TimePlanActivityCardProps {
  topLevelInfo: TopLevelInfo;
  activity: TimePlanActivity;
  timePlansByRefId: Map<string, TimePlan>;
  inboxTasksByRefId: Map<string, InboxTask>;
  bigPlansByRefId: Map<string, BigPlan>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  timeEventsByRefId: Map<string, Array<TimeEventInDayBlock>>;
  fullInfo: boolean;
  showTimePlanName?: boolean;
  allowSelect?: boolean;
  selected?: boolean;
  indent?: number;
  onClick?: (activity: TimePlanActivity) => void;
}

export function TimePlanActivityCard(props: TimePlanActivityCardProps) {
  const timePlan = props.timePlansByRefId.get(
    props.activity.time_plan_ref_id.toString(),
  );

  if (props.activity.target === TimePlanActivityTarget.INBOX_TASK) {
    const inboxTask = props.inboxTasksByRefId.get(
      props.activity.target_ref_id,
    )!;
    const timeEvents =
      props.timeEventsByRefId.get(`it:${inboxTask.ref_id}`) ?? [];

    return (
      <EntityCard
        entityId={`time-plan-activity-${props.activity.ref_id}`}
        showAsArchived={props.activity.archived}
        allowSelect={props.allowSelect}
        selected={props.selected}
        indent={props.indent}
        onClick={
          props.onClick
            ? () => props.onClick && props.onClick(props.activity)
            : undefined
        }
        backgroundHint={
          props.activityDoneness[props.activity.ref_id] ===
          TimePlanActivityDoneness.DONE
            ? inboxTask?.status === InboxTaskStatus.NOT_DONE
              ? "failure"
              : "success"
            : props.activityDoneness[props.activity.ref_id] ===
                TimePlanActivityDoneness.WORKING
              ? "warning"
              : "neutral"
        }
      >
        <EntityLink
          to={`/app/workspace/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`}
          block={props.onClick !== undefined}
        >
          <IsKeyTag isKey={inboxTask.is_key} />
          <Typography
            sx={{
              fontWeight: inboxTask
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter",
            }}
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : inboxTask
                ? inboxTask.name
                : "Archived Task"}
          </Typography>
          {props.fullInfo && (
            <>
              {inboxTask && <InboxTaskStatusTag status={inboxTask.status} />}
              {inboxTask?.due_date && (
                <ADateTag label="Due At" date={inboxTask.due_date} />
              )}

              {timeEvents.length > 0 && (
                <>
                  📅 {timeEvents.length} scheduled event
                  {timeEvents.length > 1 ? "s" : ""}
                </>
              )}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          <TimePlanActivityFeasabilityTag
            feasability={props.activity.feasability}
          />

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </EntityLink>
      </EntityCard>
    );
  } else if (
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      WorkspaceFeature.BIG_PLANS,
    )
  ) {
    const bigPlan = props.bigPlansByRefId.get(props.activity.target_ref_id)!;
    const timeEvents =
      props.timeEventsByRefId.get(`bp:${bigPlan.ref_id}`) ?? [];
    return (
      <EntityCard
        entityId={`time-plan-activity-${props.activity.ref_id}`}
        allowSelect={props.allowSelect}
        selected={props.selected}
        onClick={
          props.onClick
            ? () => props.onClick && props.onClick(props.activity)
            : undefined
        }
        backgroundHint={
          props.activityDoneness[props.activity.ref_id] ===
          TimePlanActivityDoneness.DONE
            ? bigPlan?.status === BigPlanStatus.NOT_DONE
              ? "failure"
              : "success"
            : props.activityDoneness[props.activity.ref_id] ===
                TimePlanActivityDoneness.WORKING
              ? "warning"
              : "neutral"
        }
      >
        <EntityLink
          to={`/app/workspace/time-plans/${props.activity.time_plan_ref_id}/${props.activity.ref_id}`}
          block={props.onClick !== undefined}
        >
          <IsKeyTag isKey={bigPlan.is_key} />
          <Typography
            sx={{
              fontWeight: bigPlan
                ? props.activityDoneness[props.activity.ref_id] ===
                  TimePlanActivityDoneness.DONE
                  ? "bold"
                  : "normal"
                : "lighter",
            }}
          >
            {props.showTimePlanName && timePlan
              ? timePlan.name
              : bigPlan
                ? bigPlan.name
                : "Archived Big Plan"}
          </Typography>

          {props.fullInfo && (
            <>
              {bigPlan && <BigPlanStatusTag status={bigPlan.status} />}
              {bigPlan?.due_date && (
                <ADateTag label="Due At" date={bigPlan.due_date} />
              )}

              {timeEvents.length > 0 && (
                <>
                  📅 {timeEvents.length} scheduled event
                  {timeEvents.length > 1 ? "s" : ""}
                </>
              )}
            </>
          )}

          <TimePlanActivityKindTag kind={props.activity.kind} />
          <TimePlanActivityFeasabilityTag
            feasability={props.activity.feasability}
          />

          {timePlan && <TimePlanTag timePlan={timePlan} />}
        </EntityLink>
      </EntityCard>
    );
  } else {
    return <></>;
  }
}
