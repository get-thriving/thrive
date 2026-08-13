import { InboxTaskStatus } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import {
  inboxTaskStatusIcon,
  inboxTaskStatusName,
} from "#/core/common/sub/inbox_tasks/status";

interface Props {
  status: InboxTaskStatus;
  format?: "name" | "icon";
}

export function InboxTaskStatusTag(props: Props) {
  const format = props.format ?? "name";

  if (format === "icon") {
    return (
      <span style={{ paddingRight: "0.5rem" }}>
        {inboxTaskStatusIcon(props.status)}
      </span>
    );
  }

  const tagName = inboxTaskStatusName(props.status);
  const tagClass = statusToClass(props.status);
  return <SlimChip label={tagName} color={tagClass} />;
}

function statusToClass(
  status: InboxTaskStatus,
): "primary" | "info" | "warning" | "success" | "error" {
  switch (status) {
    case InboxTaskStatus.NOT_STARTED:
      return "primary";
    case InboxTaskStatus.IN_PROGRESS:
      return "info";
    case InboxTaskStatus.BLOCKED:
      return "warning";
    case InboxTaskStatus.DONE:
      return "success";
    case InboxTaskStatus.NOT_DONE:
      return "error";
  }
}
