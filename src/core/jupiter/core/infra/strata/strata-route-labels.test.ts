import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

/** Where the routes are: the apps' own, and those of the web UI. */
const SRC = resolve(import.meta.dirname, "../../../../..");
const ROUTE_ROOTS = [
  join(SRC, "core/jupiter/core/apps"),
  join(SRC, "webui/app/routes"),
];

function routeFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (name === "node_modules") {
      return [];
    }
    if (statSync(path).isDirectory()) {
      return routeFiles(path);
    }
    return path.endsWith(".tsx") ? [path] : [];
  });
}

/** The text of the `export const handle = { ... };` of a route, if it has one. */
function handleOf(source: string): string | null {
  const start = source.indexOf("export const handle = {\n");
  if (start === -1) {
    return null;
  }
  const end = source.indexOf("\n};", start);
  return end === -1 ? null : source.slice(start, end);
}

/**
 * Every route that is a column of the columns (ADR 0021) is a crumb of the
 * breadcrumb and the title of the phone, so it must say what it is called:
 * there is no falling back on the path (ADR 0020). The two routes of the
 * roots, which are not columns, are the only ones with a level and no label.
 */
describe("labels of the routes", () => {
  const handles = ROUTE_ROOTS.flatMap((root) => routeFiles(root))
    .map((path) => ({
      path: relative(SRC, path),
      handle: handleOf(readFileSync(path, "utf8")),
    }))
    .filter(
      (route): route is { path: string; handle: string } =>
        route.handle !== null,
    );

  it("finds the routes", () => {
    expect(handles.length).toBeGreaterThan(150);
  });

  it("gives each column route a label", () => {
    const missing = handles
      .filter(
        ({ handle }) =>
          !handle.includes("DisplayType.ROOT") && !/^ {2}label:/m.test(handle),
      )
      .map(({ path }) => path);
    expect(missing).toEqual([]);
  });
});
