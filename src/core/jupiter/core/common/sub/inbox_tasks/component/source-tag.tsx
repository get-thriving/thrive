import { InboxTaskSource } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { inboxTaskSourceName } from "#/core/common/sub/inbox_tasks/source";

interface Props {
  source: InboxTaskSource;
}

export function InboxTaskSourceTag(props: Props) {
  const tagName = inboxTaskSourceName(props.source);
  const tagClass = sourceToClass(props.source);
  return <SlimChip label={tagName} color={tagClass} />;
}

function sourceToClass(source: InboxTaskSource): "info" | "warning" | "error" {
  switch (source) {
    case InboxTaskSource.TODO_TASK:
      return "info";
    case InboxTaskSource.WORKING_MEM_CLEANUP:
      return "warning";
    case InboxTaskSource.TIME_PLAN:
      return "info";
    case InboxTaskSource.HABIT:
      return "warning";
    case InboxTaskSource.CHORE:
      return "warning";
    case InboxTaskSource.BIG_PLAN:
      return "info";
    case InboxTaskSource.JOURNAL:
      return "info";
    case InboxTaskSource.METRIC:
      return "warning";
    case InboxTaskSource.PERSON_OCCASION:
      return "warning";
    case InboxTaskSource.PERSON_CATCH_UP:
      return "warning";
    case InboxTaskSource.SLACK_TASK:
      return "error";
    case InboxTaskSource.EMAIL_TASK:
      return "error";
    case InboxTaskSource.LIFE_PLAN_EVAL:
      return "info";
  }
}
