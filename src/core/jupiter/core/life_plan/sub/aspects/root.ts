import type { Aspect, AspectSummary } from "@jupiter/webapi-client";

export function isRootAspect(aspect: Aspect | AspectSummary): boolean {
  return !aspect.parent_aspect_ref_id;
}

export function sortAspectsByTreeOrder(
  aspects: (Aspect | AspectSummary)[],
): AspectSummary[] {
  // Essentially we do a DFS-ish traversal of the tree.
  const aspectsByParentRefId: Map<string | null, (Aspect | AspectSummary)[]> =
    new Map();
  for (const aspect of aspects) {
    const parentRefId = aspect.parent_aspect_ref_id;
    if (!aspectsByParentRefId.has(parentRefId || null)) {
      aspectsByParentRefId.set(parentRefId || null, []);
    }
    const children = aspectsByParentRefId.get(parentRefId || null);
    if (!children) {
      throw new Error("Invariant violation");
    }
    children.push(aspect);
  }

  const finalAspects: AspectSummary[] = [];

  const stack: (Aspect | AspectSummary)[] =
    aspectsByParentRefId.get(null) || [];
  while (stack.length > 0) {
    const currentAspect = stack.pop();
    if (currentAspect === undefined) {
      throw new Error("Invariant violation");
    }
    finalAspects.push(currentAspect);
    const children = aspectsByParentRefId.get(currentAspect.ref_id) || [];
    const sortedChildren = sortAspectsByOrderWithinParent(
      currentAspect,
      children,
    );
    stack.push(...sortedChildren);
  }

  return finalAspects;
}

function sortAspectsByOrderWithinParent(
  parent: Aspect | AspectSummary,
  children: (Aspect | AspectSummary)[],
): AspectSummary[] {
  return [...children].sort((a, b) => {
    const first = parent.order_of_child_aspects.findIndex(
      (x) => x === a.ref_id,
    );
    const second = parent.order_of_child_aspects.findIndex(
      (x) => x === b.ref_id,
    );
    return second - first;
  });
}

export function computeAspectHierarchicalNameFromRoot(
  aspect: Aspect | AspectSummary,
  allAspectsByRefId: Map<string, Aspect | AspectSummary>,
): string {
  let name = aspect.name;
  let currentAspect = aspect;
  while (currentAspect.parent_aspect_ref_id) {
    const currentAspectTmp = allAspectsByRefId.get(
      currentAspect.parent_aspect_ref_id,
    );
    if (!currentAspectTmp) {
      throw new Error("Invariant violation");
    }
    currentAspect = currentAspectTmp;
    name = `${currentAspect.name} / ${name}`;
  }
  return name;
}

export function computeAspectDistanceFromRoot(
  aspect: Aspect | AspectSummary,
  allAspectsByRefId: Map<string, Aspect | AspectSummary>,
): number {
  let distance = 0;
  let currentAspect = aspect;
  while (currentAspect.parent_aspect_ref_id) {
    distance++;
    const currentAspectTmp = allAspectsByRefId.get(
      currentAspect.parent_aspect_ref_id,
    );
    if (!currentAspectTmp) {
      throw new Error("Invariant violation");
    }
    currentAspect = currentAspectTmp;
  }
  return distance;
}

export function shiftAspectUpInListOfChildren(
  aspect: Aspect | AspectSummary,
  orderOfChildAspects: string[],
): string[] {
  const index = orderOfChildAspects.findIndex((x) => x === aspect.ref_id);
  if (index === -1) {
    throw new Error("Invariant violation");
  }
  if (index === 0) {
    return orderOfChildAspects;
  }
  const newOrderOfChildAspects = [...orderOfChildAspects];
  newOrderOfChildAspects[index] = orderOfChildAspects[index - 1];
  newOrderOfChildAspects[index - 1] = orderOfChildAspects[index];
  return newOrderOfChildAspects;
}

export function shiftAspectDownInListOfChildren(
  aspect: Aspect | AspectSummary,
  orderOfChildAspects: string[],
): string[] {
  const index = orderOfChildAspects.findIndex((x) => x === aspect.ref_id);
  if (index === -1) {
    throw new Error("Invariant violation");
  }
  if (index === orderOfChildAspects.length - 1) {
    return orderOfChildAspects;
  }
  const newOrderOfChildAspects = [...orderOfChildAspects];
  newOrderOfChildAspects[index] = orderOfChildAspects[index + 1];
  newOrderOfChildAspects[index + 1] = orderOfChildAspects[index];
  return newOrderOfChildAspects;
}
