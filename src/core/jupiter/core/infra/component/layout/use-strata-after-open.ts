import { useCallback, useContext } from "react";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";

/**
 * Whether opening an item leads to a column: it has a link to follow, and is
 * not one that is picked or does something else.
 */
export function strataItemOpensColumn(item: HTMLElement): boolean {
  return (
    !item.hasAttribute("data-strata-selectable") &&
    item.querySelector("a[href]") !== null
  );
}

/**
 * What `↵` does once it has opened an item of a list (ADR 0021): the column
 * the item opens in takes the focus. When the item opens a new column that is
 * what happens anyway, as a new path starts with its deepest column focused;
 * but an item that replaces the one already open, in the column after the
 * list, leaves the path as it was, so the focus is moved there. An item that
 * does not lead anywhere, which is picked or does something else, leaves it be.
 */
export function useStrataAfterOpen(): (item: HTMLElement) => void {
  const columns = useContext(StrataColumnsContext);
  const focusIn = columns?.focusIn;

  return useCallback(
    (item) => {
      if (focusIn === undefined || !strataItemOpensColumn(item)) {
        return;
      }
      focusIn();
    },
    [focusIn],
  );
}
