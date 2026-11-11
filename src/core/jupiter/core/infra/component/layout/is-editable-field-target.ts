/**
 * Whether a key event came from a field the user can type into, and not from
 * a dialog, menu or list laid over the columns, which have their own way out.
 * It is the part of `isTypingTarget` that `Escape` can leave.
 */
export function isEditableFieldTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }
  if (
    target.closest(
      '[role="dialog"], [role="menu"], [role="listbox"], [aria-modal="true"]',
    ) !== null
  ) {
    return false;
  }
  if (target.closest("input, textarea, select")) {
    return true;
  }
  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target.closest('[contenteditable="true"]') !== null
  );
}
