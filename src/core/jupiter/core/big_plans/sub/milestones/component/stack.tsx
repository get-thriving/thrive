import { type BigPlanMilestone } from "@jupiter/webapi-client";

import { sortBigPlanMilestones } from "#/core/big_plans/root";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { ADateTag } from "#/core/common/component/adate-tag";

interface BigPlanMilestoneStackProps {
  milestones: Array<BigPlanMilestone>;
}

export function BigPlanMilestoneStack(props: BigPlanMilestoneStackProps) {
  const sortedMilestones = sortBigPlanMilestones(props.milestones);

  return (
    <EntityStack>
      {sortedMilestones.map((milestone) => {
        return (
          <EntityCard
            key={`big-plan-milestone-${milestone.ref_id}`}
            entityId={`big-plan-milestone-${milestone.ref_id}`}
          >
            <EntityLink
              to={`/app/workspace/big-plans/${milestone.big_plan_ref_id}/milestones/${milestone.ref_id}`}
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
