import type { Dir } from "@jupiter/webapi-client";

/** True when `dir` is the collection root (no parent folder). */
export function isDirRoot(dir: Dir): boolean {
  return dir.parent_dir_ref_id == null || dir.parent_dir_ref_id === undefined;
}

/** Depth of `dir` from the tree root (the collection root has depth 0). */
export function computeDirDepthFromRoot(
  dir: Dir,
  allDirsByRefId: Map<string, Dir>,
): number {
  let depth = 0;
  let current: Dir | undefined = dir;
  while (current.parent_dir_ref_id) {
    depth += 1;
    current = allDirsByRefId.get(current.parent_dir_ref_id);
    if (!current) {
      break;
    }
  }
  return depth;
}

/**
 * Depth-first pre-order: a parent appears before its children; siblings are sorted
 * by name.
 */
export function sortDirsByTreeOrder(dirs: Dir[]): Dir[] {
  const byParent = new Map<string | null, Dir[]>();
  for (const d of dirs) {
    const p = d.parent_dir_ref_id ?? null;
    if (!byParent.has(p)) {
      byParent.set(p, []);
    }
    byParent.get(p)!.push(d);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  const result: Dir[] = [];
  function walk(parentId: string | null) {
    const children = byParent.get(parentId) ?? [];
    for (const child of children) {
      result.push(child);
      walk(child.ref_id);
    }
  }
  walk(null);
  return result;
}

/** The given dir and every descendant in the `dirs` forest. */
export function collectDirRefIdsInSubtree(
  rootDirRefId: string,
  dirs: Dir[],
): Set<string> {
  const childrenByParent = new Map<string | null, Dir[]>();
  for (const d of dirs) {
    const p = d.parent_dir_ref_id ?? null;
    if (!childrenByParent.has(p)) {
      childrenByParent.set(p, []);
    }
    childrenByParent.get(p)!.push(d);
  }
  const acc = new Set<string>();
  function walk(id: string) {
    acc.add(id);
    const kids = childrenByParent.get(id) ?? [];
    for (const k of kids) {
      walk(k.ref_id);
    }
  }
  walk(rootDirRefId);
  return acc;
}
