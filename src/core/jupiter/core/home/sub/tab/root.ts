import {
  EntityId,
  HomeConfig,
  HomeTab,
  HomeTabTarget,
} from "@jupiter/webapi-client";

export function sortAndFilterTabsByTheirOrder(
  homeConfig: HomeConfig,
  target: HomeTabTarget,
  tabs: HomeTab[],
): HomeTab[] {
  return tabs
    .filter((t) => t.target === target)
    .sort((a, b) => {
      const aIndex = homeConfig.order_of_tabs[target].indexOf(a.ref_id);
      const bIndex = homeConfig.order_of_tabs[target].indexOf(b.ref_id);
      return aIndex - bIndex;
    });
}

export function sortTabsByOrder(tabs: HomeTab[], order: EntityId[]): HomeTab[] {
  return [...tabs].sort((a, b) => {
    const orderA = order.indexOf(a.ref_id);
    const orderB = order.indexOf(b.ref_id);
    return orderA - orderB;
  });
}

export function shiftTabUpInListOfTabs(
  tab: HomeTab,
  order: EntityId[],
): EntityId[] {
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

export function shiftTabDownInListOfTabs(
  tab: HomeTab,
  order: EntityId[],
): EntityId[] {
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
