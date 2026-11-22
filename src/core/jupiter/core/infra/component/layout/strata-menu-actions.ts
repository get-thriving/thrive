import { useSyncExternalStore } from "react";

import type { StrataCommand } from "#/core/infra/component/layout/strata-command";

/**
 * Some of the actions of a column, which the header had no room to draw and
 * which wait in the first section of its `⋯` menu instead (ADR 0021).
 */
export interface StrataMenuActions {
  /** What says it again when the same section draws it anew. */
  id: string;
  /**
   * The section they are from, when it is not the first one, whose controls are
   * in the header of the column itself.
   */
  title?: string;
  /**
   * The actions, as the commands they stand for (`strataCommandsOfActions`),
   * which the menu draws as its own entries.
   */
  commands: readonly StrataCommand[];
}

const NONE: readonly StrataMenuActions[] = [];

const byColumn = new Map<string, Map<string, StrataMenuActions>>();
const snapshots = new Map<string, readonly StrataMenuActions[]>();
const listeners = new Set<() => void>();

function publish(columnKey: string): void {
  const groups = byColumn.get(columnKey);
  if (groups === undefined || groups.size === 0) {
    byColumn.delete(columnKey);
    snapshots.delete(columnKey);
  } else {
    snapshots.set(columnKey, [...groups.values()]);
  }
  listeners.forEach((listener) => listener());
}

/** A section puts its actions in the menu of the column it is in. */
export function strataSetMenuActions(
  columnKey: string,
  actions: StrataMenuActions,
): void {
  let groups = byColumn.get(columnKey);
  if (groups === undefined) {
    groups = new Map();
    byColumn.set(columnKey, groups);
  }
  groups.set(actions.id, actions);
  publish(columnKey);
}

/** A section takes its actions back out, as there is room for them again. */
export function strataClearMenuActions(columnKey: string, id: string): void {
  const groups = byColumn.get(columnKey);
  if (groups === undefined || !groups.delete(id)) {
    return;
  }
  publish(columnKey);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** What the sections of a column have put in its menu, in the order they came. */
export function strataMenuActionsOf(
  columnKey: string | null,
): readonly StrataMenuActions[] {
  return columnKey === null ? NONE : (snapshots.get(columnKey) ?? NONE);
}

/** The same, as the menu reads it: it draws anew when they change. */
export function useStrataMenuActions(
  columnKey: string | null,
): readonly StrataMenuActions[] {
  return useSyncExternalStore(
    subscribe,
    () => strataMenuActionsOf(columnKey),
    () => NONE,
  );
}
