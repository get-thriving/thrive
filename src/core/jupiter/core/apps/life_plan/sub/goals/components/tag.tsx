import type { Goal, GoalSummary } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface Props {
  goal: Goal | GoalSummary;
}

export function GoalTag(props: Props) {
  return <SlimChip label={`🎯 ${props.goal.name}`} color="info" />;
}
