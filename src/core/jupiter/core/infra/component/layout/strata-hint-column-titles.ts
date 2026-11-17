/** The name of a column, and where hint mode draws it. */
export interface StrataHintColumnTitle {
  /** The id of the column, to tell it from the others. */
  id: string;
  /** What the column is called. */
  title: string;
  /** The middle of what is seen of the column, from the left of the window. */
  x: number;
  /** The top of what is seen of the column. */
  y: number;
}

/**
 * The columns that some of the given elements are in, each once and in the
 * order of the page, with their titles, as their headers have them, and where
 * to draw them: at the top, in the middle of what is seen of the column. Hint
 * mode shows them so that the labels can be read as where they go: this column
 * or that one.
 */
export function strataHintColumnTitles(
  elements: readonly HTMLElement[],
): StrataHintColumnTitle[] {
  const seen = new Set<HTMLElement>();
  const titles: StrataHintColumnTitle[] = [];
  for (const element of elements) {
    const column = element.closest<HTMLElement>("[data-strata-column]");
    if (column === null || seen.has(column)) {
      continue;
    }
    // What the header of the column says, as the person reads it.
    const title =
      column
        .querySelector("[data-strata-header] [data-strata-title]")
        ?.textContent?.trim() ??
      column.dataset.strataColumnLabel ??
      "";
    if (title === "") {
      continue;
    }
    seen.add(column);
    const rect = column.getBoundingClientRect();
    const left = Math.max(rect.left, 0);
    const right = Math.min(rect.right, window.innerWidth);
    titles.push({
      id: column.dataset.strataColumn ?? title,
      title,
      x: Math.round((left + right) / 2),
      y: Math.round(Math.max(rect.top, 0)),
    });
  }
  return titles;
}
