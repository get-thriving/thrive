/** Canonical ``{theType}:{refId}:std`` wire form for :class:`EntityLink` std owners. */
export function entityLinkStd(entityType: string, refId: string): string {
  return `${entityType}:${refId}:std`;
}
