import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { strataCollectionAround } from "#/core/infra/component/layout/strata-collection-around";
import { strataColumnFrame } from "#/core/infra/component/layout/strata-map-columns";
import { useStrataKeyBindings } from "#/core/infra/component/use-strata-key-bindings";
import { strataPositionKeyAction } from "#/core/infra/strata/strata-position-key";

/** An open item's place in its collection, for its header. */
export interface StrataColumnPosition {
  /** From 1, as it is said. */
  number: number;
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
  /** Replaces the open item with the one before it, or after it. */
  go: (step: -1 | 1) => void;
}

interface Place {
  number: number;
  total: number;
  previousPath: string | null;
  nextPath: string | null;
}

/**
 * Where the open item of a column is among the items of the collection in the
 * column before it (ADR 0021), read from that column's page, which a list marks
 * with `data-strata-item`: it is as many as it shows after its filters, in the
 * order it shows them. Null when there is no such column, or the item is not in
 * it (it was reached from a search or a link), or on a phone, which has one
 * column in view.
 *
 * `go` replaces the item with the one before it or after it, keeping the query
 * string, so what is split out and filtered stays as it is; `o` and `p` do the
 * same while `active`, and the list's `j` and `k` do it from the list.
 */
export function useStrataPosition(
  columnKey: string | null,
  active: boolean,
): StrataColumnPosition | null {
  const keyBindings = useStrataKeyBindings();
  const columns = useContext(StrataColumnsContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);

  // The column before this one on the open path, not a split of it.
  const routes = columns?.slots.filter((slot) => slot.kind === "route") ?? [];
  const at = routes.findIndex((slot) => slot.key === columnKey);
  const parentKey =
    at > 0 && columns?.phone === false ? routes[at - 1].key : null;
  const pathname = location.pathname;

  useEffect(() => {
    if (parentKey === null) {
      setPlace(null);
      return;
    }
    function read() {
      const frame = parentKey === null ? null : strataColumnFrame(parentKey);
      const around =
        frame === null ? null : strataCollectionAround(frame, pathname);
      const next: Place | null =
        around === null
          ? null
          : {
              number: around.position.number,
              total: around.position.total,
              previousPath:
                around.position.previous === null
                  ? null
                  : around.paths[around.position.previous],
              nextPath:
                around.position.next === null
                  ? null
                  : around.paths[around.position.next],
            };
      setPlace((was) =>
        was?.number === next?.number &&
        was?.total === next?.total &&
        was?.previousPath === next?.previousPath &&
        was?.nextPath === next?.nextPath
          ? was
          : next,
      );
    }
    read();
    // The list changes under it: filters, a new item, an item done.
    let frameRequest = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frameRequest);
      frameRequest = requestAnimationFrame(read);
    });
    const frame = strataColumnFrame(parentKey);
    if (frame !== null) {
      observer.observe(frame, { childList: true, subtree: true });
    }
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRequest);
    };
  }, [parentKey, pathname]);

  const search = location.search;
  const go = useCallback(
    (step: -1 | 1) => {
      const path = step < 0 ? place?.previousPath : place?.nextPath;
      if (path === null || path === undefined) {
        return;
      }
      void navigate({ pathname: path, search }, { replace: true });
      // The list shows the one it is at, if it was out of view.
      const frame = parentKey === null ? null : strataColumnFrame(parentKey);
      const around =
        frame === null ? null : strataCollectionAround(frame, pathname);
      const to =
        around === null
          ? null
          : step < 0
            ? around.position.previous
            : around.position.next;
      if (around !== null && to !== null) {
        around.items[to].scrollIntoView({
          block: "nearest",
          inline: "nearest",
        });
      }
    },
    [place, navigate, search, parentKey, pathname],
  );

  useEffect(() => {
    if (!active || place === null) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      const action = strataPositionKeyAction(
        event,
        isTypingTarget(event.target),
        keyBindings,
      );
      if (action === null) {
        return;
      }
      event.preventDefault();
      go(action === "previous" ? -1 : 1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, place, go, keyBindings]);

  if (place === null) {
    return null;
  }
  return {
    number: place.number,
    total: place.total,
    hasPrevious: place.previousPath !== null,
    hasNext: place.nextPath !== null,
    go,
  };
}
