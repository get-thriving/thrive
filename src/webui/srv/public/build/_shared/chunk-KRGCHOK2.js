import {
  useMatches
} from "/build/_shared/chunk-VVGD4GL7.js";

// ../core/jupiter/core/infra/component/use-nested-entities.ts
function checkMatchIs(match, displayType) {
  return typeof match.handle === "object" && match.handle !== null && "displayType" in match.handle && match.handle.displayType === displayType;
}
function useBranchNeedsToShowLeaf() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  if (checkMatchIs(lastMatch, 3 /* LEAF */)) {
    return true;
  }
  return false;
}
function useTrunkNeedsToShowBranch() {
  const matches = useMatches();
  for (const match of [...matches].reverse()) {
    if (checkMatchIs(match, 2 /* BRANCH */)) {
      return true;
    }
  }
  return false;
}
function useTrunkNeedsToShowLeaf() {
  return useBranchNeedsToShowLeaf();
}
function useLeafNeedsToShowLeaflet() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  if (checkMatchIs(lastMatch, 4 /* LEAFLET */)) {
    return true;
  }
  return false;
}

export {
  useBranchNeedsToShowLeaf,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
  useLeafNeedsToShowLeaflet
};
//# sourceMappingURL=/build/_shared/chunk-KRGCHOK2.js.map
