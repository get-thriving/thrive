import {
  RAIL_ENTRIES,
  RAIL_MORE_GROUPS,
} from "#/core/infra/component/shell/rail-entries";

/**
 * Every place the rail leads to, for naming the list that is in one. Home is
 * left out: it is the page itself and not a place with lists under it, and its
 * path is the start of every other.
 */
export const RAIL_DESTINATIONS = [
  ...RAIL_ENTRIES.filter((entry) => entry.exact !== true),
  ...RAIL_MORE_GROUPS.flatMap((group) => group.entries),
];
