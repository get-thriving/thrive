/**
 * Submits the form an action is in, as the button of that action would: with
 * its `intent`. The button may not be on screen (a drop-down keeps its choices
 * out of the page until it is opened), so a submit button is made for the
 * moment, and is gone as soon as the form has been submitted. The form is the
 * one with the id `formId`, when the action says so, else the one it is in.
 */
export function strataSubmitIntent(
  from: Element | null,
  intent: string,
  formId?: string,
): void {
  const named = formId === undefined ? null : document.getElementById(formId);
  const form =
    named instanceof HTMLFormElement ? named : (from?.closest("form") ?? null);
  if (form === null) {
    return;
  }
  const submitter = document.createElement("button");
  submitter.type = "submit";
  submitter.name = "intent";
  submitter.value = intent;
  submitter.hidden = true;
  form.appendChild(submitter);
  try {
    form.requestSubmit(submitter);
  } finally {
    submitter.remove();
  }
}
