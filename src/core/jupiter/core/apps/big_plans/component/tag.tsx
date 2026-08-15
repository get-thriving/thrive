import type { BigPlan } from "@jupiter/webapi-client";

import { LinkTag } from "#/core/infra/component/link-tag";

interface Props {
  bigPlan: BigPlan;
}

export function BigPlanTag(props: Props) {
  return <LinkTag label={props.bigPlan.name} color="primary" />;
}
