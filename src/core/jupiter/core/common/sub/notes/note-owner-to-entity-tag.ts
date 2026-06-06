import { NamedEntityTag } from "@jupiter/webapi-client";

import { parseNoteOwner } from "#/core/common/sub/notes/parse-note-owner";

/** Map note owner ``theType`` (class-style tag) to :class:`NamedEntityTag`. */
export function noteOwnerLinkToEntityTag(owner: string): NamedEntityTag {
  const { theType } = parseNoteOwner(owner);
  switch (theType) {
    case NamedEntityTag.TODO_TASK:
      return NamedEntityTag.TODO_TASK;
    case NamedEntityTag.WORKING_MEM:
      return NamedEntityTag.WORKING_MEM;
    case NamedEntityTag.TIME_PLAN:
      return NamedEntityTag.TIME_PLAN;
    case NamedEntityTag.TIME_PLAN_ACTIVITY:
      return NamedEntityTag.TIME_PLAN_ACTIVITY;
    case NamedEntityTag.SCHEDULE_STREAM:
      return NamedEntityTag.SCHEDULE_STREAM;
    case NamedEntityTag.SCHEDULE_EXPORT:
      return NamedEntityTag.SCHEDULE_EXPORT;
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return NamedEntityTag.SCHEDULE_EVENT_IN_DAY;
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS;
    case NamedEntityTag.HABIT:
      return NamedEntityTag.HABIT;
    case NamedEntityTag.CHORE:
      return NamedEntityTag.CHORE;
    case NamedEntityTag.PROJECT:
      return NamedEntityTag.PROJECT;
    case NamedEntityTag.DOC:
      return NamedEntityTag.DOC;
    case NamedEntityTag.JOURNAL:
      return NamedEntityTag.JOURNAL;
    case NamedEntityTag.VACATION:
      return NamedEntityTag.VACATION;
    case NamedEntityTag.ASPECT:
      return NamedEntityTag.ASPECT;
    case NamedEntityTag.CHAPTER:
      return NamedEntityTag.CHAPTER;
    case NamedEntityTag.GOAL:
      return NamedEntityTag.GOAL;
    case NamedEntityTag.MILESTONE:
      return NamedEntityTag.MILESTONE;
    case NamedEntityTag.VISION:
      return NamedEntityTag.VISION;
    case NamedEntityTag.SMART_LIST:
      return NamedEntityTag.SMART_LIST;
    case NamedEntityTag.SMART_LIST_ITEM:
      return NamedEntityTag.SMART_LIST_ITEM;
    case NamedEntityTag.METRIC:
      return NamedEntityTag.METRIC;
    case NamedEntityTag.METRIC_ENTRY:
      return NamedEntityTag.METRIC_ENTRY;
    case NamedEntityTag.PERSON:
      return NamedEntityTag.PERSON;
    case NamedEntityTag.OCCASION:
      return NamedEntityTag.OCCASION;
    default: {
      throw new Error(`Unhandled note owner type: ${theType}`);
    }
  }
}
