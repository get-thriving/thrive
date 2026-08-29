import {
  ProjectMilestone,
  ProjectStats,
  DocsHelpSubject,
} from "@jupiter/webapi-client";

import { sortProjectsNaturally } from "#/core/apps/projects/root";
import { WidgetProps } from "#/core/home/component/common";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { ProjectStack } from "#/core/apps/projects/component/stack";

export function KeyProjectsProgressWidget(props: WidgetProps) {
  const keyProjects = props.keyProjects!;
  const sortedProjects = sortProjectsNaturally(
    keyProjects.projects.map((bp) => bp.project),
  );
  const projectMilestonesByRefId: Map<string, ProjectMilestone[]> = new Map(
    keyProjects.projects.map((bp) => [bp.project.ref_id, bp.milestones]),
  );
  const projectStatsByRefId: Map<string, ProjectStats> = new Map(
    keyProjects.projects.map((bp) => [bp.project.ref_id, bp.stats]),
  );

  if (sortedProjects.length === 0) {
    return (
      <EntityNoNothingCard
        title="No key projects found"
        message="Mark some projects as key to see their progress here."
        newEntityLocations="/app/workspace/apps/projects/new"
        helpSubject={DocsHelpSubject.PROJECTS}
      />
    );
  }

  return (
    <>
      <StandardDivider title="📋 Key Projects Progress" size="large" />
      <ProjectStack
        topLevelInfo={props.topLevelInfo}
        projects={sortedProjects}
        projectMilestonesByRefId={projectMilestonesByRefId}
        projectStatsByRefId={projectStatsByRefId}
        showOptions={{
          showDonePct: true,
          showMilestonesLeft: true,
          showStatus: true,
          showLifePlan: true,
          showEisen: true,
          showDifficulty: true,
          showActionableDate: true,
          showDueDate: true,
          showHandleMarkDone: false,
          showHandleMarkNotDone: false,
        }}
      />
    </>
  );
}
