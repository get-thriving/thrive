// ../core/jupiter/core/life_plan/sub/goals/root.ts
function sortGoalsNaturally(goals) {
  const collator = new Intl.Collator(void 0, {
    numeric: true,
    sensitivity: "base"
  });
  return [...goals].sort((a, b) => {
    return collator.compare(String(a.name), String(b.name));
  });
}

export {
  sortGoalsNaturally
};
//# sourceMappingURL=/build/_shared/chunk-OLMKSGLM.js.map
