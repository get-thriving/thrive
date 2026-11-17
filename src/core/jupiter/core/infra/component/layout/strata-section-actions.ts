/**
 * What `z` and `c` can do with a section of a stack, the one the keyboard focus
 * is in. Both the keys and the footer ask here, so a key is listed only where
 * it works.
 *
 * A section that stands in for one split out into a column is neither: its
 * body is in the column.
 */
function isInColumn(section: HTMLElement): boolean {
  return section.dataset.strataSectionSplit !== undefined;
}

/** Whether `z` collapses or expands the section: not the fixed first one. */
export function strataSectionCollapsible(section: HTMLElement): boolean {
  return (
    section.dataset.strataSectionFixed === undefined && !isInColumn(section)
  );
}

/**
 * Whether `c` splits the section out into a column of its own: it has items to
 * fill one, and the window has room for columns (`data-strata-splittable`).
 */
export function strataSectionSplittable(section: HTMLElement): boolean {
  return section.dataset.strataSplittable === "true" && !isInColumn(section);
}
