import type { Aspect, AspectSummary } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface Props {
  aspect: Aspect | AspectSummary;
}

export function AspectTag(props: Props) {
  return <SlimChip label={`⭐ ${props.aspect.name}`} color="info" />;
}
