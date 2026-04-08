import { InboxTaskNamespace } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { inboxTaskNamespaceName } from "#/core/common/sub/inbox_tasks/namespace";

interface Props {
  namespace: InboxTaskNamespace;
}

export function InboxTaskNamespaceTag(props: Props) {
  const tagName = inboxTaskNamespaceName(props.namespace);
  const tagClass = namespaceToClass(props.namespace);
  return <SlimChip label={tagName} color={tagClass} />;
}

function namespaceToClass(
  namespace: InboxTaskNamespace,
): "info" | "warning" | "error" {
  switch (namespace) {
    case InboxTaskNamespace.TODO_TASK:
      return "info";
    case InboxTaskNamespace.WORKING_MEM_CLEANUP:
      return "warning";
    case InboxTaskNamespace.TIME_PLAN:
      return "info";
    case InboxTaskNamespace.HABIT:
      return "warning";
    case InboxTaskNamespace.CHORE:
      return "warning";
    case InboxTaskNamespace.BIG_PLAN:
      return "info";
    case InboxTaskNamespace.JOURNAL:
      return "info";
    case InboxTaskNamespace.METRIC:
      return "warning";
    case InboxTaskNamespace.PERSON_OCCASION:
      return "warning";
    case InboxTaskNamespace.PERSON_CATCH_UP:
      return "warning";
    case InboxTaskNamespace.SLACK_TASK:
      return "error";
    case InboxTaskNamespace.EMAIL_TASK:
      return "error";
    case InboxTaskNamespace.LIFE_PLAN_EVAL:
      return "info";
    default: {
      const _x: never = namespace;
      return _x;
    }
  }
}
