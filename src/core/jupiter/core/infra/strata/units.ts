/**
 * Strata unit layout engine.
 *
 * Pure functions, no DOM and no React, so they can be unit tested and shared
 * by the web app, Electron and Capacitor.
 *
 * The model, in one paragraph: the screen width (minus the rail and any
 * spines) is split into X units. Every panel on the open path declares a size
 * (S = 2, M = 3, L = 5 units). The focused panel always shows whole. The other
 * panels are added outward from focus while they fit whole; the first one that
 * doesn't fit gets the leftover units and is drawn hashed (a "peek"); everything
 * further out folds to a spine. If the whole path fits, the spare units go, in
 * order, to (1) the item's satellites that are not pinned open, while each fits
 * whole ("auto" satellites), (2) panels marked `grow`, rightmost first, one size
 * step at most when the cap is on (S to M, M to L, L to XL), (3) an empty slot.
 */

export type UnitSize = 2 | 3 | 5;

/** What a panel declares: a number of units, or the whole screen. */
export type PanelSize = UnitSize | "full";

/** The sizes a growing panel steps through: S, M, L, and XL, which is only reached by growing. */
const GROWTH_LADDER = [2, 3, 5, 7];

/** Units a panel of this size takes when it grows to the next size. */
function growthStep(size: number): number {
  const next = GROWTH_LADDER.find((rung) => rung > size);
  return next === undefined ? 0 : next - size;
}
export type FillOrder = "alternate" | "parents" | "children";
export type SlotState = "full" | "squeezed" | "partial" | "spine";

export interface PanelSpec {
  /** Stable id: the route id for path panels, `satellite:<id>` for satellites. */
  key: string;
  size: PanelSize;
  /** May take spare units, growing to the right. */
  grow?: boolean;
}

/** A panel with its size resolved to units. */
interface SizedPanel {
  key: string;
  size: number;
  grow?: boolean;
  auto: boolean;
}

export interface SatelliteSpec {
  key: string;
  size: UnitSize;
}

export interface LayoutInput {
  /**
   * The open path, left to right: trunk, branch, leaf, leaflet, then the
   * satellites the user pinned open, in the order they were opened.
   */
  panels: PanelSpec[];
  /** Index into `panels` of the focused panel. */
  focus: number;
  /** X, usually from `unitsForWidth`. */
  units: number;
  /** Order in which neighbours of the focused panel are added. Default "alternate" (child first). */
  order?: FillOrder;
  /** Limit growth to one size step (S→M, M→L, L→XL). Default true. */
  capGrowth?: boolean;
  /**
   * The current item's satellites that are not pinned, in priority order.
   * They open automatically into spare units. Default none.
   */
  satellites?: SatelliteSpec[];
}

export interface Slot {
  key: string;
  /** Declared size in units; a full panel declares all of them. */
  size: number;
  state: SlotState;
  /** Units this slot occupies. 0 for a spine. */
  units: number;
  /** Units added by growth (0 if it didn't grow). */
  grownBy: number;
  /** Opened automatically into spare units; not pinned. */
  auto: boolean;
}

export interface LayoutResult {
  /** Path panels first (same order and indexes as the input), then auto satellites. */
  slots: Slot[];
  /** Units left over after everything; drawn as an empty slot at the right end. */
  emptyUnits: number;
  /** Units occupied by slots. `usedUnits + emptyUnits === units` unless something is squeezed. */
  usedUnits: number;
  units: number;
}

/** Indexes of the non-focused panels, in the order they're added. */
export function fillSequence(
  focus: number,
  count: number,
  order: FillOrder,
): number[] {
  const seq: number[] = [];
  if (order === "alternate") {
    for (let d = 1; d < count; d++) {
      if (focus + d < count) seq.push(focus + d);
      if (focus - d >= 0) seq.push(focus - d);
    }
  } else if (order === "parents") {
    for (let i = focus - 1; i >= 0; i--) seq.push(i);
    for (let i = focus + 1; i < count; i++) seq.push(i);
  } else {
    for (let i = focus + 1; i < count; i++) seq.push(i);
    for (let i = focus - 1; i >= 0; i--) seq.push(i);
  }
  return seq;
}

interface Fill {
  units: number[];
  states: SlotState[];
  remaining: number;
}

function fill(
  panels: SizedPanel[],
  focus: number,
  x: number,
  order: FillOrder,
): Fill {
  const n = panels.length;
  const units = new Array<number>(n).fill(0);
  const states = new Array<SlotState>(n).fill("spine");
  units[focus] = Math.min(panels[focus].size, x);
  states[focus] = panels[focus].size > x ? "squeezed" : "full";
  let remaining = x - units[focus];
  for (const c of fillSequence(focus, n, order)) {
    if (remaining <= 0) break;
    if (panels[c].size <= remaining) {
      units[c] = panels[c].size;
      states[c] = "full";
      remaining -= panels[c].size;
    } else {
      units[c] = remaining;
      states[c] = "partial";
      remaining = 0;
      break;
    }
  }
  return { units, states, remaining };
}

