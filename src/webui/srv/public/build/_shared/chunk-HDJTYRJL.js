// ../core/jupiter/core/common/entity-link.ts
function entityLinkStd(entityType, refId) {
  return `${entityType}:std:${refId}`;
}
function parseEntityLink(link) {
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
function parseEntityLinkStd(link) {
  const { theType, purpose, refId } = parseEntityLink(link);
  if (purpose !== "std") {
    throw new Error(`Expected entity link purpose std, got ${purpose}`);
  }
  return { theType, refId };
}

export {
  entityLinkStd,
  parseEntityLinkStd
};
//# sourceMappingURL=/build/_shared/chunk-HDJTYRJL.js.map
