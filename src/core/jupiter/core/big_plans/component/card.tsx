import type {
  ADate,
  BigPlan,
  BigPlanMilestone,
  BigPlanStats,
  BigPlanStatus,
  Chapter,
  Goal,
  Aspect,
  Tag,
} from "@jupiter/webapi-client";
import { WorkspaceFeature } from "@jupiter/webapi-client";
import type { ChipProps } from "@mui/material";
import { Chip, Divider, styled } from "@mui/material";
import { useContext } from "react";

import { aDateToDate } from "#/core/common/adate";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { bigPlanDonePct, type BigPlanParent } from "#/core/big_plans/root";
import { isCompleted } from "#/core/big_plans/status";
import { ClientOnly } from "#/core/infra/component/client-only";
import { OverdueThresholdsContext } from "#/core/infra/overdue-thresholds-context";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { ADateTag } from "#/core/common/component/adate-tag";
import { BigPlanStatusTag } from "#/core/big_plans/component/status-tag";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { AspectTag } from "#/core/life_plan/sub/aspects/component/tag";
import { DifficultyTag } from "#/core/common/component/difficulty-tag";
import { EisenTag } from "#/core/common/component/eisen-tag";
import { BigPlanDonePctTag } from "#/core/big_plans/component/done-pct-tag";
import { IsKeyTag } from "#/core/common/component/is-key-tag";
import { BigPlanMilestonesLeftTag } from "#/core/big_plans/sub/milestones/component/left-tag";
import { GoalTag } from "#/core/life_plan/sub/goals/components/tag";
import { ChapterTag } from "#/core/life_plan/sub/chapters/components/tag";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "#/core/common/sub/contacts/component/contact-tag";

export interface BigPlanShowOptions {
  showDonePct?: boolean;
  showMilestonesLeft?: boolean;
  showStatus?: boolean;
  showLifePlan?: boolean;
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
      <OverdueWarning
        today={props.topLevelInfo.today}
        status={props.bigPlan.status}
        dueDate={props.bigPlan.due_date}
      />
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
        {props.showOptions.showLifePlan &&
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          props.parent && <AspectTag aspect={props.parent.aspect as Aspect} />}
        {props.showOptions.showLifePlan &&
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          props.parent?.chapter && (
            <ChapterTag chapter={props.parent.chapter as Chapter} />
          )}

        {props.showOptions.showLifePlan &&
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          props.parent?.goal && <GoalTag goal={props.parent.goal as Goal} />}

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

        {props.parent?.tags?.map((tag: Tag) => (
          <TagTag key={tag.ref_id} tag={tag} />
        ))}
        {props.parent?.contacts?.map((contact) => (
          <ContactTag key={contact.ref_id} contact={contact} />
        ))}
      </EntityLink>
    </EntityCard>
  );
}

interface OverdueWarningProps {
  today: ADate;
  status: BigPlanStatus;
  dueDate?: ADate | null;
}

function OverdueWarning({ today, status, dueDate }: OverdueWarningProps) {
  const overdueThresholds = useContext(OverdueThresholdsContext);

  if (isCompleted(status)) {
    return null;
  }

  if (!dueDate) {
    return null;
  }

  const theToday = aDateToDate(today);
  const theDueDate = aDateToDate(dueDate);

  return (
    <ClientOnly fallback={<></>}>
      {() => {
        if (
          theDueDate <=
          theToday.minus({ days: overdueThresholds.overdueDangerDays })
        ) {
          return <OverdueWarningChip label="Overdue" color="error" />;
        } else if (
          theDueDate <=
          theToday.minus({ days: overdueThresholds.overdueWarningDays })
        ) {
          return <OverdueWarningChip label="Overdue" color="warning" />;
        } else if (
          theDueDate <=
          theToday.minus({ days: overdueThresholds.overdueInfoDays })
        ) {
          return <OverdueWarningChip label="Overdue" color="info" />;
        }
        return null;
      }}
    </ClientOnly>
  );
}

const OverdueWarningChip = styled(Chip)<ChipProps>(() => ({
  position: "absolute",
  top: "0px",
  fontSize: "0.75rem",
  height: "1rem",
  left: "0px",
  paddingTop: "0.05rem",
  paddingBottom: "0.05rem",
  paddingRight: "0.5rem",
  paddingLeft: "0.5rem",
  borderRadius: "0px",
  borderBottomRightRadius: "4px",
}));
