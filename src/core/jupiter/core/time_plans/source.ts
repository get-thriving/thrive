import { TimePlanSource } from "@jupiter/webapi-client";

export function timePlanSourceName(source: TimePlanSource): string {
  switch (source) {
    case TimePlanSource.TODO:
      return "User";
    case TimePlanSource.GENERATED:
      return "Recurring";
  }
}

export function allowUserChanges(source: TimePlanSource): boolean {
  // Keep synced with python:time-plan-source.py
  return source === TimePlanSource.TODO;
}
