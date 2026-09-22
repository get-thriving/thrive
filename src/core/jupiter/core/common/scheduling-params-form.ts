/**
 * What the scheduling params block posts, and the args it makes.
 */
import { Schedulability } from "@jupiter/webapi-client";
import { z } from "zod";

import {
  DEFAULT_SCHEDULING_EVENT_COUNT,
  DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
} from "#/core/common/scheduling-params";

/** The fields the scheduling params block posts. Spread into a form schema. */
export const SchedulingParamsFormFields = {
  schedulability: z.nativeEnum(Schedulability).optional(),
  schedulingEventDurationMins: z.string().optional(),
  schedulingEventCount: z.string().optional(),
};

export interface SchedulingParamsFormValues {
  schedulability?: Schedulability;
  schedulingEventDurationMins?: string;
  schedulingEventCount?: string;
}

interface SchedulingParamsCreateArgs {
  schedulability?: Schedulability;
  scheduling_event_duration_mins?: number;
  scheduling_event_count?: number;
}

interface UpdateActionOf<T> {
  should_change: boolean;
  value?: T;
}

interface SchedulingParamsUpdateArgs {
  schedulability: UpdateActionOf<Schedulability>;
  scheduling_event_duration_mins: UpdateActionOf<number | null>;
  scheduling_event_count: UpdateActionOf<number | null>;
}

function intOrUndefined(value: string | undefined): number | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * The scheduling part of a create command's args.
 *
 * Anything schedulable needs a duration and at least one event, so a form
 * that leaves either blank sends the default rather than nothing.
 */
export function schedulingParamsCreateArgs(
  form: SchedulingParamsFormValues,
): SchedulingParamsCreateArgs {
  if (form.schedulability === Schedulability.NOT_SCHEDULABLE) {
    return { schedulability: form.schedulability };
  }
  return {
    schedulability: form.schedulability,
    scheduling_event_duration_mins:
      intOrUndefined(form.schedulingEventDurationMins) ??
      DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
    scheduling_event_count:
      intOrUndefined(form.schedulingEventCount) ??
      DEFAULT_SCHEDULING_EVENT_COUNT,
  };
}

/**
 * The scheduling part of an update command's args.
 *
 * The block posts every field it shows, so a form that carries it always
 * says what the scheduling params should become. A form that doesn't carry
 * it - schedulability left undefined - changes nothing.
 */
export function schedulingParamsUpdateArgs(
  form: SchedulingParamsFormValues,
): SchedulingParamsUpdateArgs {
  if (form.schedulability === undefined) {
    return {
      schedulability: { should_change: false },
      scheduling_event_duration_mins: { should_change: false },
      scheduling_event_count: { should_change: false },
    };
  }
  if (form.schedulability === Schedulability.NOT_SCHEDULABLE) {
    return {
      schedulability: { should_change: true, value: form.schedulability },
      scheduling_event_duration_mins: { should_change: true, value: null },
      scheduling_event_count: { should_change: true, value: null },
    };
  }
  return {
    schedulability: { should_change: true, value: form.schedulability },
    scheduling_event_duration_mins: {
      should_change: true,
      value:
        intOrUndefined(form.schedulingEventDurationMins) ??
        DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
    },
    scheduling_event_count: {
      should_change: true,
      value:
        intOrUndefined(form.schedulingEventCount) ??
        DEFAULT_SCHEDULING_EVENT_COUNT,
    },
  };
}

/** The scheduling part of an update command that leaves it alone. */
export function noSchedulingParamsUpdateArgs(): SchedulingParamsUpdateArgs {
  return {
    schedulability: { should_change: false },
    scheduling_event_duration_mins: { should_change: false },
    scheduling_event_count: { should_change: false },
  };
}
