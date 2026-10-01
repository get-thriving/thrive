import type { HabitStreakInactivePeriod } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";

import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityStack } from "#/core/infra/component/entity-stack";

interface StreakInactivePeriodStackProps {
  habitRefId: string;
  periods: Array<HabitStreakInactivePeriod>;
  search?: string;
}

export function StreakInactivePeriodStack(
  props: StreakInactivePeriodStackProps,
) {
  if (props.periods.length === 0) {
    return null;
  }

  return (
    <EntityStack>
      {props.periods.map((period) => (
        <EntityCard
          key={`streak-inactive-period-${period.ref_id}`}
          entityId={`streak-inactive-period-${period.ref_id}`}
          showAsArchived={period.archived}
        >
          <EntityLink
            to={`/app/workspace/apps/habits/habits/${props.habitRefId}/streak-inactive-periods/${period.ref_id}${props.search ? `?${props.search}` : ""}`}
          >
            <EntityNameComponent name={period.name} />
            <Typography variant="body2">
              {period.start_date} to {period.end_date}
            </Typography>
          </EntityLink>
        </EntityCard>
      ))}
    </EntityStack>
  );
}
