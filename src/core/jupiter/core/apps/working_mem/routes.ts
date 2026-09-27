import type { RouteConfigEntry } from "@react-router/dev/routes";
import { relative } from "@react-router/dev/routes";

// `relative` resolves the files below against this directory, so the app owns
// its route modules instead of them living in the service that mounts it.
const { route } = relative(import.meta.dirname);

// Route ids default to the module's path, which for a file outside the
// service's app directory is an absolute one - that would put the building
// machine's paths in the client manifest. These are named instead, and the
// names stay put wherever the app is mounted.
const ID = "apps/working-mem";

/**
 * Where this app's pages sit is up to the service mounting them, so the paths
 * here are relative to whatever the caller nests them under.
 */
export const workingMemRoutes: RouteConfigEntry[] = [
  route("working-mem", "routes/working-mem.tsx", { id: ID }, [
    route("settings", "routes/working-mem/settings.tsx", {
      id: `${ID}/settings`,
    }),
  ]),
];
