import { describe, expect, it } from "vitest";

import { strataSubjectsOf } from "#/core/infra/strata/strata-subjects-of";

describe("strataSubjectsOf", () => {
  it("makes each route column a subject of its own", () => {
    expect(strataSubjectsOf(["route", "route", "route"], 1)).toEqual({
      subject: [0, 1, 2],
      inFocusedSubject: [false, true, false],
    });
  });

  it("puts the splits of a route column in its subject", () => {
    expect(
      strataSubjectsOf(["route", "route", "split", "split", "route"], 3),
    ).toEqual({
      subject: [0, 1, 1, 1, 4],
      inFocusedSubject: [false, true, true, true, false],
    });
  });

  it("puts the views of a panel in its subject too", () => {
    expect(strataSubjectsOf(["route", "route", "view", "route"], 2)).toEqual({
      subject: [0, 1, 1, 3],
      inFocusedSubject: [false, true, true, false],
    });
  });

  it("copes with a row that starts with a split", () => {
    expect(strataSubjectsOf(["split", "route"], 0).subject).toEqual([0, 1]);
  });
});
