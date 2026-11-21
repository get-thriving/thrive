import { useSyncExternalStore } from "react";

import type { StrataBar } from "#/core/infra/component/layout/strata-bar-context";

/**
 * Where a column's header has room for what a section hands it (ADR 0021): the
 * element the controls are drawn into, and what the bar around it says to them
 * (how many to fold).
 */
export interface StrataHeaderSlot {
  element: HTMLElement;
  bar: StrataBar | null;
}

/**
 * The key of the slot ahead of a column's name, beside the one among its
 * controls.
 */
export function strataHeaderLeadKey(columnKey: string): string {
  return `${columnKey}#lead`;
}

const slots = new Map<string, StrataHeaderSlot>();
const listeners = new Set<() => void>();

/** A header says it has a slot, or that it has none now (`null`). */
export function strataSetHeaderSlot(
  columnKey: string,
  slot: StrataHeaderSlot | null,
): void {
  if (slot === null) {
    slots.delete(columnKey);
  } else {
    slots.set(columnKey, slot);
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * The slot in the header of a column, once it is on the page: `null` before,
 * on the server, for a column with none, and for `null` (a section that has no
 * column header to give its controls to).
 */
export function useStrataHeaderSlot(
  columnKey: string | null,
): StrataHeaderSlot | null {
  return useSyncExternalStore(
    subscribe,
    () => (columnKey === null ? null : (slots.get(columnKey) ?? null)),
    () => null,
  );
}
