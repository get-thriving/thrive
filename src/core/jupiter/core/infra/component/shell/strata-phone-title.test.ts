import { describe, expect, it } from "vitest";

import { strataPhoneTitle } from "#/core/infra/component/shell/strata-phone-title";

describe("strataPhoneTitle", () => {
  it("names the home page", () => {
    expect(strataPhoneTitle("/app/workspace")).toEqual({
      trail: "thrive /",
      title: "Home",
    });
  });

  it("says an app and its list once, and leaves out the ids", () => {
    expect(strataPhoneTitle("/app/workspace/apps/habits/habits")).toEqual({
      trail: "thrive /",
      title: "habits",
    });
    expect(strataPhoneTitle("/app/workspace/apps/habits/habits/3")).toEqual({
      trail: "thrive /",
      title: "habits",
    });
  });

  it("puts the part before the title above it", () => {
    expect(
      strataPhoneTitle(
        "/app/workspace/apps/habits/habits/3/streak-inactive-periods/new",
      ),
    ).toEqual({ trail: "streak-inactive-periods /", title: "new" });
  });

  it("says nothing of pages outside the workspace", () => {
    expect(strataPhoneTitle("/login")).toEqual({
      trail: "thrive /",
      title: "Home",
    });
  });
});
