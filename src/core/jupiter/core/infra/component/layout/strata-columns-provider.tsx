import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMatches, useSearchParams } from "react-router";

import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { StrataDebugOverlay } from "#/core/infra/component/layout/strata-debug-overlay";
import { StrataEmptySlot } from "#/core/infra/component/layout/strata-empty-slot";
import {
  StrataColumnsContext,
  type StrataColumnsApi,
} from "#/core/infra/component/layout/strata-columns-context";
import { strataCloseFocusedColumn } from "#/core/infra/component/layout/strata-close-focused-column";
import { isStrataCloseKey } from "#/core/infra/strata/strata-close-key";
import { strataFocusStep } from "#/core/infra/strata/strata-focus-key";
import { strataLayoutFor } from "#/core/infra/strata/strata-layout-for";
import type { StrataLevel } from "#/core/infra/strata/strata-level";
import { strataLevelOf } from "#/core/infra/strata/strata-level-of";
import { useStrataPath } from "#/core/infra/strata/use-strata-path";

// What the server render and the first client render assume, so they agree.
const DEFAULT_WINDOW_WIDTH = 1440;

interface StrataColumnsProviderProps {
  offsetLeft: number;
}

/**
 * Keeps track of the open path and where each panel goes in the unit layout
 * (ADR 0020). It draws only the empty slots and the debug overlay: each panel
 * draws its own column, fixed to the window at the place decided here, so the
 * panels stay where they are in the route tree.
 */
export function StrataColumnsProvider(
  props: PropsWithChildren<StrataColumnsProviderProps>,
) {
  const matches = useMatches();
  const path = useStrataPath();
  const [searchParams] = useSearchParams();
  const [windowWidth, setWindowWidth] = useState(DEFAULT_WINDOW_WIDTH);
  // Which panel has the focus, for the path it was chosen on.
  const [chosen, setChosen] = useState<{ pathKey: string; index: number }>();
  // Counts the times the user moved the focus, so the focused panel can take
  // the keyboard focus too.
  const [moves, setMoves] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    function measure() {
      setWindowWidth(window.innerWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    // Two frames on, the measured layout is painted and moves may slide.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  const pathKey = path.map((panel) => panel.key).join("|");
  // A new path starts with the deepest panel focused again.
  const focusIndex =
    chosen !== undefined && chosen.pathKey === pathKey
      ? chosen.index
      : path.length - 1;

  const keyByLevel = useMemo(() => {
    const keys = new Map<StrataLevel, string>();
    for (const match of matches) {
      const level = strataLevelOf(match.handle);
      if (level !== null) {
        keys.set(level, match.id);
      }
    }
    return keys;
  }, [matches]);

  const layout = useMemo(
    () =>
      path.length === 0
        ? null
        : strataLayoutFor(path, focusIndex, windowWidth, props.offsetLeft),
    [path, focusIndex, windowWidth, props.offsetLeft],
  );

  const columnFor = useCallback(
    (level: StrataLevel) => {
      const key = keyByLevel.get(level);
      return layout?.slots.find((slot) => slot.key === key) ?? null;
    },
    [keyByLevel, layout],
  );

  const focus = useCallback(
    (level: StrataLevel) => {
      const index = path.findIndex(
        (panel) => panel.key === keyByLevel.get(level),
      );
      if (index >= 0) {
        setChosen({ pathKey, index });
        setMoves((current) => current + 1);
      }
    },
    [path, pathKey, keyByLevel],
  );

  // `h` and `l` move the focus along the open panels, which brings the new one
  // in whole.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const step = strataFocusStep(event, isTypingTarget(event.target));
      if (step === null) {
        return;
      }
      const index = Math.max(0, Math.min(path.length - 1, focusIndex + step));
      if (index === focusIndex) {
        return;
      }
      event.preventDefault();
      setChosen({ pathKey, index });
      setMoves((current) => current + 1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [path.length, pathKey, focusIndex]);

  // `Escape` closes the focused panel, with the close control it has.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isStrataCloseKey(event, isTypingTarget(event.target))) {
        return;
      }
      if (strataCloseFocusedColumn()) {
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // The panel that took the focus takes the keyboard focus, so Tab goes on
  // from there and a screen reader says where it is.
  useEffect(() => {
    if (moves === 0) {
      return;
    }
    document
      .querySelector<HTMLElement>('[data-strata-column][data-focused="true"]')
      ?.focus({ preventScroll: true });
  }, [moves]);

  const api = useMemo<StrataColumnsApi>(
    () => ({ columnFor, focus, offsetLeft: props.offsetLeft, animate }),
    [columnFor, focus, props.offsetLeft, animate],
  );

  return (
    <StrataColumnsContext.Provider value={api}>
      {props.children}
      {layout?.gutters.map((gutter) => (
        <StrataEmptySlot
          key={gutter.side}
          side={gutter.side}
          left={gutter.left}
          width={gutter.width}
        />
      ))}
      {layout !== null && searchParams.get("strata-debug") === "1" && (
        <StrataDebugOverlay layout={layout} />
      )}
    </StrataColumnsContext.Provider>
  );
}
