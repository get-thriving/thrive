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
export const vacationsRoutes: RouteConfigEntry[] = [
  route("vacations", "routes/vacations.tsx", { id: "apps/vacations" }, [
    route(
      "wish-list",
      "routes/vacations/wish-list.tsx",
      { id: "apps/vacations/wish-list" },
      [
        route(":id", "routes/vacations/wish-list/$id.tsx", {
          id: "apps/vacations/wish-list/$id",
        }),
        route("new", "routes/vacations/wish-list/new.tsx", {
          id: "apps/vacations/wish-list/new",
        }),
      ],
    ),
    route(
      "vacation",
      "routes/vacations/vacation.tsx",
      { id: "apps/vacations/vacation" },
      [
        route("new-from-wish", "routes/vacations/vacation/new-from-wish.tsx", {
          id: "apps/vacations/vacation/new-from-wish",
        }),
        route(":id", "routes/vacations/vacation/$id.tsx", {
          id: "apps/vacations/vacation/$id",
        }),
        route("new", "routes/vacations/vacation/new.tsx", {
          id: "apps/vacations/vacation/new",
        }),
      ],
    ),
  ]),
];
