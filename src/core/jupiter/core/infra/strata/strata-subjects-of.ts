import type { ColumnKind } from "#/core/infra/strata/layout";

/**
 * Which columns are about the same subject (PLAN 3.1). A route column is a new
 * subject, and the split columns right after it show sections of it, so they
 * share its subject. `subject[i]` is the index of the route column that column
 * `i` belongs to, and `inFocusedSubject[i]` says whether it shares a subject
 * with the focused column (which does itself).
 */
export function strataSubjectsOf(
  kinds: ColumnKind[],
  focus: number,
): { subject: number[]; inFocusedSubject: boolean[] } {
  let current = 0;
  const subject = kinds.map((kind, index) => {
    if (kind === "route" || index === 0) {
      current = index;
    }
    return current;
  });
  return {
    subject,
    inFocusedSubject: subject.map((it) => it === subject[focus]),
  };
}
