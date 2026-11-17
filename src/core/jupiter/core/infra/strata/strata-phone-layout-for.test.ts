import { describe, expect, it } from "vitest";

import { strataPhoneLayoutFor } from "#/core/infra/strata/strata-phone-layout-for";
import type { ColumnSpec } from "#/core/infra/strata/layout";

const path = (...keys: string[]): ColumnSpec[] =>
  keys.map((key) => ({ key, kind: "route", size: 2 }));

describe("strataPhoneLayoutFor", () => {
  it("gives a lone panel the whole width", () => {
    const layout = strataPhoneLayoutFor(path("list"), 0, 390);
    expect(layout.slots[0]).toMatchObject({
      state: "full",
      left: 0,
      width: 390,
      focused: false,
    });
    expect(layout.description).toBe("list:1");
  });

  it("shows the deepest panel with a strip of its parent", () => {
    const layout = strataPhoneLayoutFor(path("list", "item"), 1, 390);
    expect(layout.slots[0]).toMatchObject({
      state: "spine",
      edgeLabel: "left",
      left: 0,
      width: 14,
    });
    expect(layout.slots[1]).toMatchObject({
      state: "full",
      left: 14,
      width: 376,
      focused: true,
    });
    expect(layout.description).toBe("list:strip item:1");
  });

  it("shows a parent with a strip of the panel that is open from it", () => {
    const layout = strataPhoneLayoutFor(path("list", "item"), 0, 390);
    expect(layout.slots[0]).toMatchObject({
      state: "full",
      left: 0,
      width: 376,
    });
    expect(layout.slots[1]).toMatchObject({
      state: "spine",
      edgeLabel: "right",
      left: 376,
      width: 14,
    });
    expect(layout.description).toBe("list:1 item:strip");
  });

  it("has both strips for a panel in the middle", () => {
    const layout = strataPhoneLayoutFor(path("a", "b", "c"), 1, 400);
    expect(layout.slots.map((slot) => [slot.left, slot.width])).toEqual([
      [0, 14],
      [14, 372],
      [386, 14],
    ]);
  });

  it("leaves the panels further out no room", () => {
    const layout = strataPhoneLayoutFor(path("a", "b", "c", "d"), 1, 400);
    expect(layout.slots[3]).toMatchObject({
      state: "spine",
      left: 400,
      width: 0,
    });
    const deep = strataPhoneLayoutFor(path("a", "b", "c", "d"), 3, 400);
    expect(deep.slots[0]).toMatchObject({ left: 0, width: 0 });
    expect(deep.slots[1]).toMatchObject({ left: 0, width: 0 });
    expect(deep.slots[2]).toMatchObject({ left: 0, width: 14 });
    expect(deep.description).toBe("a:| b:| c:strip d:1");
  });

  it("always covers the window from edge to edge", () => {
    for (const focus of [0, 1, 2]) {
      const layout = strataPhoneLayoutFor(path("a", "b", "c"), focus, 390);
      const widths = layout.slots.reduce((sum, slot) => sum + slot.width, 0);
      expect(widths).toBe(390);
    }
  });

  it("clamps a focus that is out of range", () => {
    const layout = strataPhoneLayoutFor(path("a", "b"), 9, 390);
    expect(layout.slots[1].state).toBe("full");
  });
});
