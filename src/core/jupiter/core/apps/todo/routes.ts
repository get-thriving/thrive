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
export const todosRoutes: RouteConfigEntry[] = [
  route("todos", "routes/todos.tsx", { id: "apps/todos" }, [
    route(":id", "routes/todos/$id.tsx", { id: "apps/todos/$id" }),
    route("new", "routes/todos/new.tsx", { id: "apps/todos/new" }),
  ]),
];
