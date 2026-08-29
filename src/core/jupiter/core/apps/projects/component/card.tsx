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
import { Divider } from "@mui/material";
import { useContext } from "react";

import { aDateToDate } from "#/core/common/adate";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { projectDonePct, type ProjectParent } from "#/core/apps/projects/root";
import { isCompleted } from "#/core/apps/projects/status";
import { ClientOnly } from "#/core/infra/component/client-only";
import { CardCornerChipStack, CornerChip } from "#/core/infra/component/chips";
import { OverdueThresholdsContext } from "#/core/infra/overdue-thresholds-context";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { ADateTag } from "#/core/common/component/adate-tag";
import { ProjectStatusTag } from "#/core/apps/projects/component/status-tag";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import {
  EntityCard,
  EntityFakeLink,
  EntityLink,
} from "#/core/infra/component/entity-card";
import { AspectTag } from "#/core/apps/life_plan/sub/aspects/component/tag";
import { DifficultyTag } from "#/core/common/component/difficulty-tag";
import { EisenTag } from "#/core/common/component/eisen-tag";
import { ProjectDonePctTag } from "#/core/apps/projects/component/done-pct-tag";
import { IsKeyTag } from "#/core/common/component/is-key-tag";
import { ProjectMilestonesLeftTag } from "#/core/apps/projects/sub/milestones/component/left-tag";
import { GoalTag } from "#/core/apps/life_plan/sub/goals/components/tag";
import { ChapterTag } from "#/core/apps/life_plan/sub/chapters/components/tag";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "#/core/common/sub/contacts/component/contact-tag";
import { UserLightChip } from "#/core/users/components/user-light-chip";

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
  indent?: number;
  linksEnabled?: boolean;
  showOptions: ProjectShowOptions;
  project: Project;
  projectStats?: ProjectStats;
  projectMilestones?: ProjectMilestone[];
  parent?: ProjectParent;
  onClick?: (it: Project) => void;
  onMarkDone?: (it: Project) => void;
  onMarkNotDone?: (it: Project) => void;
}

export function ProjectCard(props: ProjectCardProps) {
  const milestonesLeft =
    props.projectMilestones?.filter(
      (m) => aDateToDate(m.date) > aDateToDate(props.topLevelInfo.today),
    ).length ?? 0;
  const linksEnabled = props.linksEnabled ?? true;

  const content = (
    <>
      <IsKeyTag isKey={props.project.is_key} />
      <EntityNameComponent compact={props.compact} name={props.project.name} />
      <Divider />
      {props.showOptions.showDonePct && props.projectStats && (
        <ProjectDonePctTag
          donePct={projectDonePct(props.project, props.projectStats)}
        />
      )}
      {props.showOptions.showMilestonesLeft &&
        props.projectMilestones &&
        props.projectMilestones.length > 0 && (
          <ProjectMilestonesLeftTag milestonesLeft={milestonesLeft} />
        )}
      {props.showOptions.showStatus && (
        <ProjectStatusTag status={props.project.status} />
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

      {props.showOptions.showEisen && <EisenTag eisen={props.project.eisen} />}
      {props.showOptions.showDifficulty && (
        <DifficultyTag difficulty={props.project.difficulty} />
      )}

      {props.showOptions.showActionableDate &&
        props.project.actionable_date && (
          <ADateTag
            label="Actionable Date"
            date={props.project.actionable_date}
          />
        )}
      {props.showOptions.showDueDate && props.project.due_date && (
        <ADateTag label="Due Date" date={props.project.due_date} />
      )}

      {props.parent?.tags?.map((tag: Tag) => (
        <TagTag key={tag.ref_id} tag={tag} />
      ))}
      {props.parent?.contacts?.map((contact) => (
        <ContactTag key={contact.ref_id} contact={contact} />
      ))}
    </>
  );

  return (
    <EntityCard
      entityId={`project-${props.project.ref_id}`}
      allowSwipe={props.allowSwipe}
      allowSelect={props.allowSelect}
      selected={props.selected}
      indent={props.indent}
      allowMarkDone={props.showOptions.showHandleMarkDone}
      allowMarkNotDone={props.showOptions.showHandleMarkNotDone}
      onClick={
        props.onClick
          ? () => props.onClick && props.onClick(props.project)
          : undefined
      }
      markButtonsStyle="column"
      onMarkDone={
        props.onMarkDone
          ? () => props.onMarkDone && props.onMarkDone(props.project)
          : undefined
      }
      onMarkNotDone={
        props.onMarkNotDone
          ? () => props.onMarkNotDone && props.onMarkNotDone(props.project)
          : undefined
      }
    >
      {props.parent?.owner && (
        <UserLightChip
          user={props.parent.owner}
          currentUserRefId={props.topLevelInfo.user.ref_id}
        />
      )}
      <CardCornerChipStack>
        <OverdueWarning
          today={props.topLevelInfo.today}
          status={props.project.status}
          dueDate={props.project.due_date}
        />
      </CardCornerChipStack>
      {linksEnabled ? (
        <EntityLink
          to={`/app/workspace/apps/projects/${props.project.ref_id}`}
          block={props.onClick !== undefined}
        >
          {content}
        </EntityLink>
      ) : (
        <EntityFakeLink>{content}</EntityFakeLink>
      )}
    </EntityCard>
  );
}

interface OverdueWarningProps {
  today: ADate;
  status: ProjectStatus;
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
          return <CornerChip label="Overdue" color="error" />;
        } else if (
          theDueDate <=
          theToday.minus({ days: overdueThresholds.overdueWarningDays })
        ) {
          return <CornerChip label="Overdue" color="warning" />;
        } else if (
          theDueDate <=
          theToday.minus({ days: overdueThresholds.overdueInfoDays })
        ) {
          return <CornerChip label="Overdue" color="info" />;
        }
        return null;
      }}
    </ClientOnly>
  );
}
