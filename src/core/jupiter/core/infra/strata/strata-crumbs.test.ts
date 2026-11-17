import { describe, expect, it } from "vitest";

import { DisplayType } from "#/core/infra/component/use-nested-entities";
import {
  strataCrumbs,
  type StrataCrumbMatch,
} from "#/core/infra/strata/strata-crumbs";
import { strataEntityLabel } from "#/core/infra/strata/strata-entity-label";

function match(
  id: string,
  pathname: string,
  handle: unknown = undefined,
  loaderData: unknown = undefined,
): StrataCrumbMatch {
  return { id, pathname, params: {}, loaderData, handle };
}

const HABITS = "/app/workspace/apps/habits";

describe("strataCrumbs", () => {
  it("has a part for each route with a label, not for layout routes", () => {
    const crumbs = strataCrumbs([
      match("root", "/"),
      match("routes/app/workspace", "/app/workspace"),
      match("apps/habits", HABITS),
      match("apps/habits/habits", `${HABITS}/habits`, {
        displayType: DisplayType.TRUNK,
        label: "Habits",
      }),
      match(
        "apps/habits/habits/$id",
        `${HABITS}/habits/3`,
        {
          displayType: DisplayType.LEAF,
          label: ({ loaderData }: { loaderData: unknown }) =>
            (loaderData as { habit: { name: string } }).habit.name,
        },
        { habit: { name: "Buy milk" } },
      ),
    ]);
    expect(crumbs.map((crumb) => crumb.label)).toEqual(["Habits", "Buy milk"]);
  });

  it("says the app once, not as the app and its list", () => {
    const labels = strataCrumbs([
      match("apps/habits", HABITS),
      match("apps/habits/habits", `${HABITS}/habits`, {
        displayType: DisplayType.TRUNK,
        label: "Habits",
      }),
    ]).map((crumb) => crumb.label);
    expect(labels).toEqual(["Habits"]);
  });

  it("gives each part to the panel that is its route", () => {
    const crumbs = strataCrumbs([
      match("trunk", `${HABITS}/habits`, {
        displayType: DisplayType.TRUNK,
        label: "Habits",
      }),
      match("leaf", `${HABITS}/habits/3`, {
        displayType: DisplayType.LEAF,
        label: "Habit",
      }),
      match("leaflet", `${HABITS}/habits/3/new`, {
        displayType: DisplayType.LEAFLET,
        label: "New",
      }),
    ]);
    expect(crumbs.map((crumb) => crumb.owner)).toEqual([0, 1, 2]);
  });

  it("gives a part that is no panel to the next panel, or the last", () => {
    const before = strataCrumbs([
      match("group", "/app/workspace/g", { label: "Group" }),
      match("trunk", "/app/workspace/g/list", {
        displayType: DisplayType.TRUNK,
        label: "List",
      }),
    ]);
    expect(before.map((crumb) => crumb.owner)).toEqual([0, 0]);
    const after = strataCrumbs([
      match("trunk", "/app/workspace/g", {
        displayType: DisplayType.TRUNK,
        label: "List",
      }),
      match("tail", "/app/workspace/g/t", { label: "Tail" }),
    ]);
    expect(after.map((crumb) => crumb.owner)).toEqual([0, 0]);
  });

  it("has no column for a part when there are no panels", () => {
    expect(
      strataCrumbs([match("x", "/app/workspace/x", { label: "X" })]).map(
        (crumb) => crumb.owner,
      ),
    ).toEqual([-1]);
  });

  it("falls back to what the url ends with when a label cannot be said", () => {
    const crumbs = strataCrumbs([
      match("leaf", `${HABITS}/habits/3`, {
        displayType: DisplayType.LEAF,
        label: () => null,
      }),
    ]);
    expect(crumbs[0].label).toBe("3");
  });

  it("works out the label of an entity from what it loaded", () => {
    const [crumb] = strataCrumbs([
      match(
        "leaf",
        `${HABITS}/habits/3`,
        { displayType: DisplayType.LEAF, label: strataEntityLabel("Habit") },
        { allTags: [], habit: { ref_id: "3", name: "Buy milk" } },
      ),
    ]);
    expect(crumb.label).toBe("Buy milk");
  });

  it("says what an entity is and its id when the data is not there", () => {
    const [crumb] = strataCrumbs([
      match("leaf", `${HABITS}/habits/3`, {
        displayType: DisplayType.LEAF,
        label: strataEntityLabel("Habit"),
      }),
    ]);
    expect(crumb.label).toBe("Habit 3");
  });
});
