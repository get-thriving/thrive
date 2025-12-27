import type { Goal } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface Props {
  goal: Goal;
}

export function GoalTag(props: Props) {
  return <SlimChip label={`🎯 ${props.goal.name}`} color="info" />;
}
