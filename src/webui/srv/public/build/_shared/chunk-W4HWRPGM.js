import {
  isUserFeatureAvailable
} from "/build/_shared/chunk-LJCXIXWH.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  Box_default,
  Chip_default,
  MenuItem_default,
  Select_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/component/sync-target-select.tsx
var import_webapi_client3 = __toESM(require_dist(), 1);

// ../core/jupiter/core/sync-target.ts
var import_webapi_client = __toESM(require_dist(), 1);
function syncTargetName(syncTarget) {
  switch (syncTarget) {
    case import_webapi_client.SyncTarget.TODO_TASKS:
      return "Todo Tasks";
    case import_webapi_client.SyncTarget.WORKING_MEM:
      return "Working Mem";
    case import_webapi_client.SyncTarget.TIME_PLANS:
      return "Time Plans";
    case import_webapi_client.SyncTarget.SCHEDULE:
      return "Schedule";
    case import_webapi_client.SyncTarget.HABITS:
      return "Habits";
    case import_webapi_client.SyncTarget.CHORES:
      return "Chores";
    case import_webapi_client.SyncTarget.BIG_PLANS:
      return "Big Plans";
    case import_webapi_client.SyncTarget.JOURNALS:
      return "Journals";
    case import_webapi_client.SyncTarget.DOCS:
      return "Docs";
    case import_webapi_client.SyncTarget.VACATIONS:
      return "Vacations";
    case import_webapi_client.SyncTarget.ASPECTS:
      return "Aspects";
    case import_webapi_client.SyncTarget.CHAPTERS:
      return "Chapters";
    case import_webapi_client.SyncTarget.GOALS:
      return "Goals";
    case import_webapi_client.SyncTarget.MILESTONES:
      return "Milestones";
    case import_webapi_client.SyncTarget.VISIONS:
      return "Visions";
    case import_webapi_client.SyncTarget.SMART_LISTS:
      return "Smart Lists";
    case import_webapi_client.SyncTarget.METRICS:
      return "Metrics";
    case import_webapi_client.SyncTarget.PERSONS:
      return "Persons";
    case import_webapi_client.SyncTarget.OCCASIONS:
      return "Occasions";
    case import_webapi_client.SyncTarget.CIRCLES:
      return "Circles";
    case import_webapi_client.SyncTarget.SLACK_TASKS:
      return "Slack Tasks";
    case import_webapi_client.SyncTarget.EMAIL_TASKS:
      return "Email Tasks";
    case import_webapi_client.SyncTarget.GAMIFICATION:
      return "Gamification";
    case import_webapi_client.SyncTarget.LIFE_PLAN_EVAL:
      return "Life Plan Eval";
  }
}

// ../core/jupiter/core/infer-sync-target.ts
var import_webapi_client2 = __toESM(require_dist(), 1);
function inferSyncTargetsForEnabledFeatures(user, workspace, syncTargets) {
  const inferredSyncTargets = [];
  for (const syncTarget of syncTargets) {
    if (syncTarget === import_webapi_client2.SyncTarget.TODO_TASKS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.TODO_TASK)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.WORKING_MEM && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.WORKING_MEM)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.TIME_PLANS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.TIME_PLANS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.SCHEDULE && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.SCHEDULE)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.HABITS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.HABITS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.CHORES && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.CHORES)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.BIG_PLANS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.BIG_PLANS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.JOURNALS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.JOURNALS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.DOCS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.DOCS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.VACATIONS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.VACATIONS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.ASPECTS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.LIFE_PLAN)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.CHAPTERS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.LIFE_PLAN)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.MILESTONES && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.LIFE_PLAN)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.VISIONS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.LIFE_PLAN)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.PERSONS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.PRM)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.OCCASIONS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.PRM)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.CIRCLES && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.PRM)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.SMART_LISTS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.SMART_LISTS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.METRICS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.METRICS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.SLACK_TASKS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.SLACK_TASKS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.EMAIL_TASKS && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.EMAIL_TASKS)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.GAMIFICATION && isUserFeatureAvailable(user, import_webapi_client2.UserFeature.GAMIFICATION)) {
      inferredSyncTargets.push(syncTarget);
    } else if (syncTarget === import_webapi_client2.SyncTarget.LIFE_PLAN_EVAL && isWorkspaceFeatureAvailable(workspace, import_webapi_client2.WorkspaceFeature.LIFE_PLAN)) {
      inferredSyncTargets.push(syncTarget);
    }
  }
  return inferredSyncTargets;
}

// ../core/jupiter/core/common/component/sync-target-select.tsx
function SyncTargetSelect(props) {
  const allowedSyncTargets = inferSyncTargetsForEnabledFeatures(
    props.topLevelInfo.user,
    props.topLevelInfo.workspace,
    Object.values(import_webapi_client3.SyncTarget)
  );
  return /* @__PURE__ */ jsxDEV(
    Select_default,
    {
      labelId: props.labelId,
      name: props.name,
      readOnly: props.readOnly,
      disabled: props.readOnly,
      multiple: true,
      defaultValue: [],
      renderValue: (selected) => /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", flexWrap: "wrap", gap: 0.5 }, children: selected.map((value) => /* @__PURE__ */ jsxDEV(Chip_default, { label: syncTargetName(value) }, value, false, {
        fileName: "../core/jupiter/core/common/component/sync-target-select.tsx",
        lineNumber: 34,
        columnNumber: 13
      }, this)) }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/sync-target-select.tsx",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      label: props.label,
      children: allowedSyncTargets.map((st) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: st, children: syncTargetName(st) }, st, false, {
        fileName: "../core/jupiter/core/common/component/sync-target-select.tsx",
        lineNumber: 41,
        columnNumber: 9
      }, this))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/component/sync-target-select.tsx",
      lineNumber: 24,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/common/component/sync-target-tag.tsx
function SyncTargetTag(props) {
  const tagName = syncTargetName(props.target);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: "info" }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/sync-target-tag.tsx",
    lineNumber: 12,
    columnNumber: 10
  }, this);
}

export {
  SyncTargetSelect,
  SyncTargetTag
};
//# sourceMappingURL=/build/_shared/chunk-W4HWRPGM.js.map
