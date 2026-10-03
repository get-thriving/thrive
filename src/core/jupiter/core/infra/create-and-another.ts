// The "Create & Another" button of the creation pages. It makes the same
// entity the regular "Create" one does, but instead of going to the freshly
// made entity it comes back to the creation page, ready for the next one.

/** The intent a creation form is submitted with by "Create & Another". */
export const CREATE_AND_ANOTHER_INTENT = "create-and-another";

/**
 * How many entities have been made in a row, kept in the query of the
 * creation page. Coming back to a page from itself is the one navigation
 * React and React Router hold on to the very same components for - and a form that
 * isn't built anew still shows whatever was just submitted. This changing
 * with every "Create & Another" is what tells the page above to put up a
 * brand new creation page instead.
 */
export const CREATE_ANOTHER_NONCE_PARAM = "createAnotherNonce";

/** Was a creation form submitted through the "Create & Another" button? */
export function isCreateAndAnother(intent: string | undefined): boolean {
  return intent === CREATE_AND_ANOTHER_INTENT;
}

/**
 * The creation page itself, query included - so whatever context the page was
 * opened with is still around for the next entity - with the nonce moved on.
 */
export function createAnotherLocation(url: URL): string {
  const next = new URL(url.href);
  next.searchParams.set(
    CREATE_ANOTHER_NONCE_PARAM,
    nextCreateAnotherNonce(next.searchParams.get(CREATE_ANOTHER_NONCE_PARAM)),
  );
  return `${next.pathname}${next.search}`;
}

/** The nonce a page is on right now - the empty one before any create. */
export function createAnotherNonce(searchParams: URLSearchParams): string {
  return searchParams.get(CREATE_ANOTHER_NONCE_PARAM) ?? "";
}

function nextCreateAnotherNonce(current: string | null): string {
  if (current === null) {
    return "1";
  }

  const currentAsNumber = Number(current);
  if (!Number.isSafeInteger(currentAsNumber) || currentAsNumber < 0) {
    return "1";
  }

  return `${currentAsNumber + 1}`;
}
