// ../core/jupiter/core/life_plan/sub/aspects/root.ts
function isRootAspect(aspect) {
  return !aspect.parent_aspect_ref_id;
}
function sortAspectsByTreeOrder(aspects) {
  const aspectsByParentRefId = /* @__PURE__ */ new Map();
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
  const finalAspects = [];
  const stack = aspectsByParentRefId.get(null) || [];
  while (stack.length > 0) {
    const currentAspect = stack.pop();
    if (currentAspect === void 0) {
      throw new Error("Invariant violation");
    }
    finalAspects.push(currentAspect);
    const children = aspectsByParentRefId.get(currentAspect.ref_id) || [];
    const sortedChildren = sortAspectsByOrderWithinParent(
      currentAspect,
      children
    );
    stack.push(...sortedChildren);
  }
  return finalAspects;
}
function sortAspectsByOrderWithinParent(parent, children) {
  return [...children].sort((a, b) => {
    const first = parent.order_of_child_aspects.findIndex(
      (x) => x === a.ref_id
    );
    const second = parent.order_of_child_aspects.findIndex(
      (x) => x === b.ref_id
    );
    return second - first;
  });
}
function computeAspectHierarchicalNameFromRoot(aspect, allAspectsByRefId) {
  let name = aspect.name;
  let currentAspect = aspect;
  while (currentAspect.parent_aspect_ref_id) {
    const currentAspectTmp = allAspectsByRefId.get(
      currentAspect.parent_aspect_ref_id
    );
    if (!currentAspectTmp) {
      throw new Error("Invariant violation");
    }
    currentAspect = currentAspectTmp;
    name = `${currentAspect.name} / ${name}`;
  }
  return name;
}
function computeAspectDistanceFromRoot(aspect, allAspectsByRefId) {
  let distance = 0;
  let currentAspect = aspect;
  while (currentAspect.parent_aspect_ref_id) {
    distance++;
    const currentAspectTmp = allAspectsByRefId.get(
      currentAspect.parent_aspect_ref_id
    );
    if (!currentAspectTmp) {
      throw new Error("Invariant violation");
    }
    currentAspect = currentAspectTmp;
  }
  return distance;
}
function shiftAspectUpInListOfChildren(aspect, orderOfChildAspects) {
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
function shiftAspectDownInListOfChildren(aspect, orderOfChildAspects) {
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

export {
  isRootAspect,
  sortAspectsByTreeOrder,
  computeAspectHierarchicalNameFromRoot,
  computeAspectDistanceFromRoot,
  shiftAspectUpInListOfChildren,
  shiftAspectDownInListOfChildren
};
//# sourceMappingURL=/build/_shared/chunk-37FGSNWH.js.map
