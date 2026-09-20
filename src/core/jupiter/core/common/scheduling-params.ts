import type { SchedulingParams } from "@jupiter/webapi-client";
import { Schedulability } from "@jupiter/webapi-client";

export const MIN_SCHEDULING_EVENT_DURATION_MINS = 1;
export const MAX_SCHEDULING_EVENT_DURATION_MINS = 24 * 60;
export const MIN_SCHEDULING_EVENT_COUNT = 1;
export const MAX_SCHEDULING_EVENT_COUNT = 100;

/** What an entity gets when nothing particular was asked for. */
export const DEFAULT_SCHEDULING_PARAMS: SchedulingParams = {
  schedulability: Schedulability.SCHEDULABLE,
  event_duration_mins: null,
  event_count: null,
};

export function schedulabilityName(schedulability: Schedulability): string {
  switch (schedulability) {
    case Schedulability.SCHEDULABLE:
      return "Schedulable";
    case Schedulability.NOT_SCHEDULABLE:
      return "Not Schedulable";
  }
}

export function isSchedulable(
  params: SchedulingParams | null | undefined,
): boolean {
  if (!params) {
    return true;
  }
  return params.schedulability === Schedulability.SCHEDULABLE;
}

/** How many events are needed, assuming one when there's no hint. */
export function schedulingEventCount(
  params: SchedulingParams | null | undefined,
): number {
  if (!isSchedulable(params)) {
    return 0;
  }
  return params?.event_count ?? 1;
}

/** How long one event should be, falling back on an inferred duration. */
export function schedulingEventDurationMins(
  params: SchedulingParams | null | undefined,
  inferredDurationMins: number,
): number {
  return params?.event_duration_mins ?? inferredDurationMins;
}

/** How much time is required in total, over all the events needed. */
export function schedulingTotalDurationMins(
  params: SchedulingParams | null | undefined,
  inferredDurationMins: number,
): number {
  if (!isSchedulable(params)) {
    return 0;
  }
  return (
    schedulingEventDurationMins(params, inferredDurationMins) *
    schedulingEventCount(params)
  );
}
