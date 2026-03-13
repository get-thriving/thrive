import {
  type User,
  type Workspace,
  SyncTarget,
  WorkspaceFeature,
  UserFeature,
} from "@jupiter/webapi-client";

import { isUserFeatureAvailable } from "#/core/users/root";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

export function inferSyncTargetsForEnabledFeatures(
  user: User,
  workspace: Workspace,
  syncTargets: Array<SyncTarget>,
): Array<SyncTarget> {
  // Keep in sync with python:core:infer_sync_targets_for_enabled_features
  const inferredSyncTargets: Array<SyncTarget> = [];

  for (const syncTarget of syncTargets) {
    if (
      syncTarget === SyncTarget.INBOX_TASKS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.INBOX_TASKS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.WORKING_MEM &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.WORKING_MEM)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.TIME_PLANS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.TIME_PLANS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.SCHEDULE &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.SCHEDULE)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.HABITS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.HABITS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.CHORES &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.CHORES)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.BIG_PLANS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.BIG_PLANS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.JOURNALS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.JOURNALS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.DOCS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.DOCS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.VACATIONS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.VACATIONS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.ASPECTS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.CHAPTERS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.MILESTONES &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.VISIONS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.PERSONS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.PRM)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.OCCASIONS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.PRM)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.CIRCLES &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.PRM)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.SMART_LISTS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.SMART_LISTS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.METRICS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.METRICS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.SLACK_TASKS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.SLACK_TASKS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.EMAIL_TASKS &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.EMAIL_TASKS)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.GAMIFICATION &&
      isUserFeatureAvailable(user, UserFeature.GAMIFICATION)
    ) {
      inferredSyncTargets.push(syncTarget);
    } else if (
      syncTarget === SyncTarget.LIFE_PLAN_EVAL &&
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)
    ) {
      inferredSyncTargets.push(syncTarget);
    }
  }

  return inferredSyncTargets;
}
