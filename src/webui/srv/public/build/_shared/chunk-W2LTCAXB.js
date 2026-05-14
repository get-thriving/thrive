import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/features.ts
var import_webapi_client = __toESM(require_dist(), 1);
function userFeatureName(feature) {
  switch (feature) {
    case import_webapi_client.UserFeature.GAMIFICATION:
      return "Gamification";
  }
}
function userFeatureToDocsHelpSubject(feature) {
  switch (feature) {
    case import_webapi_client.UserFeature.GAMIFICATION:
      return import_webapi_client.DocsHelpSubject.GAMIFICATION;
  }
}
function workspaceFeatureName(feature) {
  switch (feature) {
    case import_webapi_client.WorkspaceFeature.TODO_TASK:
      return "Todo Tasks";
    case import_webapi_client.WorkspaceFeature.WORKING_MEM:
      return "Working Mem";
    case import_webapi_client.WorkspaceFeature.TIME_PLANS:
      return "Time Plans";
    case import_webapi_client.WorkspaceFeature.SCHEDULE:
      return "Schedule";
    case import_webapi_client.WorkspaceFeature.HABITS:
      return "Habits";
    case import_webapi_client.WorkspaceFeature.CHORES:
      return "Chores";
    case import_webapi_client.WorkspaceFeature.BIG_PLANS:
      return "Big Plans";
    case import_webapi_client.WorkspaceFeature.JOURNALS:
      return "Journals";
    case import_webapi_client.WorkspaceFeature.DOCS:
      return "Docs";
    case import_webapi_client.WorkspaceFeature.VACATIONS:
      return "Vacations";
    case import_webapi_client.WorkspaceFeature.LIFE_PLAN:
      return "Life Plan";
    case import_webapi_client.WorkspaceFeature.SMART_LISTS:
      return "Smart Lists";
    case import_webapi_client.WorkspaceFeature.METRICS:
      return "Metrics";
    case import_webapi_client.WorkspaceFeature.PRM:
      return "Personal Relationships Management";
    case import_webapi_client.WorkspaceFeature.SLACK_TASKS:
      return "Slack Tasks";
    case import_webapi_client.WorkspaceFeature.EMAIL_TASKS:
      return "Email Tasks";
  }
}
function workspaceFeatureToDocsHelpSubject(feature) {
  switch (feature) {
    case import_webapi_client.WorkspaceFeature.TODO_TASK:
      return import_webapi_client.DocsHelpSubject.TODOS;
    case import_webapi_client.WorkspaceFeature.WORKING_MEM:
      return import_webapi_client.DocsHelpSubject.WORKING_MEM;
    case import_webapi_client.WorkspaceFeature.TIME_PLANS:
      return import_webapi_client.DocsHelpSubject.TIME_PLANS;
    case import_webapi_client.WorkspaceFeature.SCHEDULE:
      return import_webapi_client.DocsHelpSubject.SCHEDULE;
    case import_webapi_client.WorkspaceFeature.HABITS:
      return import_webapi_client.DocsHelpSubject.HABITS;
    case import_webapi_client.WorkspaceFeature.CHORES:
      return import_webapi_client.DocsHelpSubject.CHORES;
    case import_webapi_client.WorkspaceFeature.BIG_PLANS:
      return import_webapi_client.DocsHelpSubject.BIG_PLANS;
    case import_webapi_client.WorkspaceFeature.JOURNALS:
      return import_webapi_client.DocsHelpSubject.JOURNALS;
    case import_webapi_client.WorkspaceFeature.DOCS:
      return import_webapi_client.DocsHelpSubject.DOCS;
    case import_webapi_client.WorkspaceFeature.VACATIONS:
      return import_webapi_client.DocsHelpSubject.VACATIONS;
    case import_webapi_client.WorkspaceFeature.LIFE_PLAN:
      return import_webapi_client.DocsHelpSubject.LIFE_PLAN;
    case import_webapi_client.WorkspaceFeature.SMART_LISTS:
      return import_webapi_client.DocsHelpSubject.SMART_LISTS;
    case import_webapi_client.WorkspaceFeature.METRICS:
      return import_webapi_client.DocsHelpSubject.METRICS;
    case import_webapi_client.WorkspaceFeature.PRM:
      return import_webapi_client.DocsHelpSubject.PRM;
    case import_webapi_client.WorkspaceFeature.SLACK_TASKS:
      return import_webapi_client.DocsHelpSubject.SLACK_TASKS;
    case import_webapi_client.WorkspaceFeature.EMAIL_TASKS:
      return import_webapi_client.DocsHelpSubject.EMAIL_TASKS;
  }
}
function featureControlImpliesReadonly(featureControl) {
  return featureControl !== import_webapi_client.FeatureControl.USER;
}

export {
  userFeatureName,
  userFeatureToDocsHelpSubject,
  workspaceFeatureName,
  workspaceFeatureToDocsHelpSubject,
  featureControlImpliesReadonly
};
//# sourceMappingURL=/build/_shared/chunk-W2LTCAXB.js.map
