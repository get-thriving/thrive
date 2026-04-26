import {
  BigPlan,
  InboxTask,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  BigPlanStatus,
  InboxTaskStatus,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { Typography } from "@mui/material";

import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { BigPlanStatusTag } from "#/core/big_plans/component/status-tag";
import { InboxTaskStatusTag } from "#/core/common/sub/inbox_tasks/component/status-tag";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { TimePlanActivityFeasabilityTag } from "#/core/time_plans/sub/activity/component/feasability-tag";
import { TimePlanActivityKindTag } from "#/core/time_plans/sub/activity/component/kind-tag";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { ADateTag } from "#/core/common/component/adate-tag";
import { TimePlanTag } from "#/core/time_plans/component/tag";
import { IsKeyTag } from "#/core/common/component/is-key-tag";
import { entityLinkRefIdFromWire } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityInboxTaskTarget,
} from "#/core/time_plans/sub/activity/target-wire";

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

  if (isTimePlanActivityInboxTaskTarget(props.activity.target)) {
    const inboxTask = props.inboxTasksByRefId.get(
      entityLinkRefIdFromWire(props.activity.target),
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
    isTimePlanActivityBigPlanTarget(props.activity.target) &&
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      WorkspaceFeature.BIG_PLANS,
    )
  ) {
    const bigPlan = props.bigPlansByRefId.get(
      entityLinkRefIdFromWire(props.activity.target),
    )!;
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
