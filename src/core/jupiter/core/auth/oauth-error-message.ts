import { ApiError } from "@jupiter/webapi-client";
import { StatusCodes } from "http-status-codes";

/**
 * The message the backend gave for a refused sign in or link, such as "an
 * account with this email already exists". Anything else is not for the user.
 */
export function oauthErrorMessage(error: unknown): string | undefined {
  if (
    !(error instanceof ApiError) ||
    error.status !== StatusCodes.UNPROCESSABLE_ENTITY
  ) {
    return undefined;
  }

  const body = error.body as { detail?: Array<{ msg?: unknown }> } | undefined;
  const msg = body?.detail?.[0]?.msg;
  return typeof msg === "string" ? msg : undefined;
}
