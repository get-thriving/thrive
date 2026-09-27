import { Buffer } from "buffer-polyfill";

// Where to send someone back to after the render fix page travels in a query
// parameter, so it is base64url encoded. Plain base64 doesn't survive a query
// string: "+" arrives as a space, and the "=" padding gets percent-encoded on
// one side of a render but not the other, which is its own hydration mismatch.

export function encodeRenderFixReturnTo(url: string): string {
  return Buffer.from(url, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeRenderFixReturnTo(value: string): string {
  return Buffer.from(
    value.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  ).toString("utf-8");
}
