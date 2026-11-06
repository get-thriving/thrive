import { describe, expect, it } from "vitest";

import { selectKeyHabitStreakEntries } from "#/core/apps/habits/streak";

const entry = (refId: string) => ({ habit: { ref_id: refId }, marks: [refId] });

describe("selectKeyHabitStreakEntries", () => {
  const entries = [entry("1"), entry("2"), entry("3")];

  it("follows the order the widget was set up with, not the order of the entries", () => {
    expect(selectKeyHabitStreakEntries(entries, ["3", "1"])).toEqual([
      entry("3"),
      entry("1"),
    ]);
  });

  it("only shows the habits the widget points at", () => {
    expect(selectKeyHabitStreakEntries(entries, ["2"])).toEqual([entry("2")]);
  });

  it("leaves out a habit that has no entry", () => {
    expect(selectKeyHabitStreakEntries(entries, ["9", "2", "8"])).toEqual([
      entry("2"),
    ]);
  });

  it("shows nothing for a widget with no habits", () => {
    expect(selectKeyHabitStreakEntries(entries, [])).toEqual([]);
  });

  it("serves two widgets with different habits from the same entries", () => {
    expect(
      selectKeyHabitStreakEntries(entries, ["1", "2"]).map(
        (e) => e.habit.ref_id,
      ),
    ).toEqual(["1", "2"]);
    expect(
      selectKeyHabitStreakEntries(entries, ["3", "2"]).map(
        (e) => e.habit.ref_id,
      ),
    ).toEqual(["3", "2"]);
  });
});
