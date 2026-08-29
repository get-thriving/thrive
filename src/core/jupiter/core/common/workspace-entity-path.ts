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
      return `/app/workspace/apps/todos/${refId}`;
    case NamedEntityTag.WORKING_MEM:
      return `/app/workspace/apps/working-mem`;
    case NamedEntityTag.TIME_PLAN:
      return `/app/workspace/apps/time-plans/${refId}`;
    case NamedEntityTag.TIME_PLAN_ACTIVITY:
      return `/app/workspace/apps/time-plans/no-parent/${refId}`;
    case NamedEntityTag.SCHEDULE_STREAM:
      return `/app/workspace/calendar/schedule/stream/${refId}`;
    case NamedEntityTag.SCHEDULE_EXPORT:
      return `/app/workspace/calendar/schedule/export/${refId}`;
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return `/app/workspace/calendar/schedule/event-in-day/${refId}`;
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return `/app/workspace/calendar/schedule/event-full-days/${refId}`;
    case NamedEntityTag.HABIT:
      return `/app/workspace/apps/habits/${refId}`;
    case NamedEntityTag.CHORE:
      return `/app/workspace/apps/chores/${refId}`;
    case NamedEntityTag.PROJECT:
      return `/app/workspace/apps/projects/${refId}`;
    case NamedEntityTag.JOURNAL:
      return `/app/workspace/apps/journals/${refId}`;
    case NamedEntityTag.DIR:
      return `/app/workspace/apps/docs/${refId}`;
    case NamedEntityTag.DOC:
      return `/app/workspace/apps/docs/no-parent/${refId}`;
    case NamedEntityTag.VACATION:
      return `/app/workspace/apps/vacations/${refId}`;
    case NamedEntityTag.ASPECT:
      return `/app/workspace/apps/life-plan/aspects/${refId}`;
    case NamedEntityTag.CHAPTER:
      return `/app/workspace/apps/life-plan/chapters/${refId}`;
    case NamedEntityTag.GOAL:
      return `/app/workspace/apps/life-plan/goals/${refId}`;
    case NamedEntityTag.MILESTONE:
      return `/app/workspace/apps/life-plan/milestones/${refId}`;
    case NamedEntityTag.VISION:
      return `/app/workspace/apps/life-plan/visions/${refId}`;
    case NamedEntityTag.SMART_LIST:
      return `/app/workspace/apps/smart-lists/${refId}`;
    case NamedEntityTag.SMART_LIST_ITEM:
      return `/app/workspace/apps/smart-lists/no-parent/${refId}`;
    case NamedEntityTag.METRIC:
      return `/app/workspace/apps/metrics/${refId}`;
    case NamedEntityTag.METRIC_ENTRY:
      return `/app/workspace/apps/metrics/no-parent/${refId}`;
    case NamedEntityTag.PERSON:
      return `/app/workspace/apps/prm/persons/${refId}`;
    case NamedEntityTag.CIRCLE:
      return `/app/workspace/apps/prm/circles/${refId}`;
    case NamedEntityTag.SLACK_TASK:
      return `/app/workspace/push-integrations/slack-tasks/${refId}`;
    case NamedEntityTag.EMAIL_TASK:
      return `/app/workspace/push-integrations/email-tasks/${refId}`;
    default:
      return null;
  }
}
