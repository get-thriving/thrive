import { BigPlanStatus } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { bigPlanStatusIcon, bigPlanStatusName } from "#/core/big_plans/status";

interface Props {
  status: BigPlanStatus;
  format?: "name" | "icon";
}

export function BigPlanStatusTag(props: Props) {
  const format = props.format ?? "name";
  const tagName =
    format === "name"
      ? bigPlanStatusName(props.status)
      : bigPlanStatusIcon(props.status);
  const tagClass = statusToClass(props.status);
  if (format === "name") {
    return <SlimChip label={tagName} color={tagClass} />;
  } else {
    return <span style={{ paddingRight: "0.5rem" }}>{tagName}</span>;
  }
}

function statusToClass(
  status: BigPlanStatus,
): "info" | "warning" | "success" | "error" {
  switch (status) {
    case BigPlanStatus.NOT_STARTED:
      return "info";
    case BigPlanStatus.IN_PROGRESS:
      return "warning";
    case BigPlanStatus.BLOCKED:
      return "warning";
    case BigPlanStatus.DONE:
      return "success";
    case BigPlanStatus.NOT_DONE:
      return "error";
  }
}
