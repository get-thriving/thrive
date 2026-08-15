import type { Circle } from "@jupiter/webapi-client";

export function sortCirclesNaturally<T extends Circle>(circles: T[]): T[] {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  return [...circles].sort((a, b) => {
    return collator.compare(String(a.name), String(b.name));
  });
}
