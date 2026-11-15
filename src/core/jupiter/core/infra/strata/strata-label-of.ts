import type { StrataLabel } from "#/core/infra/strata/strata-label";

/** The label a route's `handle` declares, or null when it has none. */
export function strataLabelOf(handle: unknown): StrataLabel | null {
  if (typeof handle !== "object" || handle === null || !("label" in handle)) {
    return null;
  }
  const label = handle.label;
  return typeof label === "string" || typeof label === "function"
    ? (label as StrataLabel)
    : null;
}
