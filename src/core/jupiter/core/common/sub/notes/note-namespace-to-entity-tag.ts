import { NamedEntityTag, NoteNamespace } from "@jupiter/webapi-client";

export function noteNamespaceToEntityTag(
  namespace: NoteNamespace,
): NamedEntityTag {
  switch (namespace) {
    case NoteNamespace.INBOX_TASK:
      return NamedEntityTag.INBOX_TASK;
    case NoteNamespace.WORKING_MEM:
      return NamedEntityTag.WORKING_MEM;
    case NoteNamespace.TIME_PLAN:
      return NamedEntityTag.TIME_PLAN;
    case NoteNamespace.SCHEDULE_STREAM:
      return NamedEntityTag.SCHEDULE_STREAM;
    case NoteNamespace.SCHEDULE_EXPORT:
      return NamedEntityTag.SCHEDULE_EXPORT;
    case NoteNamespace.SCHEDULE_EVENT_IN_DAY:
      return NamedEntityTag.SCHEDULE_EVENT_IN_DAY;
    case NoteNamespace.SCHEDULE_EVENT_FULL_DAYS:
      return NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS;
    case NoteNamespace.HABIT:
      return NamedEntityTag.HABIT;
    case NoteNamespace.CHORE:
      return NamedEntityTag.CHORE;
    case NoteNamespace.BIG_PLAN:
      return NamedEntityTag.BIG_PLAN;
    case NoteNamespace.DOC:
      return NamedEntityTag.DOC;
    case NoteNamespace.JOURNAL:
      return NamedEntityTag.JOURNAL;
    case NoteNamespace.VACATION:
      return NamedEntityTag.VACATION;
    case NoteNamespace.ASPECT:
      return NamedEntityTag.ASPECT;
    case NoteNamespace.CHAPTER:
      return NamedEntityTag.CHAPTER;
    case NoteNamespace.GOAL:
      return NamedEntityTag.GOAL;
    case NoteNamespace.MILESTONE:
      return NamedEntityTag.MILESTONE;
    case NoteNamespace.VISION:
      return NamedEntityTag.VISION;
    case NoteNamespace.SMART_LIST:
      return NamedEntityTag.SMART_LIST;
    case NoteNamespace.SMART_LIST_ITEM:
      return NamedEntityTag.SMART_LIST_ITEM;
    case NoteNamespace.METRIC:
      return NamedEntityTag.METRIC;
    case NoteNamespace.METRIC_ENTRY:
      return NamedEntityTag.METRIC_ENTRY;
    case NoteNamespace.PERSON:
      return NamedEntityTag.PERSON;
    case NoteNamespace.OCCASION:
      return NamedEntityTag.OCCASION;
  }
}
