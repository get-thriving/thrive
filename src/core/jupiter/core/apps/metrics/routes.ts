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
export const metricsRoutes: RouteConfigEntry[] = [
  route("metrics", "routes/metrics.tsx", { id: "apps/metrics" }, [
    route("no-parent/:id", "routes/metrics/no-parent/$id.tsx", {
      id: "apps/metrics/no-parent/$id",
    }),
    route(":id", "routes/metrics/$id.tsx", { id: "apps/metrics/$id" }, [
      route("entries/:entryId", "routes/metrics/$id/entries/$entryId.tsx", {
        id: "apps/metrics/$id/entries/$entryId",
      }),
      route("entries/new", "routes/metrics/$id/entries/new.tsx", {
        id: "apps/metrics/$id/entries/new",
      }),
      route("details", "routes/metrics/$id/details.tsx", {
        id: "apps/metrics/$id/details",
      }),
    ]),
    route("new", "routes/metrics/new.tsx", { id: "apps/metrics/new" }),
  ]),
];
