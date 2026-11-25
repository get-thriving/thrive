import { useEffect } from "react";
import { useLocation } from "react-router";

import { strataItemPath } from "#/core/infra/component/layout/strata-item-path";
import { strataClearRemembered } from "#/core/infra/component/layout/strata-scroll-column";

const ITEM = "[data-strata-item]";
const REMEMBERED = "data-strata-remembered";

/**
 * Keeps the item a person last picked drawn selected in a split or view
 * column, as a route column does (`EntityPanel`) while the keyboard is
 * elsewhere, in the column the item opened. Without it, a list pulled out into
 * a column of its own forgets the item as soon as the focus leaves it, so
 * clicking an item, or going to one with find, leaves nothing selected.
 *
 * The item the focus is on, or in (a click on its link puts the focus there),
 * is the one; and when nothing is, the item that is open in the column beside,
 * the one whose path the page is at, which also brings the mark back after the
 * list is drawn again.
 */
export function useStrataSplitSelection(host: HTMLElement | null): void {
  const { pathname } = useLocation();
  useEffect(() => {
    if (host === null) {
      return;
    }
    const column = host.closest<HTMLElement>("[data-strata-column]");
    if (column === null) {
      return;
    }
    const itemsOfColumn = () =>
      Array.from(host.querySelectorAll<HTMLElement>(ITEM)).filter(
        (item) => item.closest("[data-strata-column]") === column,
      );
    const select = (item: HTMLElement) => {
      strataClearRemembered(column);
      item.setAttribute(REMEMBERED, "");
    };
    const onFocusIn = (event: FocusEvent) => {
      const item =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(ITEM)
          : null;
      if (item !== null && host.contains(item)) {
        select(item);
      }
    };
    const markOpen = () => {
      if (host.querySelector(`[${REMEMBERED}]`) !== null) {
        return;
      }
      const open = itemsOfColumn().find(
        (item) => strataItemPath(item) === pathname,
      );
      if (open !== undefined) {
        select(open);
      }
    };
    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(markOpen);
    });
    observer.observe(host, { childList: true, subtree: true });
    host.addEventListener("focusin", onFocusIn);
    markOpen();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener("focusin", onFocusIn);
    };
  }, [host, pathname]);
}
