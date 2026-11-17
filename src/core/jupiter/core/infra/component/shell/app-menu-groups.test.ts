import { WorkspaceFeature } from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  appMenuGroups,
  type AppMenuInput,
} from "#/core/infra/component/shell/app-menu-groups";

const input: AppMenuInput = {
  isAvailable: () => true,
  gamification: true,
  communityUrl: "https://community.example",
  docsUrl: "https://docs.example",
};

function labels(overrides: Partial<AppMenuInput> = {}) {
  return appMenuGroups({ ...input, ...overrides }).map((group) => ({
    section: group.section,
    title: group.title,
    entries: group.entries.map((entry) => entry.label),
  }));
}

describe("appMenuGroups", () => {
  it("lists the apps first, then the pages, then the account's", () => {
    const sections = appMenuGroups(input).map((group) => group.section);
    expect(sections[0]).toBe("apps");
    expect(sections[sections.length - 1]).toBe("account");
    expect(sections.slice(1, -1).every((s) => s === "pages")).toBe(true);
  });

  it("has only the apps whose features are available", () => {
    const apps = labels({
      isAvailable: (features) => features.includes(WorkspaceFeature.HABITS),
    })[0].entries;
    expect(apps).toEqual(["Home", "Habits"]);
  });

  it("has the support and shared pages in their groups", () => {
    const groups = labels();
    const titles = groups
      .filter((g) => g.section === "pages")
      .map((g) => g.title);
    expect(titles).toEqual(["Tools", "Core", "Process"]);
    expect(groups.find((g) => g.title === "Core")?.entries).toContain(
      "Collaboration",
    );
  });

  it("lists a destination once, in the last place that has it", () => {
    const all = labels().flatMap((group) => group.entries);
    expect(all).toContain("Settings");
    expect(all).not.toContain("More Features");
    // The Explore group had only that one, so it is gone.
    expect(labels().map((g) => g.title)).not.toContain("Explore");
  });

  it("has what the right of the app bar has", () => {
    const account = labels().find((g) => g.section === "account");
    expect(account?.entries).toEqual([
      "Gamification",
      "Account",
      "Access",
      "Settings",
      "Community",
      "Help",
    ]);
  });

  it("leaves gamification out for a user without it", () => {
    const account = labels({ gamification: false }).find(
      (g) => g.section === "account",
    );
    expect(account?.entries).not.toContain("Gamification");
  });

  it("sends community and help off the app", () => {
    const account = appMenuGroups(input).find((g) => g.section === "account");
    const external = account?.entries.filter((entry) => entry.external);
    expect(external?.map((entry) => [entry.label, entry.to])).toEqual([
      ["Community", "https://community.example"],
      ["Help", "https://docs.example"],
    ]);
  });
});
