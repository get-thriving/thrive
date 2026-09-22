import { Difficulty, Schedulability } from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_SCHEDULING_EVENT_COUNT,
  DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
  DEFAULT_SCHEDULING_PARAMS,
  defaultSchedulingEventDurationMins,
  defaultSchedulingParamsFor,
  isSchedulable,
  schedulingEventCount,
  schedulingEventDurationMins,
  schedulingTotalDurationMins,
} from "#/core/common/scheduling-params";

const NOT_SCHEDULABLE = {
  schedulability: Schedulability.NOT_SCHEDULABLE,
  event_duration_mins: null,
  event_count: null,
};

describe("DEFAULT_SCHEDULING_PARAMS", () => {
  it("is schedulable, for one event of the default length", () => {
    expect(DEFAULT_SCHEDULING_PARAMS.event_duration_mins).toBe(
      DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
    );
    expect(DEFAULT_SCHEDULING_PARAMS.event_count).toBe(
      DEFAULT_SCHEDULING_EVENT_COUNT,
    );
  });
});

describe("defaultSchedulingEventDurationMins", () => {
  it("follows the difficulty of the work", () => {
    expect(defaultSchedulingEventDurationMins(Difficulty.EASY)).toBe(15);
    expect(defaultSchedulingEventDurationMins(Difficulty.MEDIUM)).toBe(30);
    expect(defaultSchedulingEventDurationMins(Difficulty.HARD)).toBe(60);
  });

  it("is the medium one with no difficulty to go by", () => {
    expect(defaultSchedulingEventDurationMins(null)).toBe(
      DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
    );
    expect(defaultSchedulingEventDurationMins(undefined)).toBe(
      DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
    );
    expect(DEFAULT_SCHEDULING_EVENT_DURATION_MINS).toBe(30);
  });
});

describe("defaultSchedulingParamsFor", () => {
  it("is one event as long as the difficulty suggests", () => {
    expect(defaultSchedulingParamsFor(Difficulty.HARD)).toEqual({
      schedulability: Schedulability.SCHEDULABLE,
      event_duration_mins: 60,
      event_count: 1,
    });
    expect(defaultSchedulingParamsFor(null)).toEqual(DEFAULT_SCHEDULING_PARAMS);
  });
});

describe("isSchedulable", () => {
  it("treats params that aren't there as schedulable", () => {
    expect(isSchedulable(undefined)).toBe(true);
    expect(isSchedulable(null)).toBe(true);
    expect(isSchedulable(DEFAULT_SCHEDULING_PARAMS)).toBe(true);
  });

  it("is false for something marked not schedulable", () => {
    expect(isSchedulable(NOT_SCHEDULABLE)).toBe(false);
  });
});

describe("schedulingEventCount", () => {
  it("is the count something schedulable carries", () => {
    expect(
      schedulingEventCount({
        schedulability: Schedulability.SCHEDULABLE,
        event_duration_mins: 30,
        event_count: 4,
      }),
    ).toBe(4);
  });

  it("is one when there are no params to consult", () => {
    expect(schedulingEventCount(null)).toBe(DEFAULT_SCHEDULING_EVENT_COUNT);
  });

  it("is zero for something not schedulable", () => {
    expect(schedulingEventCount(NOT_SCHEDULABLE)).toBe(0);
  });
});

describe("schedulingEventDurationMins", () => {
  it("is the duration something schedulable carries", () => {
    expect(
      schedulingEventDurationMins(
        {
          schedulability: Schedulability.SCHEDULABLE,
          event_duration_mins: 90,
          event_count: 1,
        },
        45,
      ),
    ).toBe(90);
  });

  it("falls back on the inferred duration with no params to consult", () => {
    expect(schedulingEventDurationMins(null, 45)).toBe(45);
  });
});

describe("schedulingTotalDurationMins", () => {
  it("multiplies the duration by the count", () => {
    expect(
      schedulingTotalDurationMins(
        {
          schedulability: Schedulability.SCHEDULABLE,
          event_duration_mins: 30,
          event_count: 4,
        },
        15,
      ),
    ).toBe(120);
  });

  it("is the inferred duration once with no params to consult", () => {
    expect(schedulingTotalDurationMins(null, 20)).toBe(20);
  });

  it("is zero for something not schedulable", () => {
    expect(schedulingTotalDurationMins(NOT_SCHEDULABLE, 60)).toBe(0);
  });
});
