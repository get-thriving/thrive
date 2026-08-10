import { NamedEntityTag } from "@jupiter/webapi-client";

/**
 * Workspace leaf/trunk path for a named entity, when one exists.
 * Mirrors the routes used by EntitySummaryLink / SearchMatchLink.
 */
export function workspacePathForEntityTag(
  entityTag: NamedEntityTag,
  refId: string,
): string | null {
  switch (entityTag) {
    case NamedEntityTag.TODO_TASK:
      return `/app/workspace/todos/${refId}`;
    case NamedEntityTag.WORKING_MEM:
      return `/app/workspace/working-mem`;
    case NamedEntityTag.TIME_PLAN:
      return `/app/workspace/time-plans/${refId}`;
    case NamedEntityTag.TIME_PLAN_ACTIVITY:
      return `/app/workspace/time-plans/no-parent/${refId}`;
    case NamedEntityTag.SCHEDULE_STREAM:
      return `/app/workspace/calendar/schedule/stream/${refId}`;
    case NamedEntityTag.SCHEDULE_EXPORT:
      return `/app/workspace/calendar/schedule/export/${refId}`;
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return `/app/workspace/calendar/schedule/event-in-day/${refId}`;
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return `/app/workspace/calendar/schedule/event-full-days/${refId}`;
    case NamedEntityTag.HABIT:
      return `/app/workspace/habits/${refId}`;
    case NamedEntityTag.CHORE:
      return `/app/workspace/chores/${refId}`;
    case NamedEntityTag.BIG_PLAN:
      return `/app/workspace/big-plans/${refId}`;
    case NamedEntityTag.JOURNAL:
      return `/app/workspace/journals/${refId}`;
    case NamedEntityTag.DIR:
      return `/app/workspace/docs/${refId}`;
    case NamedEntityTag.DOC:
      return `/app/workspace/docs/no-parent/${refId}`;
    case NamedEntityTag.VACATION:
      return `/app/workspace/vacations/${refId}`;
    case NamedEntityTag.ASPECT:
      return `/app/workspace/life-plan/aspects/${refId}`;
    case NamedEntityTag.CHAPTER:
      return `/app/workspace/life-plan/chapters/${refId}`;
    case NamedEntityTag.GOAL:
      return `/app/workspace/life-plan/goals/${refId}`;
    case NamedEntityTag.MILESTONE:
      return `/app/workspace/life-plan/milestones/${refId}`;
    case NamedEntityTag.VISION:
      return `/app/workspace/life-plan/visions/${refId}`;
    case NamedEntityTag.SMART_LIST:
      return `/app/workspace/smart-lists/${refId}`;
    case NamedEntityTag.SMART_LIST_ITEM:
      return `/app/workspace/smart-lists/no-parent/${refId}`;
    case NamedEntityTag.METRIC:
      return `/app/workspace/metrics/${refId}`;
    case NamedEntityTag.METRIC_ENTRY:
      return `/app/workspace/metrics/no-parent/${refId}`;
    case NamedEntityTag.PERSON:
      return `/app/workspace/prm/persons/${refId}`;
    case NamedEntityTag.CIRCLE:
      return `/app/workspace/prm/circles/${refId}`;
    case NamedEntityTag.SLACK_TASK:
      return `/app/workspace/push-integrations/slack-tasks/${refId}`;
    case NamedEntityTag.EMAIL_TASK:
      return `/app/workspace/push-integrations/email-tasks/${refId}`;
    default:
      return null;
  }
}
