/**
 * Puts the keyboard focus on an item and brings it into view, without moving
 * what is already in view more than it takes.
 */
export function strataFocusItem(item: HTMLElement): void {
  item.focus({ preventScroll: true });
  item.scrollIntoView({ block: "nearest", inline: "nearest" });
}
