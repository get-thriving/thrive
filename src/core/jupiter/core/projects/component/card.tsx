import type {
  ADate,
  Project,
  ProjectMilestone,
  ProjectStats,
  ProjectStatus,
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
import { bigPlanDonePct, type ProjectParent } from "#/core/projects/root";
import { isCompleted } from "#/core/projects/status";
import { ClientOnly } from "#/core/infra/component/client-only";
import { ServicePropertiesContext } from "#/core/config-client";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { ADateTag } from "#/core/common/component/adate-tag";
import { ProjectStatusTag } from "#/core/projects/component/status-tag";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { AspectTag } from "#/core/life_plan/sub/aspects/component/tag";
import { DifficultyTag } from "#/core/common/component/difficulty-tag";
import { EisenTag } from "#/core/common/component/eisen-tag";
import { ProjectDonePctTag } from "#/core/projects/component/done-pct-tag";
import { IsKeyTag } from "#/core/common/component/is-key-tag";
import { ProjectMilestonesLeftTag } from "#/core/projects/sub/milestones/component/left-tag";
import { GoalTag } from "#/core/life_plan/sub/goals/components/tag";
import { ChapterTag } from "#/core/life_plan/sub/chapters/components/tag";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "#/core/common/sub/contacts/component/contact-tag";

export interface ProjectShowOptions {
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

export interface ProjectCardProps {
  topLevelInfo: TopLevelInfo;
  compact?: boolean;
  allowSwipe?: boolean;
  allowSelect?: boolean;
  selected?: boolean;
  showOptions: ProjectShowOptions;
  bigPlan: Project;
  bigPlanStats?: ProjectStats;
  bigPlanMilestones?: ProjectMilestone[];
  parent?: ProjectParent;
  onClick?: (it: Project) => void;
  onMarkDone?: (it: Project) => void;
  onMarkNotDone?: (it: Project) => void;
}

export function ProjectCard(props: ProjectCardProps) {
  const milestonesLeft =
    props.bigPlanMilestones?.filter(
      (m) => aDateToDate(m.date) > aDateToDate(props.topLevelInfo.today),
    ).length ?? 0;

  return (
    <EntityCard
      entityId={`project-${props.bigPlan.ref_id}`}
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
        to={`/app/workspace/projects/${props.bigPlan.ref_id}`}
        block={props.onClick !== undefined}
      >
        <IsKeyTag isKey={props.bigPlan.is_key} />
        <EntityNameComponent
          compact={props.compact}
          name={props.bigPlan.name}
        />
        <Divider />
        {props.showOptions.showDonePct && props.bigPlanStats && (
          <ProjectDonePctTag
            donePct={bigPlanDonePct(props.bigPlan, props.bigPlanStats)}
          />
        )}
        {props.showOptions.showMilestonesLeft &&
          props.bigPlanMilestones &&
          props.bigPlanMilestones.length > 0 && (
            <ProjectMilestonesLeftTag milestonesLeft={milestonesLeft} />
          )}
        {props.showOptions.showStatus && (
          <ProjectStatusTag status={props.bigPlan.status} />
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
  status: ProjectStatus;
  dueDate?: ADate | null;
}

function OverdueWarning({ today, status, dueDate }: OverdueWarningProps) {
  const serviceProperties = useContext(ServicePropertiesContext);

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
          theToday.minus({ days: serviceProperties.overdueDangerDays })
        ) {
          return <OverdueWarningChip label="Overdue" color="error" />;
        } else if (
          theDueDate <=
          theToday.minus({ days: serviceProperties.overdueWarningDays })
        ) {
          return <OverdueWarningChip label="Overdue" color="warning" />;
        } else if (
          theDueDate <=
          theToday.minus({ days: serviceProperties.overdueInfoDays })
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
