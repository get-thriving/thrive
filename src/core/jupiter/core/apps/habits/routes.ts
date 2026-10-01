import type { RouteConfigEntry } from "@react-router/dev/routes";
import { relative } from "@react-router/dev/routes";

// `relative` resolves the files below against this directory, so the app owns
// its route modules instead of them living in the service that mounts it.
const { route } = relative(import.meta.dirname);

/**
 * Where this app's pages sit is up to the service mounting them, so the paths
 * here are relative to whatever the caller nests them under. Route ids are
 * named rather than derived: for a module outside the service's app directory
 * the derived id is an absolute path, which would end up in the client
 * manifest.
 */
export const habitsRoutes: RouteConfigEntry[] = [
  route("habits", "routes/habits.tsx", { id: "apps/habits" }, [
    route("habits", "routes/habits/habits.tsx", { id: "apps/habits/habits" }, [
      route(
        ":id",
        "routes/habits/habits/$id.tsx",
        {
          id: "apps/habits/habits/$id",
        },
        [
          route(
            "streak-inactive-periods/new",
            "routes/habits/habits/$id/streak-inactive-periods/new.tsx",
            { id: "apps/habits/habits/$id/streak-inactive-periods/new" },
          ),
          route(
            "streak-inactive-periods/reset",
            "routes/habits/habits/$id/streak-inactive-periods/reset.tsx",
            { id: "apps/habits/habits/$id/streak-inactive-periods/reset" },
          ),
          route(
            "streak-inactive-periods/:periodId",
            "routes/habits/habits/$id/streak-inactive-periods/$periodId.tsx",
            { id: "apps/habits/habits/$id/streak-inactive-periods/$periodId" },
          ),
        ],
      ),
      route("new", "routes/habits/habits/new.tsx", {
        id: "apps/habits/habits/new",
      }),
    ]),
    route("stacks", "routes/habits/stacks.tsx", { id: "apps/habits/stacks" }, [
      route(":id", "routes/habits/stacks/$id.tsx", {
        id: "apps/habits/stacks/$id",
      }),
      route("new", "routes/habits/stacks/new.tsx", {
        id: "apps/habits/stacks/new",
      }),
    ]),
  ]),
];
