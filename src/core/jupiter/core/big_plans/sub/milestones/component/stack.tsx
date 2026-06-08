import { type BigPlanMilestone } from "@jupiter/webapi-client";

import { sortBigPlanMilestones } from "#/core/big_plans/root";
import {
  EntityCard,
  EntityFakeLink,
  EntityLink,
} from "#/core/infra/component/entity-card";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { ADateTag } from "#/core/common/component/adate-tag";

interface BigPlanMilestoneStackProps {
  milestones: Array<BigPlanMilestone>;
  linksEnabled?: boolean;
}

export function BigPlanMilestoneStack(props: BigPlanMilestoneStackProps) {
  const sortedMilestones = sortBigPlanMilestones(props.milestones);
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
            key={`big-plan-milestone-${milestone.ref_id}`}
            entityId={`big-plan-milestone-${milestone.ref_id}`}
          >
            {linksEnabled ? (
              <EntityLink
                to={`/app/workspace/big-plans/${milestone.big_plan_ref_id}/milestones/${milestone.ref_id}`}
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
