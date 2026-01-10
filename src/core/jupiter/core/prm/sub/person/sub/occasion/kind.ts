import { OccasionKind } from "@jupiter/webapi-client";

export function occasionKindName(kind: OccasionKind): string {
  switch (kind) {
    case OccasionKind.BIRTHDAY:
      return "Birthday";
    case OccasionKind.ANNIVERSARY:
      return "Anniversary";
    case OccasionKind.HOLIDAY:
      return "Holiday";
    case OccasionKind.OTHER:
      return "Other";
  }
}
