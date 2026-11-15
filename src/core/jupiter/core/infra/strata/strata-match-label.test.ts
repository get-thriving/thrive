import { describe, expect, it } from "vitest";

import { strataMatchLabel } from "#/core/infra/strata/strata-match-label";

function match(handle: unknown, loaderData: unknown = undefined) {
  return { pathname: "/a/b", params: {}, loaderData, handle };
}

describe("strataMatchLabel", () => {
  it("is the text a route says", () => {
    expect(strataMatchLabel(match({ label: "Questions" }))).toBe("Questions");
  });

  it("is what a function of the loaded data says", () => {
    const handle = {
      label: ({ loaderData }: { loaderData: unknown }) =>
        (loaderData as { name: string } | undefined)?.name ?? null,
    };
    expect(strataMatchLabel(match(handle, { name: "Run" }))).toBe("Run");
  });

  it("is null when the route says none, or cannot say it yet", () => {
    expect(strataMatchLabel(match({}))).toBeNull();
    expect(strataMatchLabel(match({ label: "  " }))).toBeNull();
    expect(
      strataMatchLabel(match({ label: () => null }, undefined)),
    ).toBeNull();
  });
});
