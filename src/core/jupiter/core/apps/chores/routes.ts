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
export const choresRoutes: RouteConfigEntry[] = [
  route("chores", "routes/chores.tsx", { id: "apps/chores" }, [
    route("chores", "routes/chores/chores.tsx", { id: "apps/chores/chores" }, [
      route(":id", "routes/chores/chores/$id.tsx", {
        id: "apps/chores/chores/$id",
      }),
      route("new", "routes/chores/chores/new.tsx", {
        id: "apps/chores/chores/new",
      }),
    ]),
    route("stacks", "routes/chores/stacks.tsx", { id: "apps/chores/stacks" }, [
      route(":id", "routes/chores/stacks/$id.tsx", {
        id: "apps/chores/stacks/$id",
      }),
      route("new", "routes/chores/stacks/new.tsx", {
        id: "apps/chores/stacks/new",
      }),
    ]),
  ]),
];
