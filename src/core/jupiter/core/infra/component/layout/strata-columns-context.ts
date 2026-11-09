import { createContext } from "react";

import type { StrataLevel } from "#/core/infra/strata/strata-level";
import type { StrataPlacedSlot } from "#/core/infra/strata/strata-layout-for";

/** What the workspace offers the panels that want to be columns. */
export interface StrataColumnsApi {
  /** Null until the layout has placed the panel, e.g. on the server render. */
  columnFor: (level: StrataLevel) => StrataPlacedSlot | null;
  /** Make a panel the focused one, which shows it whole. */
  focus: (level: StrataLevel) => void;
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
