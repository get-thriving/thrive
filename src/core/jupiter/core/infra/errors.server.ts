import { ApiError } from "@jupiter/webapi-client";
import type { TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import type { SomeErrorNoData } from "#/core/infra/action-result";
import { validationErrorToUIErrorInfo } from "#/core/infra/action-result";
import {
  isUserNotAllowedAccessToEntityApiError,
  USER_NOT_ALLOWED_ACCESS_TO_ENTITY_LABEL,
  USER_NOT_ALLOWED_ACCESS_TO_ENTITY_REASON,
} from "#/core/infra/errors";

function notFoundResponse(): Response {
  return new Response(ReasonPhrases.NOT_FOUND, {
    status: StatusCodes.NOT_FOUND,
    statusText: ReasonPhrases.NOT_FOUND,
  });
}

/**
 * An `ApiError` thrown from a loader or action is serialized before it reaches
 * the browser, so the class is lost and the error boundary can no longer tell
 * why access was refused. Re-throwing it as a response keeps the reason in both
 * the body and the `statusText`.
 */
function accessDeniedResponse(): TypedResponse<{ reason: string }> {
  return json(
    { reason: USER_NOT_ALLOWED_ACCESS_TO_ENTITY_REASON },
    {
      status: StatusCodes.UNAUTHORIZED,
      statusText: USER_NOT_ALLOWED_ACCESS_TO_ENTITY_LABEL,
    },
  );
}

/**
 * Turn whatever a loader threw into a response the route error boundary can
 * render. Always throws, so call it as the whole body of a `catch`.
 */
export function handleLoaderApiError(error: unknown): never {
  // A response thrown by the loader itself is already the intended outcome.
  if (error instanceof Response) {
    throw error;
  }

  if (error instanceof ApiError) {
    if (isUserNotAllowedAccessToEntityApiError(error)) {
      throw accessDeniedResponse();
    }

    // An unparseable id reads the same as a missing entity to the user.
    if (
      error.status === StatusCodes.NOT_FOUND ||
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      throw notFoundResponse();
    }

    throw new Response(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: error.message,
    });
  }

  // Params that failed to parse describe a route that cannot exist.
  if (error instanceof ZodError) {
    throw notFoundResponse();
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Response(ReasonPhrases.INTERNAL_SERVER_ERROR, {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  });
}

/**
 * Like {@link handleLoaderApiError}, except that the failures a user can fix by
 * editing the form come back as action data instead of being thrown. The WebAPI
 * reports those as either a validation error or a conflict.
 */
export function handleActionApiError(
  error: unknown,
  intent?: string,
): TypedResponse<SomeErrorNoData> {
  if (
    error instanceof ApiError &&
    !isUserNotAllowedAccessToEntityApiError(error) &&
    (error.status === StatusCodes.UNPROCESSABLE_ENTITY ||
      error.status === StatusCodes.CONFLICT)
  ) {
    return json(validationErrorToUIErrorInfo(error.body, intent));
  }

  return handleLoaderApiError(error);
}
