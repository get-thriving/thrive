import { TimePlanSource } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { timePlanSourceName } from "#/core/time_plans/source";

interface Props {
  source: TimePlanSource;
}

export function TimePlanSourceTag({ source }: Props) {
  const tagName = timePlanSourceName(source);
  const tagClass = sourceToClass(source);
  return <SlimChip label={tagName} color={tagClass} />;
}

function sourceToClass(source: TimePlanSource): "info" | "warning" {
  switch (source) {
    case TimePlanSource.TODO:
      return "info";
    case TimePlanSource.GENERATED:
      return "warning";
  }
}
