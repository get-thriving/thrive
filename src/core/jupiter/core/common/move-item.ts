/**
 * Moves the item at `index` one place up (`-1`) or down (`1`) in a list.
 *
 * Returns a new list, and the same list unchanged if the item is already at
 * that end or the index is not in the list.
 */
export function moveItem<T>(items: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (
    index < 0 ||
    index >= items.length ||
    target < 0 ||
    target >= items.length
  ) {
    return items;
  }

  const moved = [...items];
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved;
}
