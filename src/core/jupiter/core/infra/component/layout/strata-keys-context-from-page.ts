import { strataHasEditable } from "#/core/infra/component/layout/strata-enter-editable";
import { strataColumnControl } from "#/core/infra/component/layout/strata-column-control";
import { strataColumnScrolls } from "#/core/infra/component/layout/strata-scroll-column";
import { isEditableFieldTarget } from "#/core/infra/component/layout/is-editable-field-target";
import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import {
  strataSectionCollapsible,
  strataSectionSplittable,
} from "#/core/infra/component/layout/strata-section-actions";
import {
  strataColumnSections,
  strataMapColumns,
} from "#/core/infra/component/layout/strata-map-columns";
import {
  strataFocusedItem,
  strataSectionItems,
} from "#/core/infra/component/layout/strata-section-items";
import type { StrataPlacedSlot } from "#/core/infra/strata/strata-layout-for";
import type { StrataKeysContext } from "#/core/infra/strata/strata-keys-context";
import { strataMapTargets } from "#/core/infra/strata/strata-map-targets";

/** What the page shows when nothing has the focus yet, as on the server. */
export const STRATA_QUIET_KEYS_CONTEXT: StrataKeysContext = {
  overlay: null,
  typing: null,
  focus: "column",
  columns: 0,
  split: false,
  sections: 0,
  collapsible: false,
  splittable: false,
  items: 0,
  editable: false,
  targets: 0,
  scrolls: false,
  position: false,
  resizable: false,
  menu: false,
  commands: false,
  closable: false,
};

// What the menu of commands lists: the actions of the sections, and the main
// action and the menu of the header. Only those on screen, and only the
// column's own, not those of a column nested in it.
function strataColumnHasCommands(frame: HTMLElement): boolean {
  return [
    ...frame.querySelectorAll<HTMLElement>(
      "[data-strata-actions], [data-strata-menu], [data-strata-layout]",
    ),
  ].some(
    (candidate) =>
      candidate.closest("[data-strata-column]") === frame &&
      (candidate.style.display === "contents" ||
        candidate.getClientRects().length > 0),
  );
}

function overlayOnPage(): StrataKeysContext["overlay"] {
  // The search dialog is modal, so nothing else is up while it is.
  if (document.querySelector("[data-strata-search]") !== null) {
    const active = document.activeElement;
    return active instanceof Element &&
      active.closest("[data-strata-search-results]") !== null
      ? "search-results"
      : "search";
  }
  // A dialog that asks to confirm is modal too: it is on top of everything.
  if (document.querySelector("[data-strata-confirm]") !== null) {
    return "confirm";
  }
  if (document.querySelector("[data-strata-hints]") !== null) {
    return "hints";
  }
  if (document.querySelector("[data-strata-app-menu]") !== null) {
    return "apps";
  }
  if (document.querySelector("[data-strata-new-menu]") !== null) {
    return "new";
  }
  if (document.querySelector("[data-strata-commands-search]") !== null) {
    return "commands-search";
  }
  if (document.querySelector("[data-strata-commands-menu]") !== null) {
    return "commands";
  }
  if (document.querySelector("[data-strata-map]") !== null) {
    return "map";
  }
  if (document.querySelector("[data-strata-find]") !== null) {
    return "find";
  }
  return null;
}

function typingOnPage(): StrataKeysContext["typing"] {
  const active = document.activeElement;
  if (isEditableFieldTarget(active)) {
    return "field";
  }
  return isTypingTarget(active) ? "layer" : null;
}

/**
 * Reads from the page what decides which keys work right now (see
 * `StrataKeysContext`). The column the keys act on is the focused one, or the
 * only one when there is a lone column, which is not marked as focused. An
 * item counts as the focus only in that column: one that was opened keeps the
 * browser's focus while its page takes the layout's, in a column to its right.
 */
export function strataKeysContextFromPage(
  slots: readonly StrataPlacedSlot[],
): StrataKeysContext {
  const overlay = overlayOnPage();
  const typing = typingOnPage();
  const frames = document.querySelectorAll<HTMLElement>("[data-strata-column]");
  const frame =
    document.querySelector<HTMLElement>(
      '[data-strata-column][data-focused="true"]',
    ) ?? (frames.length === 1 ? frames[0] : null);
  const targets = strataMapTargets(strataMapColumns(slots)).length;
  if (frame === null) {
    return { ...STRATA_QUIET_KEYS_CONTEXT, overlay, typing, targets };
  }

  const split = frame.dataset.strataSplit !== undefined;
  const sections = strataColumnSections(frame);
  const active = document.activeElement;

  // Which list the keys go through: the section the focus is in, or what a
  // column has on its own, a split's one section or a list with no sections.
  const item = strataFocusedItem();
  const onItem =
    item !== null &&
    item.closest<HTMLElement>("[data-strata-column]") === frame;
  const section =
    active === null
      ? undefined
      : sections.find((candidate) => candidate.contains(active));
  const scope = onItem
    ? item.closest<HTMLElement>("[data-strata-section], [data-strata-column]")
    : section !== undefined
      ? section
      : split
        ? (frame.querySelector<HTMLElement>(
            '[data-strata-section-split="column"]',
          ) ?? frame)
        : sections.length === 0
          ? frame
          : null;

  return {
    overlay,
    typing,
    focus: onItem ? "item" : section !== undefined ? "section" : "column",
    columns: slots.length,
    split,
    sections: sections.length,
    collapsible: section !== undefined && strataSectionCollapsible(section),
    splittable: section !== undefined && strataSectionSplittable(section),
    items: scope === null ? 0 : strataSectionItems(scope).length,
    editable: !onItem && scope !== null && strataHasEditable(scope),
    targets,
    scrolls: strataColumnScrolls(frame),
    position: strataColumnControl(frame, "[data-strata-position]") !== null,
    resizable: strataColumnControl(frame, "[data-strata-resizable]") !== null,
    menu: strataColumnControl(frame, "[data-strata-menu]") !== null,
    commands: strataColumnHasCommands(frame),
    closable: strataColumnControl(frame, "[data-strata-close]") !== null,
  };
}
