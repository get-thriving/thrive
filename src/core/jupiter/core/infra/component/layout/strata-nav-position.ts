import { loadNavPosition } from "#/core/infra/nav-restoration";
import type { NavPosition } from "#/core/infra/nav-restoration";
import {
  STRATA_NAV_KEY_ATTRIBUTE,
  strataClearRemembered,
  strataColumnScroller,
} from "#/core/infra/component/layout/strata-scroll-column";
import { strataFocusItem } from "#/core/infra/component/layout/strata-focus-item";
import { strataItemPath } from "#/core/infra/component/layout/strata-item-path";
import {
  strataFocusedItem,
  strataSectionItems,
} from "#/core/infra/component/layout/strata-section-items";

/**
 * How an item of a list is told from the others when it is looked for again:
 * by where it leads, or else by its place in the list.
 */
function itemName(items: readonly HTMLElement[], item: HTMLElement): string {
  return strataItemPath(item) ?? `#${items.indexOf(item)}`;
}

function sectionsOf(column: Element): HTMLElement[] {
  return Array.from(
    column.querySelectorAll<HTMLElement>("[data-strata-section]"),
  ).filter(
    (el) =>
      el.closest("[data-strata-column]") === column &&
      el.dataset.strataSectionSplit === undefined &&
      el.dataset.strataSectionLent === undefined,
  );
}

/**
 * Where the keyboard is in the column the `scroller` belongs to, if it is on a
 * section or on an item of a list; null when it is anywhere else (the column
 * itself, its header, a column beside it), which says nothing new.
 */
export function strataNavPositionOf(scroller: HTMLElement): NavPosition | null {
  const column = scroller.closest<HTMLElement>("[data-strata-column]");
  const active = document.activeElement;
  if (column === null || !(active instanceof HTMLElement)) {
    return null;
  }
  if (active.closest("[data-strata-column]") !== column) {
    return null;
  }
  const section =
    active.closest<HTMLElement>("[data-strata-section]") ?? undefined;
  const owner =
    section !== undefined && section.closest("[data-strata-column]") === column
      ? section
      : null;
  if (owner !== null && !sectionsOf(column).includes(owner)) {
    return null;
  }
  const scope = owner ?? column;
  const item = strataFocusedItem();
  const items = item === null ? [] : strataSectionItems(scope);
  if (owner === null && item === null) {
    return null;
  }
  return {
    section: owner?.dataset.strataSection ?? null,
    item: item !== null && items.includes(item) ? itemName(items, item) : null,
  };
}

/**
 * The item of the list in `scope` that is open in the column beside it, if one
 * is. It is where the selection is only when nothing was kept: the selection
 * is the last item the keyboard was on, which may not be the open one, and it
 * is the one thing that is drawn selected.
 */
function openItemOf(scope: HTMLElement): HTMLElement | undefined {
  const open = window.location.pathname;
  return strataSectionItems(scope).find((it) => strataItemPath(it) === open);
}

/** What the position kept for a column is on now, if it is still there. */
function rememberedTarget(
  column: HTMLElement,
): { section?: HTMLElement; item?: HTMLElement } | null {
  const scroller = strataColumnScroller(column);
  const key = scroller?.getAttribute(STRATA_NAV_KEY_ATTRIBUTE);
  const position =
    key === null || key === undefined ? null : loadNavPosition(key);
  if (position === null) {
    // A list of the column's own, with one of its items open.
    if (sectionsOf(column).length === 0) {
      const item = openItemOf(column);
      return item === undefined ? null : { item };
    }
    return null;
  }
  const section =
    position.section === null
      ? undefined
      : sectionsOf(column).find(
          (el) => el.dataset.strataSection === position.section,
        );
  if (position.section !== null && section === undefined) {
    return null;
  }
  const items =
    position.item === null ? [] : strataSectionItems(section ?? column);
  const item = items.find((it) => itemName(items, it) === position.item);
  if (item === undefined && section === undefined) {
    return null;
  }
  return { section, item };
}

/**
 * Marks what the position kept for the column is on (`data-strata-remembered`),
 * and nothing else, so it is drawn selected as when it has the focus, while the
 * keyboard is elsewhere: the item of a list, or the section when it was not on
 * an item.
 */
export function strataMarkNavPosition(column: HTMLElement): void {
  strataClearRemembered(column);
  const target = rememberedTarget(column);
  (target?.item ?? target?.section)?.setAttribute("data-strata-remembered", "");
}

/**
 * Puts the keyboard on the place after the one it was on in `column`, the
 * section or the item of a list, for `step` 1 (`j`), or before it, for -1 (`k`),
 * and says whether there was a place it was on: `j` and `k` from the column
 * itself go on from there, and not from the first one or the last, nor do they
 * spend a press on what is drawn selected already (ADR 0021). They stop at the
 * ends. What is no longer there, such as an item that is gone from the list, is
 * not a place.
 */
export function strataResumeNavPosition(
  column: HTMLElement,
  step: 1 | -1,
): boolean {
  const target = rememberedTarget(column);
  if (target === null) {
    return false;
  }
  if (target.item !== undefined) {
    const items = strataSectionItems(target.section ?? column);
    const index = items.indexOf(target.item);
    const next = items[Math.max(0, Math.min(items.length - 1, index + step))];
    strataFocusItem(next ?? target.item);
    return true;
  }
  if (target.section === undefined) {
    return false;
  }
  const sections = sectionsOf(column);
  const index = sections.indexOf(target.section);
  const section =
    sections[Math.max(0, Math.min(sections.length - 1, index + step))] ??
    target.section;
  section.focus({ preventScroll: true });
  section.scrollIntoView({ block: "nearest" });
  return true;
}
