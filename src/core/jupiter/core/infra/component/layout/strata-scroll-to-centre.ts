/**
 * Scrolls what holds an element, as far as the column it is in, so the element
 * is in the middle of it, and does nothing for one that is already in view.
 * Only vertically, and only the scrolling parts inside the column: a column
 * nested in another sits apart from it on screen, so what scrolls the outer
 * one does not move it, and `scrollIntoView` would also move the clipped frame
 * of a peek sideways.
 */
export function strataScrollToCentre(element: Element) {
  const frame = element.closest("[data-strata-column]");
  for (
    let holder = element.parentElement;
    holder !== null && holder !== frame;
    holder = holder.parentElement
  ) {
    const scrolls =
      holder.scrollHeight > holder.clientHeight &&
      /auto|scroll/.test(getComputedStyle(holder).overflowY);
    if (!scrolls) {
      continue;
    }
    const box = element.getBoundingClientRect();
    const view = holder.getBoundingClientRect();
    if (box.top >= view.top && box.bottom <= view.bottom) {
      continue;
    }
    holder.scrollTop += box.top - view.top - (view.height - box.height) / 2;
  }
}
