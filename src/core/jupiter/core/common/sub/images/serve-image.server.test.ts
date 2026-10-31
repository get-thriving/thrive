import type { ApiClient } from "@jupiter/webapi-client";
import { ApiError, ImagePurpose } from "@jupiter/webapi-client";
import { describe, expect, it, vi } from "vitest";

import { serveImage } from "#/core/common/sub/images/serve-image.server";

const CONTENT = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0xff, 0x10]);

function apiClientThatReturns(imageLoad: ReturnType<typeof vi.fn>): ApiClient {
  return { images: { imageLoad } } as unknown as ApiClient;
}

function apiError(status: number): ApiError {
  return new ApiError(
    { method: "POST", url: "/image-load" },
    { url: "/image-load", ok: false, status, statusText: "", body: {} },
    "failed",
  );
}

describe("serveImage", () => {
  it("serves the bytes of the image, cacheable for good", async () => {
    const imageLoad = vi.fn().mockResolvedValue({
      content_type: "image/webp",
      content_base64: CONTENT.toString("base64"),
    });

    const response = await serveImage(
      apiClientThatReturns(imageLoad),
      "avatars/abc123.webp",
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/webp");
    expect(response.headers.get("Content-Length")).toBe(String(CONTENT.length));
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(Buffer.from(await response.arrayBuffer())).toEqual(CONTENT);
  });

  it("asks for the purpose and the rest of the path", async () => {
    const imageLoad = vi.fn().mockResolvedValue({
      content_type: "image/webp",
      content_base64: CONTENT.toString("base64"),
    });

    await serveImage(
      apiClientThatReturns(imageLoad),
      "avatars/some/dir/a.webp",
    );

    expect(imageLoad).toHaveBeenCalledWith({
      purpose: ImagePurpose.AVATARS,
      path: "some/dir/a.webp",
    });
  });

  it.each([
    ["nothing at all", undefined],
    ["an empty path", ""],
    ["a purpose and no image", "avatars"],
    ["a purpose and an empty image", "avatars/"],
    ["a purpose we don't have", "wallpapers/abc.webp"],
    ["an image and no purpose", "abc.webp"],
  ])("is a 404 for %s, without bothering the WebAPI", async (_, splat) => {
    const imageLoad = vi.fn();

    const response = await serveImage(apiClientThatReturns(imageLoad), splat);

    expect(response.status).toBe(404);
    expect(imageLoad).not.toHaveBeenCalled();
  });

  it.each([
    ["no such image", 404],
    ["a path the WebAPI will not have", 422],
  ])("is the same 404 for %s", async (_, status) => {
    const imageLoad = vi.fn().mockRejectedValue(apiError(status));

    const response = await serveImage(
      apiClientThatReturns(imageLoad),
      "avatars/abc.webp",
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not Found");
  });

  it("does not hide a WebAPI that is broken", async () => {
    const imageLoad = vi.fn().mockRejectedValue(apiError(500));

    await expect(
      serveImage(apiClientThatReturns(imageLoad), "avatars/abc.webp"),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("does not hide errors that are not the WebAPI's", async () => {
    const imageLoad = vi.fn().mockRejectedValue(new TypeError("fetch failed"));

    await expect(
      serveImage(apiClientThatReturns(imageLoad), "avatars/abc.webp"),
    ).rejects.toBeInstanceOf(TypeError);
  });
});
