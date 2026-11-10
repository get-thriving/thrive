/** A section's summary for a count: "none", "1 task", "3 tasks". */
export function countSummary(
  count: number,
  singular: string,
  plural: string,
): string {
  if (count === 0) {
    return "none";
  }
  return `${count} ${count === 1 ? singular : plural}`;
}
