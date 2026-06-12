import { ApiError } from "@jupiter/webapi-client";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

/** Re-throw loader errors so Remix route error boundaries can handle them. */
export function handlePublishedLoaderError(error: unknown): never {
  if (error instanceof Response) {
    throw error;
  }

  if (error instanceof ApiError) {
    if (
      error.status === StatusCodes.NOT_FOUND ||
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    throw new Response(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: error.message,
    });
  }

  if (error instanceof ZodError) {
    throw new Response(ReasonPhrases.NOT_FOUND, {
      status: StatusCodes.NOT_FOUND,
      statusText: ReasonPhrases.NOT_FOUND,
    });
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Response(ReasonPhrases.INTERNAL_SERVER_ERROR, {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  });
}
