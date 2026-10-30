import type { ApiClient } from "@jupiter/webapi-client";
import { ApiError, ImagePurpose } from "@jupiter/webapi-client";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// An image never changes at its path (a new picture is a new path), so
// browsers and caches can hold on to it for good.
const CACHE_CONTROL = "public, max-age=31536000, immutable";

function notFound(): Response {
  return new Response(ReasonPhrases.NOT_FOUND, {
    status: StatusCodes.NOT_FOUND,
    statusText: ReasonPhrases.NOT_FOUND,
  });
}

function parseImageLocation(
  splat: string | undefined,
): { purpose: ImagePurpose; path: string } | undefined {
  const [purpose, ...pathSegments] = (splat ?? "").split("/");
  const path = pathSegments.join("/");

  if (!Object.values(ImagePurpose).includes(purpose as ImagePurpose)) {
    return undefined;
  }
  if (path === "") {
    return undefined;
  }
  return { purpose: purpose as ImagePurpose, path };
}

/**
 * Serves an image through the WebAPI, for stores a browser can't read itself
 * (the local one keeps them on the WebAPI's disk).
 *
 * `splat` is what follows `/images/` in the url: `<purpose>/<path>`. Nobody has
 * to be logged in, as the path of an image is its secret. Whatever is wrong
 * with the path, the answer is the same 404, so that probing tells nothing.
 */
export async function serveImage(
  apiClient: ApiClient,
  splat: string | undefined,
): Promise<Response> {
  const location = parseImageLocation(splat);
  if (location === undefined) {
    return notFound();
  }

  let image;
  try {
    image = await apiClient.images.imageLoad(location);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === StatusCodes.NOT_FOUND ||
        error.status === StatusCodes.UNPROCESSABLE_ENTITY)
    ) {
      return notFound();
    }
    throw error;
  }

  const content = Buffer.from(image.content_base64, "base64");
  return new Response(content, {
    headers: {
      "Content-Type": image.content_type,
      "Content-Length": String(content.length),
      "Cache-Control": CACHE_CONTROL,
      // It is an image, whatever its bytes claim to be.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
