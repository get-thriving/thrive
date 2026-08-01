import type { AccessStatus } from "@jupiter/webapi-client";
import { AccessLevel } from "@jupiter/webapi-client";

export function accessLevelName(accessLevel: AccessLevel): string {
  switch (accessLevel) {
    case AccessLevel.READER:
      return "Reader";
    case AccessLevel.COMMENTER:
      return "Commenter";
    case AccessLevel.WRITER:
      return "Writer";
    case AccessLevel.OWNER:
      return "Owner";
  }
}

export const SHARING_ACCESS_LEVELS: AccessLevel[] = [
  AccessLevel.READER,
  AccessLevel.COMMENTER,
  AccessLevel.WRITER,
];

export const ALL_ACCESS_LEVELS: AccessLevel[] = [
  AccessLevel.READER,
  AccessLevel.COMMENTER,
  AccessLevel.WRITER,
  AccessLevel.OWNER,
];

function accessLevelRank(accessLevel: AccessLevel): number {
  switch (accessLevel) {
    case AccessLevel.READER:
      return 0;
    case AccessLevel.COMMENTER:
      return 1;
    case AccessLevel.WRITER:
      return 2;
    case AccessLevel.OWNER:
      return 3;
  }
}

export function accessLevelAllows(
  accessLevel: AccessLevel,
  requiredAccessLevel: AccessLevel,
): boolean {
  return accessLevelRank(accessLevel) >= accessLevelRank(requiredAccessLevel);
}

export function accessStatusAllowsWriterOrAbove(
  accessStatus: AccessStatus | null | undefined,
): boolean {
  if (accessStatus === undefined || accessStatus === null) {
    return false;
  }

  return accessLevelAllows(accessStatus.access_level, AccessLevel.WRITER);
}

export function accessStatusIsOwner(
  accessStatus: AccessStatus | null | undefined,
): boolean {
  if (accessStatus === undefined || accessStatus === null) {
    return false;
  }

  return accessStatus.access_level === AccessLevel.OWNER;
}
