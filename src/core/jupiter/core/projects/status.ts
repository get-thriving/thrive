import { ProjectStatus } from "@jupiter/webapi-client";

export function bigPlanStatusName(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.NOT_STARTED:
      return "Not Started";
    case ProjectStatus.IN_PROGRESS:
      return "In Progress";
    case ProjectStatus.BLOCKED:
      return "Blocked";
    case ProjectStatus.NOT_DONE:
      return "Not Done";
    case ProjectStatus.DONE:
      return "Done";
  }
}

export function bigPlanStatusIcon(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.NOT_STARTED:
      return "🔧";
    case ProjectStatus.IN_PROGRESS:
      return "🚧";
    case ProjectStatus.BLOCKED:
      return "🚧";
    case ProjectStatus.NOT_DONE:
      return "⛔";
    case ProjectStatus.DONE:
      return "✅";
  }
}

const PROJECT_STATUS_MAP = {
  [ProjectStatus.NOT_STARTED]: 0,
  [ProjectStatus.IN_PROGRESS]: 1,
  [ProjectStatus.BLOCKED]: 2,
  [ProjectStatus.NOT_DONE]: 3,
  [ProjectStatus.DONE]: 4,
};

export function compareProjectStatus(
  status1: ProjectStatus,
  status2: ProjectStatus,
): number {
  return PROJECT_STATUS_MAP[status1] - PROJECT_STATUS_MAP[status2];
}

export function isCompleted(status: ProjectStatus): boolean {
  return status === ProjectStatus.DONE || status === ProjectStatus.NOT_DONE;
}
