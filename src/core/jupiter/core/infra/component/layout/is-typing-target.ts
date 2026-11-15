/**
 * Whether a key event came from somewhere the user is typing, or from a dialog
 * or menu laid over the columns, so single-key shortcuts must stay out of it.
 * The same goes for a control that waits for the user to choose a key for an
 * action (`data-strata-key-capture`, on the settings page): every key is its.
 */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }
  if (target.closest("input, textarea, select")) {
    return true;
  }
  if (target instanceof HTMLElement && target.isContentEditable) {
    return true;
  }
  return (
    target.closest(
      '[contenteditable="true"], [role="dialog"], [role="menu"], [role="listbox"], [aria-modal="true"], [data-strata-key-capture]',
    ) !== null
  );
}
