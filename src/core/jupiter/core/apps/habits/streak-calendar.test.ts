import { InboxTaskStatus } from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  dayCellKind,
  inactiveReasonLabel,
  isInactiveOnDate,
  weekCellState,
} from "#/core/apps/habits/streak-calendar";

const periods = [
  {
    start_date: "2026-03-02",
    end_date: "2026-03-04",
    name: "recorded badly",
  },
  {
    start_date: "2026-03-04",
    end_date: "2026-03-05",
    name: "travel",
  },
];

describe("isInactiveOnDate", () => {
  it("covers the inclusive union of overlapping periods", () => {
    expect(isInactiveOnDate("2026-03-01", periods)).toBe(false);
    expect(isInactiveOnDate("2026-03-02", periods)).toBe(true);
    expect(isInactiveOnDate("2026-03-05", periods)).toBe(true);
    expect(isInactiveOnDate("2026-03-06", periods)).toBe(false);
  });

  it("ignores an archived period", () => {
    expect(
      isInactiveOnDate("2026-03-02", [{ ...periods[0], archived: true }]),
    ).toBe(false);
  });
});

describe("inactiveReasonLabel", () => {
  it("joins reasons from every period covering the day", () => {
    expect(inactiveReasonLabel("2026-03-04", periods)).toBe(
      "recorded badly, travel",
    );
    expect(inactiveReasonLabel("2026-03-02", periods)).toBe("recorded badly");
    expect(inactiveReasonLabel("2026-03-01", periods)).toBeNull();
  });
});

describe("dayCellKind", () => {
  it("prefers today, then future, then inactive, then doneness", () => {
    expect(
      dayCellKind({
        isToday: true,
        isFuture: false,
        isInactive: true,
        doneness: 100,
      }),
    ).toBe("today");
    expect(
      dayCellKind({
        isToday: false,
        isFuture: true,
        isInactive: true,
        doneness: 100,
      }),
    ).toBe("future");
    expect(
      dayCellKind({
        isToday: false,
        isFuture: false,
        isInactive: true,
        doneness: 100,
      }),
    ).toBe("inactive");
    expect(
      dayCellKind({
        isToday: false,
        isFuture: false,
        isInactive: false,
        doneness: 50,
      }),
    ).toBe("doneness");
    expect(
      dayCellKind({
        isToday: false,
        isFuture: false,
        isInactive: false,
        doneness: undefined,
      }),
    ).toBe("missing");
  });
});

describe("weekCellState", () => {
  const weekDays = [
    "2026-03-02",
    "2026-03-03",
    "2026-03-04",
    "2026-03-05",
    "2026-03-06",
    "2026-03-07",
    "2026-03-08",
  ];

  it("drops inactive days and scores the rest", () => {
    const state = weekCellState(
      weekDays,
      [
        {
          date: "2026-03-02",
          statuses: { a: InboxTaskStatus.NOT_DONE },
        },
        {
          date: "2026-03-06",
          statuses: { b: InboxTaskStatus.DONE },
        },
      ],
      periods,
    );

    expect(state.fullyInactive).toBe(false);
    expect(state.doneness).toBe(100);
  });

  it("is inactive when every day of the week is covered", () => {
    const state = weekCellState(
      ["2026-03-02", "2026-03-03", "2026-03-04"],
      [
        {
          date: "2026-03-02",
          statuses: { a: InboxTaskStatus.DONE },
        },
      ],
      [
        {
          start_date: "2026-03-01",
          end_date: "2026-03-10",
          name: null,
        },
      ],
    );

    expect(state).toEqual({ fullyInactive: true, doneness: undefined });
  });
});
