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
export const lifePlanRoutes: RouteConfigEntry[] = [
  route("life-plan", "routes/life-plan.tsx", { id: "apps/life-plan" }, [
    route("history-of-work", "routes/life-plan/history-of-work.tsx", {
      id: "apps/life-plan/history-of-work",
    }),
    route(
      "milestones",
      "routes/life-plan/milestones.tsx",
      { id: "apps/life-plan/milestones" },
      [
        route(":id", "routes/life-plan/milestones/$id.tsx", {
          id: "apps/life-plan/milestones/$id",
        }),
        route("new", "routes/life-plan/milestones/new.tsx", {
          id: "apps/life-plan/milestones/new",
        }),
      ],
    ),
    route(
      "chapters",
      "routes/life-plan/chapters.tsx",
      { id: "apps/life-plan/chapters" },
      [
        route(":id", "routes/life-plan/chapters/$id.tsx", {
          id: "apps/life-plan/chapters/$id",
        }),
        route("new", "routes/life-plan/chapters/new.tsx", {
          id: "apps/life-plan/chapters/new",
        }),
      ],
    ),
    route("settings", "routes/life-plan/settings.tsx", {
      id: "apps/life-plan/settings",
    }),
    route(
      "aspects",
      "routes/life-plan/aspects.tsx",
      { id: "apps/life-plan/aspects" },
      [
        route(":id", "routes/life-plan/aspects/$id.tsx", {
          id: "apps/life-plan/aspects/$id",
        }),
        route("new", "routes/life-plan/aspects/new.tsx", {
          id: "apps/life-plan/aspects/new",
        }),
      ],
    ),
    route(
      "visions",
      "routes/life-plan/visions.tsx",
      { id: "apps/life-plan/visions" },
      [
        route("new-draft", "routes/life-plan/visions/new-draft.tsx", {
          id: "apps/life-plan/visions/new-draft",
        }),
        route(":id", "routes/life-plan/visions/$id.tsx", {
          id: "apps/life-plan/visions/$id",
        }),
      ],
    ),
    route(
      "goals",
      "routes/life-plan/goals.tsx",
      { id: "apps/life-plan/goals" },
      [
        route(":id", "routes/life-plan/goals/$id.tsx", {
          id: "apps/life-plan/goals/$id",
        }),
        route("new", "routes/life-plan/goals/new.tsx", {
          id: "apps/life-plan/goals/new",
        }),
      ],
    ),
  ]),
];
