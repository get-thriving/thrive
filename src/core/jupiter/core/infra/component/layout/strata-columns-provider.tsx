import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GlobalStyles } from "@mui/material";
import { useMatches, useSearchParams } from "react-router";

import { isEditableFieldTarget } from "#/core/infra/component/layout/is-editable-field-target";
import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { StrataDebugOverlay } from "#/core/infra/component/layout/strata-debug-overlay";
import { StrataColumnStrip } from "#/core/infra/component/layout/strata-column-strip";
import { StrataFind } from "#/core/infra/component/layout/strata-find";
import { StrataHints } from "#/core/infra/component/layout/strata-hints";
import {
  STRATA_PHONE_BAR_HEIGHT_PX,
  STRATA_PHONE_STRIP_HEIGHT_PX,
} from "#/core/infra/component/layout/strata-columns-top";
import { StrataEmptySlot } from "#/core/infra/component/layout/strata-empty-slot";
import {
  StrataColumnsContext,
  type StrataColumnsApi,
  type StrataSplitState,
} from "#/core/infra/component/layout/strata-columns-context";
import { strataCloseFocusedColumn } from "#/core/infra/component/layout/strata-close-focused-column";
import { isStrataCloseKey } from "#/core/infra/strata/strata-close-key";
import { isStrataLeaveFieldKey } from "#/core/infra/strata/strata-leave-field-key";
import { strataFocusStep } from "#/core/infra/strata/strata-focus-key";
import { strataLayoutWithSplits } from "#/core/infra/strata/strata-layout-for";
import {
  strataSplitIdOf,
  strataSplitKey,
} from "#/core/infra/strata/strata-columns-with-splits";
import type { StrataSplitSpec } from "#/core/infra/strata/strata-split-spec";
import { StrataSplitColumn } from "#/core/infra/component/layout/strata-split-column";
import { strataPhoneLayoutFor } from "#/core/infra/strata/strata-phone-layout-for";
import type { StrataLevel } from "#/core/infra/strata/strata-level";
import { strataLevelOf } from "#/core/infra/strata/strata-level-of";
import { useStrataPath } from "#/core/infra/strata/use-strata-path";

// A section split out into a column of its own is kept in the URL as
// `panel-id[split]=section-id` (ADR 0014).
const SPLIT_PARAM_RE = /^[a-z0-9]+(-[a-z0-9]+)*\[split\]$/;

function sameSplitSpec(a: StrataSplitSpec, b: StrataSplitSpec): boolean {
  return (
    a.id === b.id &&
    a.parentKey === b.parentKey &&
    a.title === b.title &&
    a.size === b.size &&
    a.grow === b.grow &&
    a.parentSize === b.parentSize &&
    a.view === b.view
  );
}

// What the server render and the first client render assume, so they agree.
const DEFAULT_WINDOW_WIDTH = 1440;
const DEFAULT_PHONE_WIDTH = 390;

interface StrataColumnsProviderProps {
  offsetLeft: number;
  /** A small screen, known before the window is measured. */
  phone: boolean;
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
  const [windowWidth, setWindowWidth] = useState(
    props.phone ? DEFAULT_PHONE_WIDTH : DEFAULT_WINDOW_WIDTH,
  );
  // Which column has the focus (a route column's or a split's key), for the
  // path it was chosen on.
  const [chosen, setChosen] = useState<{ pathKey: string; key: string }>();
  // The sections on screen which can be columns, and where each is drawn once
  // it is one.
  const [splitSpecs, setSplitSpecs] = useState<
    ReadonlyMap<string, StrataSplitSpec>
  >(() => new Map());
  const [hosts, setHosts] = useState<ReadonlyMap<string, HTMLElement>>(
    () => new Map(),
  );
  const folders = useRef(new Map<string, () => void>());
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
  const focusKey =
    chosen !== undefined && chosen.pathKey === pathKey
      ? chosen.key
      : (path[path.length - 1]?.key ?? "");

