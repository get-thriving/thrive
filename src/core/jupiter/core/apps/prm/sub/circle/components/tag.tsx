import type { Circle } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface CircleTagProps {
  circle: Circle;
}

export function CircleTag(props: CircleTagProps) {
  return (
    <SlimChip label={`⭕ ${props.circle.name}`} variant="filled" color="info" />
  );
}
