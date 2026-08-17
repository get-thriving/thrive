import type {
  ADate,
  InboxTask,
  RecurringTaskGenParams,
} from "@jupiter/webapi-client";
import { InboxTaskStatus } from "@jupiter/webapi-client";

import { aDateToDate } from "#/core/common/adate";
import {
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { upcomingDueDateFromGenParams } from "#/core/common/schedules";
import { inferTimeline } from "#/core/common/timeline";

export interface RecurringTargetPeriodProgress {
  generatedCount: number;
  doneCount: number;
  nextDueDate: ADate;
}

export function groupInboxTasksByOwnerRefId(
  inboxTasks: InboxTask[],
  namespace: string,
): Map<string, InboxTask[]> {
  const byOwner = new Map<string, InboxTask[]>();
  for (const inboxTask of inboxTasks) {
    if (parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) !== namespace) {
      continue;
    }
    const ownerRefId = entityLinkRefIdFromWire(inboxTask.owner);
    const existing = byOwner.get(ownerRefId) ?? [];
    existing.push(inboxTask);
    byOwner.set(ownerRefId, existing);
  }
  return byOwner;
}

export function recurringTargetPeriodProgress(
  inboxTasks: InboxTask[],
  genParams: RecurringTaskGenParams,
  today: ADate,
): RecurringTargetPeriodProgress {
  const timeline = inferTimeline(genParams.period, aDateToDate(today));
  const periodTasks = inboxTasks.filter(
    (inboxTask) => inboxTask.recurring_timeline === timeline,
  );

  return {
    generatedCount: periodTasks.length,
    doneCount: periodTasks.filter(
      (inboxTask) => inboxTask.status === InboxTaskStatus.DONE,
    ).length,
    nextDueDate: upcomingDueDateFromGenParams(genParams, today),
  };
}