  // Every `panel[split]=section` in the URL, in the order they were opened.
  const wantedKey = Array.from(searchParams.entries())
    .filter(([key]) => SPLIT_PARAM_RE.test(key))
    .map(([, value]) => value)
    .filter((value, index, all) => all.indexOf(value) === index)
    .join("|");
  const wanted = useMemo(
    () => (wantedKey === "" ? [] : wantedKey.split("|")),
    [wantedKey],
  );

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

  // What is laid out: the columns on screen, in order, which of them is
  // focused, and which splits are shown or were folded back for lack of room.
  // A small screen has no splits: sections stay inline.
  const view = useMemo(() => {
    if (path.length === 0) {
      return null;
    }
    if (props.phone) {
      const focus = Math.max(
        0,
        path.findIndex((panel) => panel.key === focusKey),
      );
      return {
        layout: strataPhoneLayoutFor(path, focus, windowWidth),
        columns: path,
        focus,
        active: [] as string[],
      };
    }
    const result = strataLayoutWithSplits({
      path,
      splits: splitSpecs,
      wanted,
      focusKey,
      width: windowWidth,
      rail: props.offsetLeft,
    });
    return {
      layout: result,
      columns: result.columns,
      focus: result.focus,
      active: result.active,
    };
  }, [
    path,
    focusKey,
    windowWidth,
    props.offsetLeft,
    props.phone,
    splitSpecs,
    wanted,
  ]);
  const layout = view?.layout ?? null;
  const columns = view?.columns ?? path;
  const focusIndex = view?.focus ?? 0;

  const columnFor = useCallback(
    (level: StrataLevel) => {
      const key = keyByLevel.get(level);
      return layout?.slots.find((slot) => slot.key === key) ?? null;
    },
    [keyByLevel, layout],
  );

  const focusColumn = useCallback(
    (key: string, takeFocus: boolean = true) => {
      setChosen({ pathKey, key });
      if (takeFocus) {
        setMoves((current) => current + 1);
      }
    },
    [pathKey],
  );

  const focus = useCallback(
    (level: StrataLevel) => {
      const key = keyByLevel.get(level);
      if (key !== undefined && path.some((panel) => panel.key === key)) {
        focusColumn(key);
      }
    },
    [path, keyByLevel, focusColumn],
  );

  const focusAt = useCallback(
    (index: number) => {
      if (index >= 0 && index < columns.length) {
        focusColumn(columns[index].key);
      }
    },
    [columns, focusColumn],
  );

  const focusRoute = useCallback(
    (index: number) => {
      if (index >= 0 && index < path.length) {
        focusColumn(path[index].key);
      }
    },
    [path, focusColumn],
  );

  const focusOut = useCallback(() => {
    if (focusIndex <= 0) {
      return false;
    }
    focusColumn(columns[focusIndex - 1].key);
    return true;
  }, [focusIndex, columns, focusColumn]);

  const registerSplit = useCallback(
    (spec: StrataSplitSpec, fold: () => void) => {
      folders.current.set(spec.id, fold);
      setSplitSpecs((current) => {
        const known = current.get(spec.id);
        if (known !== undefined && sameSplitSpec(known, spec)) {
          return current;
        }
        return new Map(current).set(spec.id, spec);
      });
      return () => {
        folders.current.delete(spec.id);
        setSplitSpecs((current) => {
          if (!current.has(spec.id)) {
            return current;
          }
          const next = new Map(current);
          next.delete(spec.id);
          return next;
        });
      };
    },
    [],
  );

  const setHost = useCallback((id: string, element: HTMLElement | null) => {
    setHosts((current) => {
      if (element === null) {
        if (!current.has(id)) {
          return current;
        }
        const next = new Map(current);
        next.delete(id);
        return next;
      }
      return current.get(id) === element
        ? current
        : new Map(current).set(id, element);
    });
  }, []);

  const splitHost = useCallback((id: string) => hosts.get(id) ?? null, [hosts]);

