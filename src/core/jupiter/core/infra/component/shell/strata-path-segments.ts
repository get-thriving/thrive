const WORKSPACE_PREFIX = "/app/workspace";

// Path segments that only group routes and are not worth showing.
const HIDDEN_SEGMENTS = new Set(["apps", "root-redirect"]);

/**
 * The parts of a workspace URL worth showing in a path, e.g. `big-plans`, `1`;
 * none outside the workspace.
 */
export function strataPathSegments(pathname: string): string[] {
  if (!pathname.startsWith(WORKSPACE_PREFIX)) {
    return [];
  }
  return pathname
    .slice(WORKSPACE_PREFIX.length)
    .split("/")
    .filter((segment) => segment !== "" && !HIDDEN_SEGMENTS.has(segment));
}
