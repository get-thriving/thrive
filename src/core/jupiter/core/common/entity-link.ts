/**
 * Canonical `{theType}:{purpose}:{refId}` wire form (matches Python `EntityLink`).
 */
export function entityLinkStd(entityType: string, refId: string): string {
  return `${entityType}:std:${refId}`;
}

/** Parse a canonical entity link string into type, purpose, and ref id. */
export function parseEntityLink(link: string): {
  theType: string;
  purpose: string;
  refId: string;
} {
  const idxRef = link.lastIndexOf(":");
  if (idxRef <= 0) {
    throw new Error(`Invalid entity link: ${link}`);
  }
  const refId = link.slice(idxRef + 1);
  const rest = link.slice(0, idxRef);
  const idxPurpose = rest.lastIndexOf(":");
  if (idxPurpose <= 0) {
    throw new Error(`Invalid entity link: ${link}`);
  }
  const theType = rest.slice(0, idxPurpose);
  const purpose = rest.slice(idxPurpose + 1);
  if (!theType || !purpose || !refId) {
    throw new Error(`Invalid entity link: ${link}`);
  }
  return { theType, purpose, refId };
}

/** Parse a canonical std entity link string into type and ref id. */
export function parseEntityLinkStd(link: string): {
  theType: string;
  refId: string;
} {
  const { theType, purpose, refId } = parseEntityLink(link);
  if (purpose !== "std") {
    throw new Error(`Expected entity link purpose std, got ${purpose}`);
  }
  return { theType, refId };
}
