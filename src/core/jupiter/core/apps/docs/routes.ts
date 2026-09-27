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
export const docsRoutes: RouteConfigEntry[] = [
  route("docs", "routes/docs.tsx", { id: "apps/docs" }, [
    route("no-parent/:docId", "routes/docs/no-parent/$docId.tsx", {
      id: "apps/docs/no-parent/$docId",
    }),
    route("create-action", "routes/docs/create-action.tsx", {
      id: "apps/docs/create-action",
    }),
    route("root-redirect", "routes/docs/root-redirect.tsx", {
      id: "apps/docs/root-redirect",
    }),
    route("update-action", "routes/docs/update-action.tsx", {
      id: "apps/docs/update-action",
    }),
    route(":dirId", "routes/docs/$dirId.tsx", { id: "apps/docs/$dirId" }, [
      route(
        "doc/:docId",
        "routes/docs/$dirId/doc/$docId.tsx",
        { id: "apps/docs/$dirId/doc/$docId" },
        [
          route("settings", "routes/docs/$dirId/doc/$docId/settings.tsx", {
            id: "apps/docs/$dirId/doc/$docId/settings",
          }),
        ],
      ),
      route("settings", "routes/docs/$dirId/settings.tsx", {
        id: "apps/docs/$dirId/settings",
      }),
      route("doc/new", "routes/docs/$dirId/doc/new.tsx", {
        id: "apps/docs/$dirId/doc/new",
      }),
      route("new", "routes/docs/$dirId/new.tsx", {
        id: "apps/docs/$dirId/new",
      }),
    ]),
  ]),
];
