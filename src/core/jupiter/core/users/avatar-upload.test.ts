import { describe, expect, it } from "vitest";

import {
  fitLongSide,
  MAX_PICTURE_BYTES,
  needsScalingDown,
  SCALED_LONG_SIDE_PIXELS,
  scaledPictureType,
  SEND_AS_IS_UP_TO_BYTES,
} from "#/core/users/avatar-upload";

describe("needsScalingDown", () => {
  it("leaves pictures that will do as they are", () => {
    expect(needsScalingDown(0)).toBe(false);
    expect(needsScalingDown(SEND_AS_IS_UP_TO_BYTES)).toBe(false);
  });

  it("scales down anything bigger", () => {
    expect(needsScalingDown(SEND_AS_IS_UP_TO_BYTES + 1)).toBe(true);
  });

  it("sends as is only what the WebAPI will take", () => {
    expect(SEND_AS_IS_UP_TO_BYTES).toBeLessThan(MAX_PICTURE_BYTES);
  });
});

describe("fitLongSide", () => {
  it("brings a landscape picture down by its width", () => {
    expect(fitLongSide(4000, 3000, 1600)).toEqual({
      width: 1600,
      height: 1200,
    });
  });

  it("brings a portrait picture down by its height", () => {
    expect(fitLongSide(3000, 4000, 1600)).toEqual({
      width: 1200,
      height: 1600,
    });
  });

  it("keeps a square square", () => {
    expect(fitLongSide(5000, 5000, 1600)).toEqual({
      width: 1600,
      height: 1600,
    });
  });

  it("never scales up", () => {
    expect(fitLongSide(800, 600, 1600)).toEqual({ width: 800, height: 600 });
    expect(fitLongSide(1600, 100, 1600)).toEqual({ width: 1600, height: 100 });
  });

  it("never makes a side vanish", () => {
    expect(fitLongSide(20000, 3, SCALED_LONG_SIDE_PIXELS)).toEqual({
      width: 1600,
      height: 1,
    });
  });
});

describe("scaledPictureType", () => {
  it("keeps a PNG a PNG, since it may be see-through", () => {
    expect(scaledPictureType("image/png")).toBe("image/png");
  });

  it.each(["image/jpeg", "image/webp", "image/heic", ""])(
    "makes %j a JPEG",
    (type) => {
      expect(scaledPictureType(type)).toBe("image/jpeg");
    },
  );
});
