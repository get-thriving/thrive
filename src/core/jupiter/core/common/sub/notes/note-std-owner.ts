import type { NamedEntityTag } from "@jupiter/webapi-client";

/** Canonical ``std`` owner link for API payloads: ``{theType}:std:{refId}``. */
export function noteStdOwner(entityTag: NamedEntityTag, refId: string): string {
  return `${entityTag}:std:${refId}`;
}
