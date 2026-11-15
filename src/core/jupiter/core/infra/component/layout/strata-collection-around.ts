import { strataItemPath } from "#/core/infra/component/layout/strata-item-path";
import { strataSectionItems } from "#/core/infra/component/layout/strata-section-items";
import {
  strataPosition,
  type StrataPosition,
} from "#/core/infra/strata/strata-position";

const OWNER = "[data-strata-section], [data-strata-column]";

/** The items of a collection that lead somewhere, and where one of them is. */
export interface StrataCollectionAround {
  /** Only those with a link, in the order they are shown. */
  items: HTMLElement[];
  /** The path each leads to. */
  paths: string[];
  position: StrataPosition;
}

/**
 * The collection an open item is in, read from the column before it (ADR 0021):
 * the items it shows, after its filters and in its order, which a list marks
 * with `data-strata-item`. The open item is the one whose path the page is at,
 * and its collection is what holds it, the section it is in or the column
 * itself, so the items of another section of the same column are not in it.
 * Null when the page is at none of them.
 */
export function strataCollectionAround(
  frame: HTMLElement,
  pathname: string,
): StrataCollectionAround | null {
  const owners = new Set<HTMLElement>();
  for (const item of frame.querySelectorAll<HTMLElement>(
    "[data-strata-item]",
  )) {
    const owner = item.closest<HTMLElement>(OWNER);
    if (owner !== null && owner.closest("[data-strata-column]") === frame) {
      owners.add(owner);
    }
  }
  for (const owner of owners) {
    const items = strataSectionItems(owner).filter(
      (item) => strataItemPath(item) !== null,
    );
    const paths = items.map((item) => strataItemPath(item) as string);
    const position = strataPosition(paths, pathname);
    if (position !== null) {
      return { items, paths, position };
    }
  }
  return null;
}
