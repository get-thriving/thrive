/**
 * Opens an item as a click on it would: the first link in it is followed, which
 * opens what it leads to as the next column; an item without one is clicked
 * itself, for a card that does something else when it is pressed.
 */
export function strataOpenItem(item: HTMLElement): void {
  const link = item.querySelector<HTMLAnchorElement>("a[href]");
  (link ?? item).click();
}
