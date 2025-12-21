import type {
  BigPlan,
  BigPlanMilestone,
  BigPlanStats,
  Project,
} from "@jupiter/webapi-client";
import { WorkspaceFeature } from "@jupiter/webapi-client";
import { Divider } from "@mui/material";

import { aDateToDate } from "#/core/common/adate";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { bigPlanDonePct, type BigPlanParent } from "#/core/big_plans/root";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { ADateTag } from "#/core/common/component/adate-tag";
import { BigPlanStatusTag } from "#/core/big_plans/component/status-tag";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { ProjectTag } from "#/core/life_plan/sub/aspects/component/tag";
import { DifficultyTag } from "#/core/common/component/difficulty-tag";
import { EisenTag } from "#/core/common/component/eisen-tag";
import { BigPlanDonePctTag } from "#/core/big_plans/component/done-pct-tag";
import { IsKeyTag } from "#/core/common/component/is-key-tag";
import { BigPlanMilestonesLeftTag } from "#/core/big_plans/sub/milestones/component/left-tag";

export interface BigPlanShowOptions {
  showDonePct?: boolean;
  showMilestonesLeft?: boolean;
  showStatus?: boolean;
  showProject?: boolean;
  showEisen?: boolean;
  showDifficulty?: boolean;
  showActionableDate?: boolean;
  showDueDate?: boolean;
  showHandleMarkDone?: boolean;
  showHandleMarkNotDone?: boolean;
}

export interface BigPlanCardProps {
  topLevelInfo: TopLevelInfo;
  compact?: boolean;
  allowSwipe?: boolean;
  allowSelect?: boolean;
  selected?: boolean;
  showOptions: BigPlanShowOptions;
  bigPlan: BigPlan;
  bigPlanStats?: BigPlanStats;
  bigPlanMilestones?: BigPlanMilestone[];
  parent?: BigPlanParent;
  onClick?: (it: BigPlan) => void;
  onMarkDone?: (it: BigPlan) => void;
  onMarkNotDone?: (it: BigPlan) => void;
}

export function BigPlanCard(props: BigPlanCardProps) {
  const milestonesLeft =
    props.bigPlanMilestones?.filter(
      (m) => aDateToDate(m.date) > aDateToDate(props.topLevelInfo.today),
    ).length ?? 0;

  return (
    <EntityCard
      entityId={`big-plan-${props.bigPlan.ref_id}`}
      allowSwipe={props.allowSwipe}
      allowSelect={props.allowSelect}
      selected={props.selected}
      allowMarkDone={props.showOptions.showHandleMarkDone}
      allowMarkNotDone={props.showOptions.showHandleMarkNotDone}
      onClick={
        props.onClick
          ? () => props.onClick && props.onClick(props.bigPlan)
          : undefined
      }
      markButtonsStyle="column"
      onMarkDone={
        props.onMarkDone
          ? () => props.onMarkDone && props.onMarkDone(props.bigPlan)
          : undefined
      }
      onMarkNotDone={
        props.onMarkNotDone
          ? () => props.onMarkNotDone && props.onMarkNotDone(props.bigPlan)
          : undefined
      }
    >
      <EntityLink
        to={`/app/workspace/big-plans/${props.bigPlan.ref_id}`}
        block={props.onClick !== undefined}
      >
        <IsKeyTag isKey={props.bigPlan.is_key} />
        <EntityNameComponent
          compact={props.compact}
          name={props.bigPlan.name}
        />
        <Divider />
        {props.showOptions.showDonePct && props.bigPlanStats && (
          <BigPlanDonePctTag
            donePct={bigPlanDonePct(props.bigPlan, props.bigPlanStats)}
          />
        )}
        {props.showOptions.showMilestonesLeft &&
          props.bigPlanMilestones &&
          props.bigPlanMilestones.length > 0 && (
            <BigPlanMilestonesLeftTag milestonesLeft={milestonesLeft} />
          )}
        {props.showOptions.showStatus && (
          <BigPlanStatusTag status={props.bigPlan.status} />
        )}
        {props.showOptions.showProject &&
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          props.parent && (
            <ProjectTag project={props.parent.project as Project} />
          )}

        {props.showOptions.showEisen && (
          <EisenTag eisen={props.bigPlan.eisen} />
        )}
        {props.showOptions.showDifficulty && (
          <DifficultyTag difficulty={props.bigPlan.difficulty} />
        )}

        {props.showOptions.showActionableDate &&
          props.bigPlan.actionable_date && (
            <ADateTag
              label="Actionable Date"
              date={props.bigPlan.actionable_date}
            />
          )}
        {props.showOptions.showDueDate && props.bigPlan.due_date && (
          <ADateTag label="Due Date" date={props.bigPlan.due_date} />
        )}
      </EntityLink>
    </EntityCard>
  );
}
