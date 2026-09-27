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
export const bigPlansRoutes: RouteConfigEntry[] = [
  route("big-plans", "routes/big-plans.tsx", { id: "apps/big-plans" }, [
    route("update-status", "routes/big-plans/update-status.tsx", {
      id: "apps/big-plans/update-status",
    }),
    route(":id", "routes/big-plans/$id.tsx", { id: "apps/big-plans/$id" }, [
      route(
        "inbox-tasks/:inboxTaskId",
        "routes/big-plans/$id/inbox-tasks/$inboxTaskId.tsx",
        { id: "apps/big-plans/$id/inbox-tasks/$inboxTaskId" },
      ),
      route(
        "milestones/:milestoneId",
        "routes/big-plans/$id/milestones/$milestoneId.tsx",
        { id: "apps/big-plans/$id/milestones/$milestoneId" },
      ),
      route("inbox-tasks/new", "routes/big-plans/$id/inbox-tasks/new.tsx", {
        id: "apps/big-plans/$id/inbox-tasks/new",
      }),
      route("milestones/new", "routes/big-plans/$id/milestones/new.tsx", {
        id: "apps/big-plans/$id/milestones/new",
      }),
    ]),
    route("new", "routes/big-plans/new.tsx", { id: "apps/big-plans/new" }),
  ]),
];
