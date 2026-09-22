import type { SchedulingParams } from "@jupiter/webapi-client";
import { Difficulty, Schedulability } from "@jupiter/webapi-client";

import { inferDurationMinsFromDifficulty } from "#/core/common/difficulty";

export const MIN_SCHEDULING_EVENT_DURATION_MINS = 1;
export const MAX_SCHEDULING_EVENT_DURATION_MINS = 24 * 60;
export const MIN_SCHEDULING_EVENT_COUNT = 1;
export const MAX_SCHEDULING_EVENT_COUNT = 100;

// What something schedulable gets when it doesn't say otherwise. Anything
// schedulable takes up real time, so it always has a duration and at least one
// event - there is no "no hint" state to fall back from. The duration follows
// the difficulty of the work when there is one, and a medium one otherwise.
// Keep in step with scheduling_params.py.
export const DEFAULT_SCHEDULING_EVENT_DURATION_MINS =
  inferDurationMinsFromDifficulty(Difficulty.MEDIUM);
export const DEFAULT_SCHEDULING_EVENT_COUNT = 1;

/** How long one event is assumed to take, going by difficulty. */
export function defaultSchedulingEventDurationMins(
  difficulty: Difficulty | null | undefined,
): number {
  if (!difficulty) {
    return DEFAULT_SCHEDULING_EVENT_DURATION_MINS;
  }
  return inferDurationMinsFromDifficulty(difficulty);
}

/** What work of a given difficulty gets when nothing particular was asked for. */
export function defaultSchedulingParamsFor(
  difficulty: Difficulty | null | undefined,
): SchedulingParams {
  return {
    schedulability: Schedulability.SCHEDULABLE,
    event_duration_mins: defaultSchedulingEventDurationMins(difficulty),
    event_count: DEFAULT_SCHEDULING_EVENT_COUNT,
  };
}

/** What an entity gets when nothing particular was asked for. */
export const DEFAULT_SCHEDULING_PARAMS: SchedulingParams =
  defaultSchedulingParamsFor(null);

export function schedulabilityName(schedulability: Schedulability): string {
  switch (schedulability) {
    case Schedulability.SCHEDULABLE:
      return "Schedulable";
    case Schedulability.NOT_SCHEDULABLE:
      return "Not Schedulable";
  }
}

/**
 * Whether this can be placed in the calendar at all.
 *
 * Params that aren't there at all - nothing loaded that carries them - count
 * as schedulable, the way everything was before scheduling params existed.
 */
export function isSchedulable(
  params: SchedulingParams | null | undefined,
): boolean {
  if (!params) {
    return true;
  }
  return params.schedulability === Schedulability.SCHEDULABLE;
}

/** How many events are needed; none at all when it can't be scheduled. */
export function schedulingEventCount(
  params: SchedulingParams | null | undefined,
): number {
  if (!isSchedulable(params)) {
    return 0;
  }
  return params?.event_count ?? DEFAULT_SCHEDULING_EVENT_COUNT;
}

/**
 * How long one event should be.
 *
 * Something schedulable always carries a duration; the inferred one is for
 * whatever has no params to consult, where the difficulty is all there is.
 */
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
