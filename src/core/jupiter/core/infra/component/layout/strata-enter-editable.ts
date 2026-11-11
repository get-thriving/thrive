import { strataScrollToCentre } from "#/core/infra/component/layout/strata-scroll-to-centre";

const EDITABLE = "[contenteditable='true']";

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
 */
export function strataEnterEditable(
  root: HTMLElement,
  match: Range | null = null,
): boolean {
  const editables = Array.from(
    root.querySelectorAll<HTMLElement>(EDITABLE),
  ).filter(
    (element) =>
      typeof element.checkVisibility !== "function" ||
      element.checkVisibility({ checkVisibilityCSS: true }),
  );

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