export function layoutUnits(input: LayoutInput): LayoutResult {
  const { panels, units: x } = input;
  if (panels.length === 0) throw new Error("layoutUnits: no panels");
  if (x < 1) throw new Error("layoutUnits: units must be at least 1");
  const focus = Math.max(0, Math.min(panels.length - 1, input.focus));
  const order = input.order ?? "alternate";
  const cap = input.capGrowth ?? true;

  // 1. Lay out the open path.
  let all: SizedPanel[] = panels.map((p) => ({
    ...p,
    size: p.size === "full" ? x : p.size,
    auto: false,
  }));
  let f = fill(all, focus, x, order);

  // 2. Spare units open the item's other satellites, in priority order, while each fits whole.
  if (f.remaining > 0 && input.satellites && input.satellites.length > 0) {
    let spare = f.remaining;
    const autos: SizedPanel[] = [];
    for (const s of input.satellites) {
      if (s.size <= spare) {
        autos.push({ key: s.key, size: s.size, grow: false, auto: true });
        spare -= s.size;
      }
    }
    if (autos.length > 0) {
      all = [...all, ...autos];
      f = fill(all, focus, x, order);
    }
  }

  // 3. What's still spare goes to growing panels, rightmost first.
  const grownBy = new Array<number>(all.length).fill(0);
  let remaining = f.remaining;
  for (let g = all.length - 1; g >= 0 && remaining > 0; g--) {
    if (!all[g].grow || f.states[g] !== "full") continue;
    const add = cap ? Math.min(remaining, growthStep(all[g].size)) : remaining;
    f.units[g] += add;
    grownBy[g] = add;
    remaining -= add;
  }

  const slots: Slot[] = all.map((p, i) => ({
    key: p.key,
    size: p.size,
    state: f.states[i],
    units: f.units[i],
    grownBy: grownBy[i],
    auto: p.auto,
  }));
  return {
    slots,
    emptyUnits: remaining,
    usedUnits: f.units.reduce((a, b) => a + b, 0),
    units: x,
  };
}

export interface UnitsForWidthOptions {
  /** Target width of one unit, in px. Default 175. */
  targetUnit?: number;
  /** Most units on any screen; past this, units get wider. Default 12. */
  maxUnits?: number;
  /** Below this width it's the phone layout: one unit, no rail. Default 700. */
  phoneBelow?: number;
  /** Rail width on big screens. Default 52. */
  rail?: number;
}

export function railWidth(
  width: number,
  opts: UnitsForWidthOptions = {},
): number {
  return width < (opts.phoneBelow ?? 700) ? 0 : (opts.rail ?? 52);
}

export function unitsForWidth(
  width: number,
  opts: UnitsForWidthOptions = {},
): number {
  if (width < (opts.phoneBelow ?? 700)) return 1;
  const usable = width - railWidth(width, opts);
  const x = Math.floor(usable / (opts.targetUnit ?? 175));
  return Math.max(1, Math.min(opts.maxUnits ?? 12, x));
}

export interface PlacedSlot {
  key: string;
  /** From the left edge of the screen, in px. */
  left: number;
  width: number;
  /**
   * Width to lay the panel's content out at. Equals `width`, except for a
   * partial slot, whose content is laid out at its declared size and clipped.
   */
  contentWidth: number;
}

export interface Placement {
  slots: PlacedSlot[];
  empty: { left: number; width: number } | null;
  unitPx: number;
}

/** Turn a layout into px positions for a screen `width` wide. */
export function toPixels(
  layout: LayoutResult,
  width: number,
  opts: UnitsForWidthOptions & { spine?: number } = {},
): Placement {
  const spine = opts.spine ?? 10;
  const rail = railWidth(width, opts);
  const spines = layout.slots.filter((s) => s.state === "spine").length;
  const unitPx = (width - rail - spines * spine) / layout.units;
  let left = rail;
  const slots = layout.slots.map((s) => {
    const w = s.state === "spine" ? spine : s.units * unitPx;
    const placed: PlacedSlot = {
      key: s.key,
      left,
      width: w,
      contentWidth: s.state === "partial" ? s.size * unitPx : w,
    };
    left += w;
    return placed;
  });
  const empty =
    layout.emptyUnits > 0 ? { left, width: layout.emptyUnits * unitPx } : null;
  return { slots, empty, unitPx };
}

/**
 * Compact text form of a layout, used by the tests and handy in logs:
 * `key:3` whole, `key:3+1` grown, `key:1/3~` partial, `key:2/3!` squeezed,
 * `key:|` spine, a trailing `a` marks an auto satellite, `_:2` is the empty slot.
 */
export function describeLayout(layout: LayoutResult): string {
  const parts = layout.slots.map((s) => {
    let v: string;
    if (s.state === "spine") v = "|";
    else if (s.state === "partial") v = `${s.units}/${s.size}~`;
    else if (s.state === "squeezed") v = `${s.units}/${s.size}!`;
    else if (s.grownBy > 0) v = `${s.size}+${s.grownBy}`;
    else v = `${s.units}`;
    return `${s.key}:${v}${s.auto ? "a" : ""}`;
  });
  if (layout.emptyUnits > 0) parts.push(`_:${layout.emptyUnits}`);
  return parts.join(" ");
}
