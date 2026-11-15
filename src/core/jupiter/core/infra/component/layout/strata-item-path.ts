/**
 * The path an item of a list leads to: its first link's, which is what opening
 * it follows (`strataOpenItem`). Null for an item with no link, which does
 * something else when it is pressed and is not a place in the list.
 */
export function strataItemPath(item: HTMLElement): string | null {
  const link = item.querySelector<HTMLAnchorElement>("a[href]");
  if (link === null) {
    return null;
  }
  return new URL(link.href, window.location.origin).pathname;
}
