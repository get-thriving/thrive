import { describe, expect, it } from "vitest";

import { strataTrunkTitle } from "#/core/infra/strata/strata-trunk-title";

const entries = [
  { label: "Home", to: "/app/workspace" },
  { label: "Habits", to: "/app/workspace/apps/habits" },
  { label: "Inbox Tasks", to: "/app/workspace/core/inbox-tasks" },
];

describe("strataTrunkTitle", () => {
  it("names the entry of the place the trunk is in", () => {
    expect(strataTrunkTitle("/app/workspace/apps/habits/habits", entries)).toBe(
      "Habits",
    );
    expect(strataTrunkTitle("/app/workspace/core/inbox-tasks", entries)).toBe(
      "Inbox Tasks",
    );
  });

  it("takes the longest entry the path is under", () => {
    expect(
      strataTrunkTitle("/app/workspace/apps/habits/habits", entries),
    ).not.toBe("Home");
  });

  it("does not take an entry that only starts the same way", () => {
    expect(strataTrunkTitle("/app/workspace/apps/habitsx", entries)).toBe(
      "Home",
    );
  });

  it("is the list when no entry covers the path", () => {
    expect(strataTrunkTitle("/elsewhere", entries)).toBe("List");
  });
});
