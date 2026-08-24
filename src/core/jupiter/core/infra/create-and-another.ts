// The "Create & Another" button of the creation pages. It makes the same
// entity the regular "Create" one does, but instead of going to the freshly
// made entity it comes back to the creation page, ready for the next one.

/** The intent a creation form is submitted with by "Create & Another". */
export const CREATE_AND_ANOTHER_INTENT = "create-and-another";

/** Was a creation form submitted through the "Create & Another" button? */
export function isCreateAndAnother(intent: string | undefined): boolean {
  return intent === CREATE_AND_ANOTHER_INTENT;
}

/**
 * The creation page itself, query included - so whatever context the page was
 * opened with is still around for the next entity.
 */
export function createAnotherLocation(request: Request): string {
  const url = new URL(request.url);
  return `${url.pathname}${url.search}`;
}
