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
export const smartListsRoutes: RouteConfigEntry[] = [
  route("smart-lists", "routes/smart-lists.tsx", { id: "apps/smart-lists" }, [
    route("no-parent/:id", "routes/smart-lists/no-parent/$id.tsx", {
      id: "apps/smart-lists/no-parent/$id",
    }),
    route(":id", "routes/smart-lists/$id.tsx", { id: "apps/smart-lists/$id" }, [
      route(":itemId", "routes/smart-lists/$id/$itemId.tsx", {
        id: "apps/smart-lists/$id/$itemId",
      }),
      route("details", "routes/smart-lists/$id/details.tsx", {
        id: "apps/smart-lists/$id/details",
      }),
      route("new", "routes/smart-lists/$id/new.tsx", {
        id: "apps/smart-lists/$id/new",
      }),
    ]),
    route("new", "routes/smart-lists/new.tsx", { id: "apps/smart-lists/new" }),
  ]),
];
