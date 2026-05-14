import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/notes/parse-note-owner.ts
function parseNoteOwner(owner) {
  const parts = owner.split(":");
  if (parts.length < 3) {
    throw new Error(`Invalid note owner link: ${owner}`);
  }
  const purpose = parts[parts.length - 1];
  const refId = parts[parts.length - 2];
  const theType = parts.slice(0, -2).join(":");
  return { theType, refId, purpose };
}

// ../core/jupiter/core/common/sub/notes/note-owner-to-entity-tag.ts
var import_webapi_client = __toESM(require_dist(), 1);
function noteOwnerLinkToEntityTag(owner) {
  const { theType } = parseNoteOwner(owner);
  switch (theType) {
    case import_webapi_client.NamedEntityTag.TODO_TASK:
      return import_webapi_client.NamedEntityTag.TODO_TASK;
    case import_webapi_client.NamedEntityTag.WORKING_MEM:
      return import_webapi_client.NamedEntityTag.WORKING_MEM;
    case import_webapi_client.NamedEntityTag.TIME_PLAN:
      return import_webapi_client.NamedEntityTag.TIME_PLAN;
    case import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY:
      return import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY;
    case import_webapi_client.NamedEntityTag.SCHEDULE_STREAM:
      return import_webapi_client.NamedEntityTag.SCHEDULE_STREAM;
    case import_webapi_client.NamedEntityTag.SCHEDULE_EXPORT:
      return import_webapi_client.NamedEntityTag.SCHEDULE_EXPORT;
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_IN_DAY;
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS;
    case import_webapi_client.NamedEntityTag.HABIT:
      return import_webapi_client.NamedEntityTag.HABIT;
    case import_webapi_client.NamedEntityTag.CHORE:
      return import_webapi_client.NamedEntityTag.CHORE;
    case import_webapi_client.NamedEntityTag.BIG_PLAN:
      return import_webapi_client.NamedEntityTag.BIG_PLAN;
    case import_webapi_client.NamedEntityTag.DOC:
      return import_webapi_client.NamedEntityTag.DOC;
    case import_webapi_client.NamedEntityTag.JOURNAL:
      return import_webapi_client.NamedEntityTag.JOURNAL;
    case import_webapi_client.NamedEntityTag.VACATION:
      return import_webapi_client.NamedEntityTag.VACATION;
    case import_webapi_client.NamedEntityTag.ASPECT:
      return import_webapi_client.NamedEntityTag.ASPECT;
    case import_webapi_client.NamedEntityTag.CHAPTER:
      return import_webapi_client.NamedEntityTag.CHAPTER;
    case import_webapi_client.NamedEntityTag.GOAL:
      return import_webapi_client.NamedEntityTag.GOAL;
    case import_webapi_client.NamedEntityTag.MILESTONE:
      return import_webapi_client.NamedEntityTag.MILESTONE;
    case import_webapi_client.NamedEntityTag.VISION:
      return import_webapi_client.NamedEntityTag.VISION;
    case import_webapi_client.NamedEntityTag.SMART_LIST:
      return import_webapi_client.NamedEntityTag.SMART_LIST;
    case import_webapi_client.NamedEntityTag.SMART_LIST_ITEM:
      return import_webapi_client.NamedEntityTag.SMART_LIST_ITEM;
    case import_webapi_client.NamedEntityTag.METRIC:
      return import_webapi_client.NamedEntityTag.METRIC;
    case import_webapi_client.NamedEntityTag.METRIC_ENTRY:
      return import_webapi_client.NamedEntityTag.METRIC_ENTRY;
    case import_webapi_client.NamedEntityTag.PERSON:
      return import_webapi_client.NamedEntityTag.PERSON;
    case import_webapi_client.NamedEntityTag.OCCASION:
      return import_webapi_client.NamedEntityTag.OCCASION;
    default: {
      throw new Error(`Unhandled note owner type: ${theType}`);
    }
  }
}

export {
  parseNoteOwner,
  noteOwnerLinkToEntityTag
};
//# sourceMappingURL=/build/_shared/chunk-BRK4DZ5N.js.map
