import { OccasionKind } from "@jupiter/webapi-client";

export function occasionKindName(
  kind: OccasionKind,
  isBigScreen: boolean = true,
): string {
  switch (kind) {
    case OccasionKind.BIRTHDAY:
      return isBigScreen ? "Birthday" : "Bday";
    case OccasionKind.ANNIVERSARY:
      return isBigScreen ? "Anniversary" : "Anniv";
    case OccasionKind.HOLIDAY:
      return isBigScreen ? "Holiday" : "Holi";
    case OccasionKind.OTHER:
      return "Other";
  }
}
