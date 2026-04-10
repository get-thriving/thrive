import type { NamedEntityTag } from "@jupiter/webapi-client";

/** Canonical ``std`` owner link for API payloads: ``{theType}:{refId}:std``. */
export function noteStdOwner(entityTag: NamedEntityTag, refId: string): string {
  return `${entityTag}:${refId}:std`;
}
