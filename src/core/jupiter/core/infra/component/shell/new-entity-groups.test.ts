import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { WorkspaceFeature } from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import { NEW_ENTITY_CATALOG } from "#/core/infra/component/shell/new-entity-catalog";
import { newEntityGroups } from "#/core/infra/component/shell/new-entity-groups";

const labels = (isAvailable: (features: WorkspaceFeature[]) => boolean) =>
  newEntityGroups({ isAvailable }).flatMap((group) =>
    group.entries.map((entry) => entry.label),
  );

describe("newEntityGroups", () => {
  it("has every kind when every feature is available", () => {
    expect(labels(() => true)).toHaveLength(
      NEW_ENTITY_CATALOG.flatMap((group) => group.entries).length,
    );
  });

  it("has only the apps whose features are available, and what is not gated", () => {
    const found = labels((features) =>
      features.includes(WorkspaceFeature.HABITS),
    );
    expect(found).toContain("Habit");
    expect(found).toContain("Habit stack");
    expect(found).toContain("Tag");
    expect(found).not.toContain("Todo");
    expect(found).not.toContain("Chore");
  });

  it("lists a label and a page once", () => {
    const entries = NEW_ENTITY_CATALOG.flatMap((group) => group.entries);
    expect(new Set(entries.map((entry) => entry.label)).size).toBe(
      entries.length,
    );
    expect(new Set(entries.map((entry) => entry.to)).size).toBe(entries.length);
  });

  it("leads only to pages that are for creating", () => {
    for (const group of NEW_ENTITY_CATALOG) {
      for (const entry of group.entries) {
        expect(entry.to).toMatch(/^\/app\/workspace\/.+\/new$/);
      }
    }
  });
});

// The `new` pages of the apps are named by route ids that follow the url
// (`apps/habits/habits/new`), and the ones that need something open have a
// parameter in theirs (`apps/metrics/$id/entries/new`).
function newRouteIdsOfApps(): string[] {
  const apps = join(import.meta.dirname, "../../../apps");
  const ids: string[] = [];
  for (const app of readdirSync(apps, { withFileTypes: true })) {
    if (!app.isDirectory()) {
      continue;
    }
    let source: string;
    try {
      source = readFileSync(join(apps, app.name, "routes.ts"), "utf8");
    } catch {
      continue;
    }
    for (const match of source.matchAll(/id:\s*"(apps\/[^"]*\/new)"/g)) {
      ids.push(match[1]);
    }
  }
  return ids;
}

describe("the catalog of new items", () => {
  it("has every new page of the apps that needs nothing else open", () => {
    const listed = new Set(
      NEW_ENTITY_CATALOG.flatMap((group) => group.entries).map(
        (entry) => entry.to,
      ),
    );
    const standalone = newRouteIdsOfApps().filter((id) => !id.includes("$"));
    expect(standalone.length).toBeGreaterThan(10);
    const missing = standalone.filter(
      (id) => !listed.has(`/app/workspace/${id}`),
    );
    expect(missing).toEqual([]);
  });
});
