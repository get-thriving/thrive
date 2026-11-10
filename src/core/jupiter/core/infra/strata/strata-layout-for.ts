import {
  describeLayout,
  layoutUnits,
  toPixels,
  unitsForWidth,
  type ColumnSpec,
  type PlacedSlot,
  type SlotState,
} from "#/core/infra/strata/layout";

/** One path panel, placed on the screen. */
export interface StrataPlacedSlot extends PlacedSlot {
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
  const placement = toPixels(layout, width, { rail });
  // The engine puts the leftover at the right end; the row is centred instead.
  const gutterWidth = (placement.empty?.width ?? 0) / 2;
  return {
    slots: placement.slots.map((placed, index) => ({
      ...placed,
      left: placed.left + gutterWidth,
      state: layout.slots[index].state,
      units: layout.slots[index].units,
      focused: path.length > 1 && index === focusIndex,
    })),
    gutters:
      gutterWidth > 0
        ? [
            { side: "left", left: rail, width: gutterWidth },
            { side: "right", left: width - gutterWidth, width: gutterWidth },
          ]
        : [],
    units,
    unitPx: placement.unitPx,
    description: describeLayout(layout),
  };
}
