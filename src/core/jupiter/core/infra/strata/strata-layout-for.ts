import {
  describeLayout,
  layoutColumns,
  layoutUnits,
  toPixels,
  unitsForWidth,
  type ColumnKind,
  type ColumnSpec,
  type LayoutResult,
  type PlacedSlot,
  type SlotState,
} from "#/core/infra/strata/layout";
import { strataColumnsWithSplits } from "#/core/infra/strata/strata-columns-with-splits";
import type { StrataSplitSpec } from "#/core/infra/strata/strata-split-spec";

/** One path panel, placed on the screen. */
export interface StrataPlacedSlot extends PlacedSlot {
  /** A route column of the open path, or a section split out into one. */
  kind: ColumnKind;
  state: SlotState;
  /** Units it occupies; 0 for a spine. */
  units: number;
  /** Only meaningful with more than one panel open. */
  focused: boolean;
  /**
   * A spine that shows the panel's name, in a strip wide enough to read it.
   * Only on a phone, for the panel that follows the focused one.
   */
  sliver?: boolean;
}

/** Room no panel took, on one side of the row. */
export interface StrataGutter {
  side: "left" | "right";
  left: number;
  width: number;
}

export interface StrataLayout {
  /** In the order of the path. */
  slots: StrataPlacedSlot[];
  /**
   * The units nothing took, split in two so the row sits in the middle of the
   * window: empty when the row fills it.
   */
  gutters: StrataGutter[];
  units: number;
  unitPx: number;
  /** The compact text form of the layout, for the debug overlay and logs. */
  description: string;
}

/**
 * Lay the open path out on a screen `width` px wide with a `rail` px rail: how
 * many units there are, which panels fit whole, and where each goes.
 */
export function strataLayoutFor(
  path: ColumnSpec[],
  focus: number,
  width: number,
  rail: number,
): StrataLayout {
  const focusIndex = Math.max(0, Math.min(path.length - 1, focus));
  const units = unitsForWidth(width, { rail });
  const layout = layoutUnits({ columns: path, focus: focusIndex, units });
  return place(layout, width, rail);
}

export interface StrataSplitsLayout extends StrataLayout {
  /** The columns, in the order they are on screen. */
  columns: ColumnSpec[];
  /** Index of the focused column in `columns`. */
  focus: number;
  /** The splits shown as columns. */
  active: string[];
  /** The splits asked for which were folded back into their sections. */
  folded: string[];
}

/**
 * The same, with some sections split out into columns of their own. A split
 * which would only be a spine or a peek is folded back into its section
 * instead, farthest from the focus first (`layoutColumns`).
 */
export function strataLayoutWithSplits(input: {
  path: ColumnSpec[];
  /** The splits sections have offered, by id. */
  splits: ReadonlyMap<string, StrataSplitSpec>;
  /** Split ids the user asked for, in the order they were opened. */
  wanted: string[];
  /** Key of the focused column; the deepest route column if it isn't there. */
  focusKey: string;
  width: number;
  rail: number;
}): StrataSplitsLayout {
  const units = unitsForWidth(input.width, { rail: input.rail });
  const result = layoutColumns({
    wanted: input.wanted.filter((id) => input.splits.has(id)),
    build: (active) =>
      strataColumnsWithSplits(input.path, input.splits, active),
    focusKey: input.focusKey,
    units,
  });
  return {
    ...place(result.layout, input.width, input.rail),
    columns: result.columns,
    focus: result.layout.focus,
    active: result.active,
    folded: result.folded,
  };
}

function place(
  layout: LayoutResult,
  width: number,
  rail: number,
): StrataLayout {
  const placement = toPixels(layout, width, { rail });
  // The engine puts the leftover at the right end; the row is centred instead.
  const gutterWidth = (placement.empty?.width ?? 0) / 2;
  return {
    slots: placement.slots.map((placed, index) => ({
      ...placed,
      left: placed.left + gutterWidth,
      kind: layout.slots[index].kind,
      state: layout.slots[index].state,
      units: layout.slots[index].units,
      focused: layout.slots.length > 1 && index === layout.focus,
    })),
    gutters:
      gutterWidth > 0
        ? [
            { side: "left", left: rail, width: gutterWidth },
            { side: "right", left: width - gutterWidth, width: gutterWidth },
          ]
        : [],
    units: layout.units,
    unitPx: placement.unitPx,
    description: describeLayout(layout),
  };
}
