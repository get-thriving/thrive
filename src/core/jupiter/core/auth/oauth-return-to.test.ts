import { describe, expect, it } from "vitest";

import { oauthReturnToFromUrl } from "#/core/auth/oauth-return-to";

function loginUrl(returnTo?: string): string {
  const url = new URL(
    "https://app.example.com/app/lifecycle/login/local/login",
  );
  if (returnTo !== undefined) {
    url.searchParams.set("returnTo", returnTo);
  }
  return url.toString();
}

describe("oauthReturnToFromUrl", () => {
  it("returns the consent page path it was given, with its query", () => {
    const returnTo = "/app/oauth/authorize?client_id=c&state=x%20y";
    expect(oauthReturnToFromUrl(loginUrl(returnTo))).toBe(returnTo);
  });

  it("returns nothing when there is no returnTo", () => {
    expect(oauthReturnToFromUrl(loginUrl())).toBeUndefined();
  });

  it.each([
    "https://evil.example.com/app/oauth/authorize?x=1",
    "//evil.example.com/app/oauth/authorize?x=1",
    "/app/workspace",
    "/app/oauth/authorize",
    "javascript:alert(1)",
    "",
  ])("ignores %s", (returnTo) => {
    expect(oauthReturnToFromUrl(loginUrl(returnTo))).toBeUndefined();
  });
});
