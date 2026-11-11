// Inputs that take typing: they are focused, not clicked.
const TEXT_LIKE_INPUTS = new Set([
  "",
  "text",
  "search",
  "email",
  "url",
  "tel",
  "password",
  "number",
  "date",
  "datetime-local",
  "month",
  "time",
  "week",
]);

// Inputs that open a picker of their own.
const PICKER_INPUTS = new Set([
  "date",
  "datetime-local",
  "month",
  "time",
  "week",
]);

function openPicker(element: HTMLInputElement | HTMLSelectElement) {
  try {
    element.showPicker();
  } catch {
    // Not every browser opens one, and some refuse without a click.
  }
}

function caretToEnd(element: HTMLInputElement | HTMLTextAreaElement) {
  try {
    const end = element.value.length;
    element.setSelectionRange(end, end);
  } catch {
    // Some types, such as number, have no selection.
  }
}

function caretToEndOfContent(element: HTMLElement) {
  const selection = window.getSelection();
  if (selection === null) {
    return;
  }
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * What a click does, as the browser does it: the press, the focus it brings
 * and the release, then the click, which follows a link or submits a form. The
 * press is why a menu or a select that opens on it does open.
 */
function press(element: HTMLElement) {
  const init: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window,
    button: 0,
  };
  const notPrevented = element.dispatchEvent(new MouseEvent("mousedown", init));
  if (notPrevented) {
    element.focus({ preventScroll: true });
  }
  element.dispatchEvent(new MouseEvent("mouseup", init));
  element.click();
}

/**
 * Does to an element what choosing it by hint should: a field takes the focus,
 * with the caret at the end of what is in it, so typing goes on from there; a
 * select or a date opens its picker; anything else is pressed, as with a click.
 */
export function strataActivateHintTarget(element: HTMLElement) {
  if (element instanceof HTMLInputElement) {
    if (!TEXT_LIKE_INPUTS.has(element.type)) {
      press(element);
      return;
    }
    element.focus();
    caretToEnd(element);
    if (PICKER_INPUTS.has(element.type)) {
      openPicker(element);
    }
    return;
  }
  if (element instanceof HTMLTextAreaElement) {
    element.focus();
    caretToEnd(element);
    return;
  }
  if (element instanceof HTMLSelectElement) {
    element.focus();
    openPicker(element);
    return;
  }
  if (element.isContentEditable) {
    element.focus();
    caretToEndOfContent(element);
    return;
  }
  press(element);
}
