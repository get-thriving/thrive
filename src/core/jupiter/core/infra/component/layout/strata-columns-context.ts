import { createContext } from "react";

import type { StrataSplitSpec } from "#/core/infra/strata/strata-split-spec";
import type { StrataLevel } from "#/core/infra/strata/strata-level";
import type { StrataPlacedSlot } from "#/core/infra/strata/strata-layout-for";

/** A section split out of its column. */
export interface StrataSplitState {
  id: string;
  title: string;
  /** The key of its column. */
  key: string;
  /** The key of the route column its section is in. */
  parentKey: string;
}

/** What the workspace offers the panels that want to be columns. */
export interface StrataColumnsApi {
  /** Null until the layout has placed the panel, e.g. on the server render. */
  columnFor: (level: StrataLevel) => StrataPlacedSlot | null;
  /** Make a panel the focused one, which shows it whole. */
  focus: (level: StrataLevel) => void;
  /** The same, by place on the open path: 0 is the first panel. */
  focusAt: (index: number) => void;
  /** The same, for a route column of the open path: 0 is the first. */
  focusRoute: (index: number) => void;
  /**
   * The same, by the key of any column, a split's included. The column takes
   * the keyboard focus too, unless `takeFocus` is false, for a caller that puts
   * the keyboard focus somewhere inside it itself.
   */
  focusColumn: (key: string, takeFocus?: boolean) => void;
  /** Splits asked for in the URL whose section is on screen, as columns. */
  splits: StrataSplitState[];
  /**
   * Offer a section as a column; returns the way to take it back. `fold` is
   * what the column's own control does.
   */
  registerSplit: (spec: StrataSplitSpec, fold: () => void) => () => void;
  /** Where a split column's section is drawn, once the column is there. */
  splitHost: (id: string) => HTMLElement | null;
  /**
   * Every open panel with where it ended up, in the order of the path; empty
   * until the layout has placed them.
   */
  slots: StrataPlacedSlot[];
  /** Where the columns start, which is the right edge of the rail. */
  offsetLeft: number;
  /**
   * Whether a panel that moves should slide. Off until the window has been
   * measured, so the first layout does not slide in from the assumed width.
   */
  animate: boolean;
  /** On a phone: one panel at a time, whole, with strips for its neighbours. */
  phone: boolean;
  /** Which open panel is shown, from 0, and how many are open. */
  position: { index: number; count: number };
  /**
   * Show the panel before the focused one, as going back does. False, and
   * nothing happens, when the focused panel is the first.
   */
  focusOut: () => boolean;
}

/**
 * Present while the Strata unit layout is on, so the shared panels know to lay
 * themselves out as columns; absent otherwise, and they stay as they were.
 */
export const StrataColumnsContext = createContext<StrataColumnsApi | null>(
  null,
);
