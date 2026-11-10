/**
 * Which open panel each part of the path belongs to, for the breadcrumb: a part
 * belongs to the first panel whose own URL reaches it, so `habits / habits / 3`
 * is the list for the first two and the habit for the last.
 *
 * `panelSegments` is how many parts of the path each panel's URL has, in the
 * order of the path. Parts past the last panel's URL belong to the last panel,
 * and there is no column when there are no panels.
 */
export function strataSegmentColumns(
  panelSegments: number[],
  segmentCount: number,
): number[] {
  return Array.from({ length: segmentCount }, (_, segment) => {
    if (panelSegments.length === 0) {
      return -1;
    }
    const owner = panelSegments.findIndex((count) => count > segment);
    return owner === -1 ? panelSegments.length - 1 : owner;
  });
}