  // The splits the user asked for whose section is on screen: shown as
  // columns, or folded back for lack of room.
  const splits = useMemo<StrataSplitState[]>(() => {
    const active = view?.active ?? [];
    return wanted.flatMap((id) => {
      const spec = splitSpecs.get(id);
      if (spec === undefined) {
        return [];
      }
      const shown = active.includes(id);
      return [
        {
          id,
          title: spec.title,
          key: strataSplitKey(id),
          parentKey: spec.parentKey,
          state: shown ? ("active" as const) : ("folded" as const),
        },
      ];
    });
  }, [wanted, splitSpecs, view]);

  // `h` and `l` move the focus along the open columns, which brings the new
  // one in whole.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const step = strataFocusStep(event, isTypingTarget(event.target));
      if (step === null) {
        return;
      }
      const index = Math.max(
        0,
        Math.min(columns.length - 1, focusIndex + step),
      );
      if (index === focusIndex) {
        return;
      }
      event.preventDefault();
      focusColumn(columns[index].key);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [columns, focusIndex, focusColumn]);

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

  // `Escape` in a field leaves it for the section it is in (or else the
  // column), so the keys that move around work again. What was typed stays.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        !isStrataLeaveFieldKey(event, isEditableFieldTarget(event.target)) ||
        !(event.target instanceof HTMLElement)
      ) {
        return;
      }
      const field = event.target;
      const home =
        field.closest<HTMLElement>("[data-strata-section][tabindex]") ??
        field.closest<HTMLElement>("[data-strata-column]");
      if (home === null) {
        return;
      }
      event.preventDefault();
      field.blur();
      home.focus({ preventScroll: true });
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
    () => ({
      columnFor,
      focus,
      focusAt,
      focusRoute,
      focusColumn,
      splits,
      registerSplit,
      splitHost,
      slots: layout?.slots ?? [],
      offsetLeft: props.offsetLeft,
      animate,
      phone: props.phone,
      position: { index: focusIndex, count: columns.length },
      focusOut,
    }),
    [
      columnFor,
      focus,
      focusAt,
      focusRoute,
      focusColumn,
      splits,
      registerSplit,
      splitHost,
      layout,
      props.offsetLeft,
      animate,
      props.phone,
      focusIndex,
      columns.length,
      focusOut,
    ],
  );

  return (
    <StrataColumnsContext.Provider value={api}>
      {props.children}
      <StrataHints />
      <StrataFind />
      {!props.phone &&
        layout?.slots.map((slot) => {
          const id = strataSplitIdOf(slot.key);
          const spec = id === null ? undefined : splitSpecs.get(id);
          if (id === null || spec === undefined) {
            return null;
          }
          return (
            <StrataSplitColumn
              key={slot.key}
              id={id}
              title={spec.title}
              view={spec.view === true}
              column={slot}
              offsetLeft={props.offsetLeft}
              animate={animate}
              onFocus={() => focusColumn(slot.key)}
              onFold={() => folders.current.get(id)?.()}
              setHost={setHost}
            />
          );
        })}
      {layout?.gutters.map((gutter) => (
        <StrataEmptySlot
          key={gutter.side}
          side={gutter.side}
          left={gutter.left}
          width={gutter.width}
        />
      ))}
      {props.phone && (
        <>
          <GlobalStyles
            styles={{
              ":root": {
                "--strata-columns-top": `calc(env(safe-area-inset-top) + ${
                  STRATA_PHONE_BAR_HEIGHT_PX +
                  (path.length > 1 ? STRATA_PHONE_STRIP_HEIGHT_PX : 0)
                }px)`,
              },
            }}
          />
          {path.length > 1 && (
            <StrataColumnStrip index={focusIndex} count={path.length} />
          )}
        </>
      )}
      {layout !== null &&
        !props.phone &&
        searchParams.get("strata-debug") === "1" && (
          <StrataDebugOverlay layout={layout} />
        )}
    </StrataColumnsContext.Provider>
  );
}
