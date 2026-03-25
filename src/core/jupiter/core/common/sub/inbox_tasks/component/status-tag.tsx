import { InboxTaskStatus } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { inboxTaskStatusName } from "#/core/common/sub/inbox_tasks/status";

interface Props {
  status: InboxTaskStatus;
}

export function InboxTaskStatusTag(props: Props) {
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
    case InboxTaskStatus.NOT_STARTED_GEN:
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
