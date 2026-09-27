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
export const prmRoutes: RouteConfigEntry[] = [
  route("prm/circles", "routes/prm/circles.tsx", { id: "apps/prm/circles" }, [
    route(":id", "routes/prm/circles/$id.tsx", { id: "apps/prm/circles/$id" }),
    route("new", "routes/prm/circles/new.tsx", { id: "apps/prm/circles/new" }),
  ]),
  route("prm/persons", "routes/prm/persons.tsx", { id: "apps/prm/persons" }, [
    route(":id", "routes/prm/persons/$id.tsx", { id: "apps/prm/persons/$id" }, [
      route(
        "occasions/:occasionId",
        "routes/prm/persons/$id/occasions/$occasionId.tsx",
        { id: "apps/prm/persons/$id/occasions/$occasionId" },
      ),
      route("occasions/new", "routes/prm/persons/$id/occasions/new.tsx", {
        id: "apps/prm/persons/$id/occasions/new",
      }),
    ]),
    route("new", "routes/prm/persons/new.tsx", { id: "apps/prm/persons/new" }),
  ]),
];
