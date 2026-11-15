import type { StrataPlacedSlot } from "#/core/infra/strata/strata-layout-for";
import type { StrataMapColumn } from "#/core/infra/strata/strata-map-column";

/** The frame of the column with a key, if it is on the page. */
export function strataColumnFrame(key: string): HTMLElement | null {
  return (
    Array.from(
      document.querySelectorAll<HTMLElement>("[data-strata-column]"),
    ).find((frame) => frame.dataset.strataColumnKey === key) ?? null
  );
}

/**
 * The sections of a column that a key can put the focus on: those of its
 * stacks, not of a column nested in it, and not the ones that stand in for a
 * section which was split out into a column of its own.
 */
export function strataColumnSections(frame: HTMLElement): HTMLElement[] {
  if (frame.dataset.strataSplit !== undefined) {
    return [];
  }
  return Array.from(
    frame.querySelectorAll<HTMLElement>("[data-strata-section][tabindex]"),
  ).filter(
    (section) =>
      section.dataset.strataSectionSplit === undefined &&
      section.closest("[data-strata-column]") === frame,
  );
}

/**
 * The open columns as the map shows them, in the order of the layout: what
 * each is, and the sections of its stack. What is on the page gives the names.
 */
export function strataMapColumns(
  slots: readonly StrataPlacedSlot[],
): StrataMapColumn[] {
  return slots.flatMap((slot) => {
    const frame = strataColumnFrame(slot.key);
    if (frame === null) {
      return [];
    }
    return [
      {
        key: slot.key,
        label: frame.dataset.strataColumnLabel ?? "",
        subject: slot.subject,
        focused: slot.focused,
        state: slot.state,
        sections: strataColumnSections(frame).map((section) => ({
          id: section.dataset.strataSection ?? section.id,
          title: section.dataset.strataSectionTitle ?? section.id,
        })),
      },
    ];
  });
}
