import { describe, expect, it } from "vitest";

import { strataPhoneTitle } from "#/core/infra/component/shell/strata-phone-title";
import type { StrataCrumb } from "#/core/infra/strata/strata-crumb";

const crumb = (label: string): StrataCrumb => ({ id: label, label, owner: 0 });

describe("strataPhoneTitle", () => {
  it("names the home page, which has no parts", () => {
    expect(strataPhoneTitle([])).toEqual({ trail: "thrive /", title: "Home" });
  });

  it("is the one part of a list, under the root", () => {
    expect(strataPhoneTitle([crumb("Habits")])).toEqual({
      trail: "thrive /",
      title: "Habits",
    });
  });

  it("is the last part, with the one before it above", () => {
    expect(strataPhoneTitle([crumb("Habits"), crumb("Buy milk")])).toEqual({
      trail: "Habits /",
      title: "Buy milk",
    });
    expect(
      strataPhoneTitle([crumb("Habits"), crumb("Buy milk"), crumb("New")]),
    ).toEqual({ trail: "Buy milk /", title: "New" });
  });
});
