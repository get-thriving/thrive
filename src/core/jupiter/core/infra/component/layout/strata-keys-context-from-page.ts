import { isEditableFieldTarget } from "#/core/infra/component/layout/is-editable-field-target";
import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
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
  items: 0,
  targets: 0,
};

function overlayOnPage(): StrataKeysContext["overlay"] {
  if (document.querySelector("[data-strata-hints]") !== null) {
    return "hints";
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
    items: scope === null ? 0 : strataSectionItems(scope).length,
    targets,
  };
}
