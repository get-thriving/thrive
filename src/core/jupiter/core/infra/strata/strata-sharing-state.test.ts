import { AccessLevel, PublishEntityStatus } from "@jupiter/webapi-client";
import type { AccessStatus, PublishEntity } from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  strataSharingChips,
  strataSharingState,
} from "#/core/infra/strata/strata-sharing-state";

function published(status: PublishEntityStatus): PublishEntity {
  return { status } as PublishEntity;
}

function access(level: AccessLevel): AccessStatus {
  return { access_level: level } as AccessStatus;
}

describe("strataSharingState", () => {
  it("is nothing for an entity that is neither published nor shared", () => {
    const state = strataSharingState(null, access(AccessLevel.OWNER));
    expect(state).toEqual({
      published: false,
      draft: false,
      sharedWithYou: false,
    });
    expect(strataSharingChips(state)).toEqual([]);
  });

  it("is published for an active publish entity", () => {
    const state = strataSharingState(
      published(PublishEntityStatus.ACTIVE),
      access(AccessLevel.OWNER),
    );
    expect(strataSharingChips(state)).toEqual([
      { id: "published", label: "published" },
    ]);
  });

  it("is a draft, with no chip, once it is moved back", () => {
    const state = strataSharingState(
      published(PublishEntityStatus.DRAFT),
      undefined,
    );
    expect(state.draft).toBe(true);
    expect(strataSharingChips(state)).toEqual([]);
  });

  it("is shared with you where the access is not the owner's", () => {
    for (const level of [
      AccessLevel.READER,
      AccessLevel.COMMENTER,
      AccessLevel.WRITER,
    ]) {
      const state = strataSharingState(null, access(level));
      expect(strataSharingChips(state)).toEqual([
        { id: "shared", label: "shared" },
      ]);
    }
  });

  it("is not shared where the access is not known", () => {
    expect(strataSharingState(null, null).sharedWithYou).toBe(false);
    expect(strataSharingState(null, undefined).sharedWithYou).toBe(false);
  });

  it("has both chips when it is published and shared with you", () => {
    const state = strataSharingState(
      published(PublishEntityStatus.ACTIVE),
      access(AccessLevel.WRITER),
    );
    expect(strataSharingChips(state).map((chip) => chip.id)).toEqual([
      "published",
      "shared",
    ]);
  });
});
