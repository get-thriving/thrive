// The "Create & Another" button of the creation pages. It makes the same
// entity the regular "Create" one does, but instead of going to the freshly
// made entity it comes back to the creation page, ready for the next one.

/** The intent a creation form is submitted with by "Create & Another". */
export const CREATE_AND_ANOTHER_INTENT = "create-and-another";

/**
 * How many entities were made in a row on a creation page. It rides along in
 * the query because coming back to a page is not by itself enough to clear
 * the form it holds - React keeps the page as it stands unless something
 * tells it the page is a new one, and a number that goes up on every
 * "Create & Another" is that something.
 */
export const CREATE_ANOTHER_PARAM = "createAnother";

/** Was a creation form submitted through the "Create & Another" button? */
export function isCreateAndAnother(intent: string | undefined): boolean {
  return intent === CREATE_AND_ANOTHER_INTENT;
}

/**
 * The creation page itself, query included - so whatever context the page was
 * opened with is still around for the next entity - with the count of
 * entities made in a row moved one up.
 */
export function createAnotherLocation(request: Request): string {
  const url = new URL(request.url);
  url.searchParams.set(
    CREATE_ANOTHER_PARAM,
    `${createAnotherCount(url.searchParams) + 1}`,
  );
  return `${url.pathname}${url.search}`;
}

/**
 * The query of a creation page without the bookkeeping above, for the links
 * and redirects that carry the query on to some other page.
 */
export function withoutCreateAnother(
  searchParams: URLSearchParams,
): URLSearchParams {
  const cleaned = new URLSearchParams(searchParams);
  cleaned.delete(CREATE_ANOTHER_PARAM);
  return cleaned;
}

/** How many entities a creation page has made in a row so far. */
export function createAnotherCount(searchParams: URLSearchParams): number {
  const raw = searchParams.get(CREATE_ANOTHER_PARAM);
  if (raw === null) {
    return 0;
  }

  const count = parseInt(raw, 10);
  return Number.isFinite(count) && count > 0 ? count : 0;
}
