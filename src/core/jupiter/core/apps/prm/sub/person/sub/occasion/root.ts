import type { Occasion } from "@jupiter/webapi-client";

import { compareBirthdaysNaturally } from "#/core/common/birthday";

export function sortOccasionsNaturally<T extends Occasion>(
  occasions: T[],
): T[] {
  return [...occasions].sort((a, b) => {
    return compareBirthdaysNaturally(a.date, b.date);
  });
}
