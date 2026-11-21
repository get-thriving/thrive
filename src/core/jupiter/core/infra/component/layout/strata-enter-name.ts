import { strataScrollToCentre } from "#/core/infra/component/layout/strata-scroll-to-centre";

const NAME = "input[name='name'], textarea[name='name']";
const OWNER = "[data-strata-section], [data-strata-column]";

/**
 * The field for the name of the entity within `root`, if it has one that is
 * shown and can be written in. With `ownOnly`, only the root's own, not one
 * that a section or a column nested in it holds.
 */
export function strataNameField(
  root: HTMLElement,
  ownOnly: boolean,
): HTMLInputElement | HTMLTextAreaElement | null {
  const fields = Array.from(
    root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(NAME),
  );
  return (
    fields.find(
      (field) =>
        (!ownOnly || field.closest(OWNER) === root) &&
        !field.disabled &&
        !field.readOnly &&
        (typeof field.checkVisibility !== "function" ||
          field.checkVisibility({ checkVisibilityCSS: true })),
    ) ?? null
  );
}

/**
 * Goes into the name of the entity, within `root`: the field takes the focus,
 * with the caret at the end of the name, so typing goes on from there, and
 * `Escape` leaves it. Says whether there was one to go into.
 */
export function strataEnterName(root: HTMLElement, ownOnly = true): boolean {
  const field = strataNameField(root, ownOnly);
  if (field === null) {
    return false;
  }
  field.focus({ preventScroll: true });
  try {
    const end = field.value.length;
    field.setSelectionRange(end, end);
  } catch {
    // Some types have no selection.
  }
  strataScrollToCentre(field);
  return true;
}
