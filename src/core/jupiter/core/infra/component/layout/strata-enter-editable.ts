import { strataScrollToCentre } from "#/core/infra/component/layout/strata-scroll-to-centre";

const EDITABLE = "[contenteditable='true']";
const OWNER = "[data-strata-section], [data-strata-column]";

/**
 * What can be written in within `root` and is shown. With `ownOnly`, only what
 * is the root's own, not what a section or a column nested in it holds.
 */
function strataEditables(root: HTMLElement, ownOnly: boolean): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(EDITABLE)).filter(
    (element) =>
      (!ownOnly || element.closest(OWNER) === root) &&
      (typeof element.checkVisibility !== "function" ||
        element.checkVisibility({ checkVisibilityCSS: true })),
  );
}

/**
 * Whether a section, the section of a split column, or a column with no
 * sections has a note, or anything else that can be written in, of its own, for
 * `e` to go into.
 */
export function strataHasEditable(scope: HTMLElement): boolean {
  return strataEditables(scope, true).length > 0;
}

function putCaret(range: Range) {
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/**
 * Goes inside what can be written in, within `root`: a note, a doc. With a
 * `match` that is in it, as find leaves one, the caret goes to the start of the
 * match, so typing goes on from the place the search got to. Without one the
 * caret goes to the end of what is written, to carry on from there.
 *
 * Only what is shown and can be edited counts: a note that is read only, or in
 * a section that is collapsed, is not gone into. Says whether it went inside.
 * With `ownOnly`, what a section or a column nested in `root` holds does not
 * count.
 */
export function strataEnterEditable(
  root: HTMLElement,
  match: Range | null = null,
  ownOnly = false,
): boolean {
  const editables = strataEditables(root, ownOnly);

  const holder =
    match?.startContainer.parentElement?.closest<HTMLElement>(EDITABLE) ?? null;
  if (match !== null && holder !== null && editables.includes(holder)) {
    holder.focus({ preventScroll: true });
    const caret = document.createRange();
    caret.setStart(match.startContainer, match.startOffset);
    caret.collapse(true);
    putCaret(caret);
    strataScrollToCentre(match.startContainer.parentElement ?? holder);
    return true;
  }

  const last = editables[editables.length - 1];
  if (last === undefined) {
    return false;
  }
  last.focus({ preventScroll: true });
  const end = document.createRange();
  end.selectNodeContents(last);
  end.collapse(false);
  putCaret(end);
  strataScrollToCentre(last);
  return true;
}
