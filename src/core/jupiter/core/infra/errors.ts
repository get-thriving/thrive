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
