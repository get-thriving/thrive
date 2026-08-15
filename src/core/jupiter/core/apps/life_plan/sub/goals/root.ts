import type { Goal, GoalSummary } from "@jupiter/webapi-client";

export function sortGoalsNaturally<T extends Goal | GoalSummary>(
  goals: T[],
): T[] {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  return [...goals].sort((a, b) => {
    return collator.compare(String(a.name), String(b.name));
  });
}
