import { type ProjectMilestone } from "@jupiter/webapi-client";

import { sortProjectMilestones } from "#/core/projects/root";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { ADateTag } from "#/core/common/component/adate-tag";

interface ProjectMilestoneStackProps {
  milestones: Array<ProjectMilestone>;
}

export function ProjectMilestoneStack(props: ProjectMilestoneStackProps) {
  const sortedMilestones = sortProjectMilestones(props.milestones);

  return (
    <EntityStack>
      {sortedMilestones.map((milestone) => {
        return (
          <EntityCard
            key={`project-milestone-${milestone.ref_id}`}
            entityId={`project-milestone-${milestone.ref_id}`}
          >
            <EntityLink
              to={`/app/workspace/projects/${milestone.project_ref_id}/milestones/${milestone.ref_id}`}
            >
              <EntityNameComponent name={milestone.name} />
              <ADateTag label="Date" date={milestone.date} />
            </EntityLink>
          </EntityCard>
        );
      })}
    </EntityStack>
  );
}
