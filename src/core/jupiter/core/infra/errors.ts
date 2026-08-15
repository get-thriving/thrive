import { ApiError } from "@jupiter/webapi-client";
import { isRouteErrorResponse } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";

/** The reason the WebAPI puts in the body of a `UserNotAllowedAccessToEntityError`. */
export const USER_NOT_ALLOWED_ACCESS_TO_ENTITY_REASON =
  "You are not allowed to access this entity";

/** What we show the user, and the `statusText` we tag the re-thrown response with. */
export const USER_NOT_ALLOWED_ACCESS_TO_ENTITY_LABEL =
  "You do not have the right access for this entity";

/**
 * The WebAPI reports a missing grant as a 401 whose body carries the reason
 * above. A plain 401 instead means the session expired.
 */
export function isUserNotAllowedAccessToEntityApiError(
  error: ApiError,
): boolean {
  return (
    error.status === StatusCodes.UNAUTHORIZED &&
    error.body?.reason === USER_NOT_ALLOWED_ACCESS_TO_ENTITY_REASON
  );
}

/**
 * What an error means for the user, independent of where it surfaces.
 *
 * This is also the expected/unexpected split that decides whether telemetry
 * raises an issue (see ADR 0012): the first three are outcomes a user can act
 * on, the last two are ours to fix.
 */
export type ErrorKind =
  | "access-denied"
  | "session-expired"
  | "not-found"
  | "error"
  | "unknown";

const UPGRADE_REQUIRED = 426;

export function classifyError(error: unknown): ErrorKind {
  // A 401 carrying a reason is a missing grant rather than a stale session.
  if (isUserNotAllowedAccessToEntityError(error)) {
    return "access-denied";
  }

  if (isRouteErrorResponse(error)) {
    if (error.status === UPGRADE_REQUIRED) {
      return "session-expired";
    }

    if (error.status === StatusCodes.NOT_FOUND) {
      return "not-found";
    }

    return "error";
  }

  if (error instanceof Error) {
    return "error";
  }

  return "unknown";
}

/** Whether this is a defect of ours rather than an outcome the user can act on. */
export function isUnexpectedError(error: unknown): boolean {
  const kind = classifyError(error);
  return kind === "error" || kind === "unknown";
}

export function isUserNotAllowedAccessToEntityError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return isUserNotAllowedAccessToEntityApiError(error);
  }

  if (
    isRouteErrorResponse(error) &&
    error.status === StatusCodes.UNAUTHORIZED
  ) {
    if (
      typeof error.data === "object" &&
      error.data !== null &&
      "reason" in error.data &&
      (error.data as { reason: string }).reason ===
        USER_NOT_ALLOWED_ACCESS_TO_ENTITY_REASON
    ) {
      return true;
    }

    return error.statusText === USER_NOT_ALLOWED_ACCESS_TO_ENTITY_LABEL;
  }

  return false;
}
