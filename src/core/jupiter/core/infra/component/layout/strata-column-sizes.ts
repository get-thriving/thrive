import { useSyncExternalStore } from "react";

/** Where the sizes the user gave to columns are kept, in this browser. */
export const STRATA_COLUMN_SIZES_STORAGE_KEY = "strata:column-sizes";

const NONE: ReadonlyMap<string, number> = new Map();
const listeners = new Set<() => void>();
let snapshot: ReadonlyMap<string, number> | undefined;

function parse(raw: string | null): ReadonlyMap<string, number> {
  if (raw === null) {
    return NONE;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return NONE;
    }
    const deltas = new Map<string, number>();
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isInteger(value) && value !== 0) {
        deltas.set(key, value);
      }
    }
    return deltas;
  } catch {
    return NONE;
  }
}

function read(): ReadonlyMap<string, number> {
  if (snapshot === undefined) {
    try {
      snapshot = parse(
        window.localStorage.getItem(STRATA_COLUMN_SIZES_STORAGE_KEY),
      );
    } catch {
      snapshot = NONE;
    }
  }
  return snapshot;
}

function publish(next: ReadonlyMap<string, number>): void {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

/**
 * Keeps how many units a column was made wider (or narrower, below zero) than
 * its route declares, under its key (ADR 0021). Nothing is kept for a column
 * that is as declared. It is in the browser's local storage, so it holds across
 * visits, and is read again when another tab changes it.
 */
export function strataSetColumnDelta(columnKey: string, delta: number): void {
  const next = new Map(read());
  if (delta === 0) {
    next.delete(columnKey);
  } else {
    next.set(columnKey, delta);
  }
  publish(next);
  try {
    window.localStorage.setItem(
      STRATA_COLUMN_SIZES_STORAGE_KEY,
      JSON.stringify(Object.fromEntries(next)),
    );
  } catch {
    // Without storage the size holds for this visit only.
  }
}

/** Every column back to the size its route declares. */
export function strataResetColumnDeltas(): void {
  publish(NONE);
  try {
    window.localStorage.removeItem(STRATA_COLUMN_SIZES_STORAGE_KEY);
  } catch {
    // As above.
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STRATA_COLUMN_SIZES_STORAGE_KEY || event.key === null) {
      snapshot = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** The changes the user made to the sizes of columns, by column key. */
export function useStrataColumnDeltas(): ReadonlyMap<string, number> {
  return useSyncExternalStore(subscribe, read, () => NONE);
}
