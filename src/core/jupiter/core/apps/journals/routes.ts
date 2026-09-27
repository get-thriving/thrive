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
export const journalsRoutes: RouteConfigEntry[] = [
  route("journals", "routes/journals.tsx", { id: "apps/journals" }, [
    route(
      "questions",
      "routes/journals/questions.tsx",
      { id: "apps/journals/questions" },
      [
        route(":id", "routes/journals/questions/$id.tsx", {
          id: "apps/journals/questions/$id",
        }),
        route("new", "routes/journals/questions/new.tsx", {
          id: "apps/journals/questions/new",
        }),
      ],
    ),
    route("settings", "routes/journals/settings.tsx", {
      id: "apps/journals/settings",
    }),
    route(":id", "routes/journals/$id.tsx", { id: "apps/journals/$id" }),
    route("new", "routes/journals/new.tsx", { id: "apps/journals/new" }),
  ]),
];
