// The "Create & Another" button of the creation pages. It makes the same
// entity the regular "Create" one does, but instead of going to the freshly
// made entity it comes back to the creation page, ready for the next one.

import { useSearchParams } from "@remix-run/react";
import type { ComponentType } from "react";

/** The intent a creation form is submitted with by "Create & Another". */
export const CREATE_AND_ANOTHER_INTENT = "create-and-another";

/**
 * The count of entities made in a row, which the "Create & Another" redirect
 * moves along. Coming back to the creation page is not by itself enough to
 * leave an empty form behind - it's the location the page is already at, so
 * React keeps the page as it stands, values and all - and this is what tells
 * one entity's turn at the page apart from the next one's.
 */
export const CREATE_ANOTHER_INDEX_PARAM = "createAnotherIdx";

/** Was a creation form submitted through the "Create & Another" button? */
export function isCreateAndAnother(intent: string | undefined): boolean {
  return intent === CREATE_AND_ANOTHER_INTENT;
}

/**
 * The creation page itself, query included - so whatever context the page was
 * opened with is still around for the next entity - with the count of entities
 * made in a row moved along.
 */
export function createAnotherLocation(request: Request): string {
  const url = new URL(request.url);
  url.searchParams.set(
    CREATE_ANOTHER_INDEX_PARAM,
    `${createAnotherIndex(url.searchParams) + 1}`,
  );
  return `${url.pathname}${url.search}`;
}

/**
 * The query without the differentiator, for the links a creation page makes
 * out of it - a count of the entities made here has no business travelling
 * anywhere else.
 */
export function withoutCreateAnotherIndex(
  query: URLSearchParams,
): URLSearchParams {
  const cleaned = new URLSearchParams(query);
  cleaned.delete(CREATE_ANOTHER_INDEX_PARAM);
  return cleaned;
}

/**
 * A creation page that starts over after each "Create & Another", and is left
 * alone by the other navigations a page makes to itself - a failed create, or
 * the calendar pages writing their time slot into the query - since those
 * leave the count where it was.
 */
export function createAnotherAware(Page: ComponentType): ComponentType {
  function CreateAnotherAware() {
    const [query] = useSearchParams();
    return <Page key={createAnotherIndex(query)} />;
  }

  CreateAnotherAware.displayName = `CreateAnotherAware(${
    Page.displayName ?? Page.name
  })`;

  return CreateAnotherAware;
}

function createAnotherIndex(query: URLSearchParams): number {
  const index = Number.parseInt(
    query.get(CREATE_ANOTHER_INDEX_PARAM) ?? "",
    10,
  );
  return Number.isNaN(index) ? 0 : index;
}
