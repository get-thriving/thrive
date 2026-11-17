/**
 * Opens an item as a click on it would: the first link in it is followed, which
 * opens what it leads to as the next column; an item without one is clicked
 * itself, for a card that does something else when it is pressed. An item that
 * is picked (`data-strata-selectable`) is clicked even when it has a link, as
 * pressing it picks it, which is what `↵` is for there.
 */
export function strataOpenItem(item: HTMLElement): void {
  if (item.hasAttribute("data-strata-selectable")) {
    item.click();
    return;
  }
  const link = item.querySelector<HTMLAnchorElement>("a[href]");
  (link ?? item).click();
}
