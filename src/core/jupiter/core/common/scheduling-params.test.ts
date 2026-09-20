import { Schedulability } from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_SCHEDULING_PARAMS,
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

describe("isSchedulable", () => {
  it("treats missing params as schedulable", () => {
    expect(isSchedulable(undefined)).toBe(true);
    expect(isSchedulable(null)).toBe(true);
    expect(isSchedulable(DEFAULT_SCHEDULING_PARAMS)).toBe(true);
  });

  it("is false for something marked not schedulable", () => {
    expect(isSchedulable(NOT_SCHEDULABLE)).toBe(false);
  });
});

describe("schedulingEventCount", () => {
  it("is one when there's no hint", () => {
    expect(schedulingEventCount(DEFAULT_SCHEDULING_PARAMS)).toBe(1);
  });

  it("is the hint when there is one", () => {
    expect(
      schedulingEventCount({
        schedulability: Schedulability.SCHEDULABLE,
        event_duration_mins: null,
        event_count: 4,
      }),
    ).toBe(4);
  });

  it("is zero for something not schedulable", () => {
    expect(schedulingEventCount(NOT_SCHEDULABLE)).toBe(0);
  });
});

describe("schedulingEventDurationMins", () => {
  it("falls back on the inferred duration", () => {
    expect(schedulingEventDurationMins(DEFAULT_SCHEDULING_PARAMS, 45)).toBe(45);
  });

  it("prefers the hint", () => {
    expect(
      schedulingEventDurationMins(
        {
          schedulability: Schedulability.SCHEDULABLE,
          event_duration_mins: 90,
          event_count: null,
        },
        45,
      ),
    ).toBe(90);
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

  it("multiplies the inferred duration too", () => {
    expect(
      schedulingTotalDurationMins(
        {
          schedulability: Schedulability.SCHEDULABLE,
          event_duration_mins: null,
          event_count: 3,
        },
        20,
      ),
    ).toBe(60);
  });

  it("is zero for something not schedulable", () => {
    expect(schedulingTotalDurationMins(NOT_SCHEDULABLE, 60)).toBe(0);
  });
});
