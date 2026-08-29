import { ProjectStatus } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import {
  projectStatusIcon,
  projectStatusName,
} from "#/core/apps/projects/status";

interface Props {
  status: ProjectStatus;
  format?: "name" | "icon";
}

export function ProjectStatusTag(props: Props) {
  const format = props.format ?? "name";
  const tagName =
    format === "name"
      ? projectStatusName(props.status)
      : projectStatusIcon(props.status);
  const tagClass = statusToClass(props.status);
  if (format === "name") {
    return <SlimChip label={tagName} color={tagClass} />;
  } else {
    return <span style={{ paddingRight: "0.5rem" }}>{tagName}</span>;
  }
}

function statusToClass(
  status: ProjectStatus,
): "info" | "warning" | "success" | "error" {
  switch (status) {
    case ProjectStatus.NOT_STARTED:
      return "info";
    case ProjectStatus.IN_PROGRESS:
      return "warning";
    case ProjectStatus.BLOCKED:
      return "warning";
    case ProjectStatus.DONE:
      return "success";
    case ProjectStatus.NOT_DONE:
      return "error";
  }
}
