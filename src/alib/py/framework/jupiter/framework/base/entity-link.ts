/**
 * Canonical `{theType}:{refId}:std` wire form for std links.
 * Matches Python `EntityLink` in `entity_link.py`.
 */
export function entityLinkStd(entityType: string, refId: string): string {
  return `${entityType}:${refId}:std`;
}
