import { type Occasion } from "@jupiter/webapi-client";

import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { BirthdayTag } from "#/core/common/component/birthday-tag";
import { sortOccasionsNaturally } from "#/core/prm/sub/person/sub/occasion/root";

interface OccasionStackProps {
  occasions: Array<Occasion>;
}

export function OccasionStack(props: OccasionStackProps) {
  const sortedOccasions = sortOccasionsNaturally(props.occasions);

  return (
    <EntityStack>
      {sortedOccasions.map((occasion) => {
        return (
          <EntityCard
            key={`occasion-${occasion.ref_id}`}
            entityId={`occasion-${occasion.ref_id}`}
          >
            <EntityLink
              to={`/app/workspace/prm/persons/${occasion.person_ref_id}/occasions/${occasion.ref_id}`}
            >
              <EntityNameComponent name={occasion.name} />
              <BirthdayTag label={""} birthday={occasion.date} />
            </EntityLink>
          </EntityCard>
        );
      })}
    </EntityStack>
  );
}
