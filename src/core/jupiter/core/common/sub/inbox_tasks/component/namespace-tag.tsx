import {
  BIG_PLAN,
  CHORE,
  EMAIL_TASK,
  HABIT,
  JOURNAL,
  LIFE_PLAN_EVAL,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  SLACK_TASK,
  TIME_PLAN,
  TODO_TASK,
  WORKING_MEM_CLEANUP,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { inboxTaskNamespaceName } from "#/core/common/sub/inbox_tasks/namespace";
import { SlimChip } from "#/core/infra/component/chips";

interface Props {
  namespace: string;
}

export function InboxTaskNamespaceTag(props: Props) {
  const tagName = inboxTaskNamespaceName(props.namespace);
  const tagClass = namespaceToClass(props.namespace);
  return <SlimChip label={tagName} color={tagClass} />;
}

function namespaceToClass(namespace: string): "info" | "warning" | "error" {
  switch (namespace) {
    case TODO_TASK:
      return "info";
    case WORKING_MEM_CLEANUP:
      return "warning";
    case TIME_PLAN:
      return "info";
    case HABIT:
      return "warning";
    case CHORE:
      return "warning";
    case BIG_PLAN:
      return "info";
    case JOURNAL:
      return "info";
    case METRIC:
      return "warning";
    case PERSON_OCCASION:
      return "warning";
    case PERSON_CATCH_UP:
      return "warning";
    case SLACK_TASK:
      return "error";
    case EMAIL_TASK:
      return "error";
    case LIFE_PLAN_EVAL:
      return "info";
    default:
      return "info";
  }
}
