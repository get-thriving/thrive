import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/inbox_tasks/parent-link-namespace.ts
var TODO_TASK = "TodoTask:std";
var WORKING_MEM_CLEANUP = "WorkingMemCollection:std";
var TIME_PLAN = "TimePlan:std";
var HABIT = "Habit:std";
var CHORE = "Chore:std";
var BIG_PLAN = "BigPlan:std";
var JOURNAL = "Journal:std";
var METRIC = "Metric:std";
var PERSON_CATCH_UP = "Person:std";
var PERSON_OCCASION = "Occasion:std";
var SLACK_TASK = "SlackTask:std";
var EMAIL_TASK = "EmailTask:std";
var LIFE_PLAN_EVAL = "LifePlan:std";
function parentLinkNamespaceFromEntityLinkWire(link) {
  const parts = link.split(":");
  if (parts.length < 3) {
    throw new Error(`Invalid entity link for parent namespace: ${link}`);
  }
  parts.pop();
  const purpose = parts.pop();
  const theType = parts.join(":");
  return `${theType}:${purpose}`;
}
function entityLinkRefIdFromWire(link) {
  const parts = link.split(":");
  if (parts.length < 3) {
    throw new Error(`Invalid entity link: ${link}`);
  }
  return parts[parts.length - 1];
}

// ../core/jupiter/core/workspaces/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function isWorkspaceFeatureAvailable(workspace, feature) {
  return workspace.feature_flags[feature];
}
function inferEntityTagsForEnabledFeatures(workspace, entityTags) {
  const inferredEntityTags = [];
  for (const entityTag of entityTags) {
    if (entityTag === import_webapi_client.NamedEntityTag.TODO_TASK && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.TODO_TASK)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.WORKING_MEM && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.WORKING_MEM)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.TIME_PLAN && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.TIME_PLANS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.TIME_PLANS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.SCHEDULE_STREAM && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.SCHEDULE)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.SCHEDULE_EXPORT && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.SCHEDULE)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_IN_DAY && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.SCHEDULE)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.SCHEDULE)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.HABIT && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.HABITS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.CHORE && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.CHORES)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.BIG_PLAN && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.BIG_PLANS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.JOURNAL && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.JOURNALS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.DOC && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.DOCS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.VACATION && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.VACATIONS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.ASPECT && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.CHAPTER && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.GOAL && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.VISION && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.SMART_LIST && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.SMART_LISTS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.SMART_LIST_ITEM && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.SMART_LISTS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.METRIC && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.METRICS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.METRIC_ENTRY && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.METRICS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.PERSON && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.PRM)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.CIRCLE && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.PRM)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.SLACK_TASK && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.SLACK_TASKS)) {
      inferredEntityTags.push(entityTag);
    } else if (entityTag === import_webapi_client.NamedEntityTag.EMAIL_TASK && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.EMAIL_TASKS)) {
      inferredEntityTags.push(entityTag);
    }
  }
  return inferredEntityTags;
}
function inferSourcesForEnabledFeatures(workspace, sources) {
  const inferredSources = [];
  for (const source of sources) {
    if (source === TODO_TASK) {
      inferredSources.push(source);
    } else if (source === WORKING_MEM_CLEANUP && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.WORKING_MEM)) {
      inferredSources.push(source);
    } else if (source === TIME_PLAN && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.TIME_PLANS)) {
      inferredSources.push(source);
    } else if (source === HABIT && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.HABITS)) {
      inferredSources.push(source);
    } else if (source === CHORE && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.CHORES)) {
      inferredSources.push(source);
    } else if (source === BIG_PLAN && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.BIG_PLANS)) {
      inferredSources.push(source);
    } else if (source === JOURNAL && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.JOURNALS)) {
      inferredSources.push(source);
    } else if (source === METRIC && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.METRICS)) {
      inferredSources.push(source);
    } else if (source === PERSON_OCCASION && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.PRM)) {
      inferredSources.push(source);
    } else if (source === PERSON_CATCH_UP && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.PRM)) {
      inferredSources.push(source);
    } else if (source === SLACK_TASK && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.SLACK_TASKS)) {
      inferredSources.push(source);
    } else if (source === EMAIL_TASK && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.EMAIL_TASKS)) {
      inferredSources.push(source);
    } else if (source === LIFE_PLAN_EVAL && isWorkspaceFeatureAvailable(workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN)) {
      inferredSources.push(source);
    }
  }
  return inferredSources;
}

export {
  TODO_TASK,
  WORKING_MEM_CLEANUP,
  TIME_PLAN,
  HABIT,
  CHORE,
  BIG_PLAN,
  JOURNAL,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  SLACK_TASK,
  EMAIL_TASK,
  LIFE_PLAN_EVAL,
  parentLinkNamespaceFromEntityLinkWire,
  entityLinkRefIdFromWire,
  isWorkspaceFeatureAvailable,
  inferEntityTagsForEnabledFeatures,
  inferSourcesForEnabledFeatures
};
//# sourceMappingURL=/build/_shared/chunk-ZFIM7NDI.js.map
