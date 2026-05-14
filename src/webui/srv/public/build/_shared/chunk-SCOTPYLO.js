// ../core/jupiter/core/home/sub/tab/root.ts
function sortAndFilterTabsByTheirOrder(homeConfig, target, tabs) {
  return tabs.filter((t) => t.target === target).sort((a, b) => {
    const aIndex = homeConfig.order_of_tabs[target].indexOf(a.ref_id);
    const bIndex = homeConfig.order_of_tabs[target].indexOf(b.ref_id);
    return aIndex - bIndex;
  });
}
function sortTabsByOrder(tabs, order) {
  return [...tabs].sort((a, b) => {
    const orderA = order.indexOf(a.ref_id);
    const orderB = order.indexOf(b.ref_id);
    return orderA - orderB;
  });
}
function shiftTabUpInListOfTabs(tab, order) {
  const index = order.indexOf(tab.ref_id);
  if (index === -1) {
    throw new Error("Invariant violation");
  }
  if (index === 0) {
    return order;
  }
  const newOrder = [...order];
  newOrder[index] = order[index - 1];
  newOrder[index - 1] = order[index];
  return newOrder;
}
function shiftTabDownInListOfTabs(tab, order) {
  const index = order.indexOf(tab.ref_id);
  if (index === -1) {
    throw new Error("Invariant violation");
  }
  if (index === order.length - 1) {
    return order;
  }
  const newOrder = [...order];
  newOrder[index] = order[index + 1];
  newOrder[index + 1] = order[index];
  return newOrder;
}

export {
  sortAndFilterTabsByTheirOrder,
  sortTabsByOrder,
  shiftTabUpInListOfTabs,
  shiftTabDownInListOfTabs
};
//# sourceMappingURL=/build/_shared/chunk-SCOTPYLO.js.map
