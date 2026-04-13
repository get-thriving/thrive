/**
 * Canonical `{theType}:{refId}:std` wire form for std links.
 * Matches Python `EntityLink` in `entity_link.py`.
 */
export function entityLinkStd(entityType: string, refId: string): string {
  return `${entityType}:${refId}:std`;
}

/** Parse a canonical std entity link string into type and ref id. */
export function parseEntityLinkStd(link: string): {
  theType: string;
  refId: string;
} {
  const suffix = ":std";
  if (!link.endsWith(suffix)) {
    throw new Error(`Expected entity link to end with ${suffix}, got ${link}`);
  }
  const withoutPurpose = link.slice(0, -suffix.length);
  const colonIdx = withoutPurpose.indexOf(":");
  if (colonIdx <= 0 || colonIdx === withoutPurpose.length - 1) {
    throw new Error(`Invalid entity link: ${link}`);
  }
  return {
    theType: withoutPurpose.slice(0, colonIdx),
    refId: withoutPurpose.slice(colonIdx + 1),
  };
}
