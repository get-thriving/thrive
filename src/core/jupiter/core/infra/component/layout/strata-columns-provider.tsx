import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ColumnSpec } from "#/core/infra/component/layout/column-spec";
import { planColumns } from "#/core/infra/component/layout/plan-columns";
import {
  StrataColumnsContext,
  type StrataColumnsApi,
} from "#/core/infra/component/layout/strata-columns-context";

// What the server render and the first client render assume, so they agree.
const DEFAULT_WINDOW_WIDTH = 1440;

interface StrataColumnsProviderProps {
  offsetLeft: number;
}

/**
 * Keeps track of the open columns and where each goes (ADR 0019). It draws
 * nothing itself: each panel draws its own column, fixed to the window at the
 * place decided here, so the panels stay where they are in the route tree.
 */
export function StrataColumnsProvider(
  props: PropsWithChildren<StrataColumnsProviderProps>,
) {
  const [specs, setSpecs] = useState<Record<string, ColumnSpec>>({});
  const [windowWidth, setWindowWidth] = useState(DEFAULT_WINDOW_WIDTH);
  const [forcedFrom, setForcedFrom] = useState<number | null>(null);

  useEffect(() => {
    function measure() {
      setWindowWidth(window.innerWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const register = useCallback((id: string, spec: ColumnSpec) => {
    setSpecs((current) => {
      const existing = current[id];
      if (
        existing !== undefined &&
        existing.kind === spec.kind &&
        existing.width === spec.width &&
        existing.minWidth === spec.minWidth
      ) {
        return current;
      }
      return { ...current, [id]: spec };
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setSpecs((current) => {
      if (!(id in current)) {
        return current;
      }
      return Object.fromEntries(
        Object.entries(current).filter(([key]) => key !== id),
      );
    });
    // A new set of columns starts from the automatic fit again.
    setForcedFrom(null);
  }, []);

  const placements = useMemo(
    () =>
      planColumns(
        specs,
        windowWidth - props.offsetLeft,
        props.offsetLeft,
        forcedFrom,
      ),
    [specs, windowWidth, props.offsetLeft, forcedFrom],
  );

  const unfold = useCallback(
    (id: string) => {
      const order = Object.entries(specs)
        .sort(([, a], [, b]) => a.kind - b.kind)
        .map(([key]) => key);
      const index = order.indexOf(id);
      if (index >= 0) {
        setForcedFrom(index);
      }
    },
    [specs],
  );

  const api = useMemo<StrataColumnsApi>(
    () => ({
      register,
      unregister,
      placementFor: (id) => placements[id] ?? null,
      unfold,
      offsetLeft: props.offsetLeft,
    }),
    [register, unregister, placements, unfold, props.offsetLeft],
  );

  return (
    <StrataColumnsContext.Provider value={api}>
      {props.children}
    </StrataColumnsContext.Provider>
  );
}
