// ../core/jupiter/core/docs/sub/dir/root.ts
function isDirRoot(dir) {
  return dir.parent_dir_ref_id == null || dir.parent_dir_ref_id === void 0;
}
function computeDirDepthFromRoot(dir, allDirsByRefId) {
  let depth = 0;
  let current = dir;
  while (current.parent_dir_ref_id) {
    depth += 1;
    current = allDirsByRefId.get(current.parent_dir_ref_id);
    if (!current) {
      break;
    }
  }
  return depth;
}
function sortDirsByTreeOrder(dirs) {
  const byParent = /* @__PURE__ */ new Map();
  for (const d of dirs) {
    const p = d.parent_dir_ref_id ?? null;
    if (!byParent.has(p)) {
      byParent.set(p, []);
    }
    byParent.get(p).push(d);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  const result = [];
  function walk(parentId) {
    const children = byParent.get(parentId) ?? [];
    for (const child of children) {
      result.push(child);
      walk(child.ref_id);
    }
  }
  walk(null);
  return result;
}
function collectDirRefIdsInSubtree(rootDirRefId, dirs) {
  const childrenByParent = /* @__PURE__ */ new Map();
  for (const d of dirs) {
    const p = d.parent_dir_ref_id ?? null;
    if (!childrenByParent.has(p)) {
      childrenByParent.set(p, []);
    }
    childrenByParent.get(p).push(d);
  }
  const acc = /* @__PURE__ */ new Set();
  function walk(id) {
    acc.add(id);
    const kids = childrenByParent.get(id) ?? [];
    for (const k of kids) {
      walk(k.ref_id);
    }
  }
  walk(rootDirRefId);
  return acc;
}

export {
  isDirRoot,
  computeDirDepthFromRoot,
  sortDirsByTreeOrder,
  collectDirRefIdsInSubtree
};
//# sourceMappingURL=/build/_shared/chunk-RDEY3YL3.js.map
