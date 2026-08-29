import { type ProjectMilestone } from "@jupiter/webapi-client";

import { sortProjectMilestones } from "#/core/apps/projects/root";
import {
  EntityCard,
  EntityFakeLink,
  EntityLink,
} from "#/core/infra/component/entity-card";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { ADateTag } from "#/core/common/component/adate-tag";

interface ProjectMilestoneStackProps {
  milestones: Array<ProjectMilestone>;
  linksEnabled?: boolean;
}

export function ProjectMilestoneStack(props: ProjectMilestoneStackProps) {
  const sortedMilestones = sortProjectMilestones(props.milestones);
  const linksEnabled = props.linksEnabled ?? true;

  return (
    <EntityStack>
      {sortedMilestones.map((milestone) => {
        const content = (
          <>
            <EntityNameComponent name={milestone.name} />
            <ADateTag label="Date" date={milestone.date} />
          </>
        );

        return (
          <EntityCard
            key={`project-milestone-${milestone.ref_id}`}
            entityId={`project-milestone-${milestone.ref_id}`}
          >
            {linksEnabled ? (
              <EntityLink
                to={`/app/workspace/apps/projects/${milestone.project_ref_id}/milestones/${milestone.ref_id}`}
              >
                {content}
              </EntityLink>
            ) : (
              <EntityFakeLink inline>{content}</EntityFakeLink>
            )}
          </EntityCard>
        );
      })}
    </EntityStack>
  );
}
