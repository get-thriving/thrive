import { AccessLevel, PublishEntityStatus } from "@jupiter/webapi-client";
import type { AccessStatus, PublishEntity } from "@jupiter/webapi-client";

/** What the loader of a panel knows about how its entity is shared. */
export interface StrataSharingState {
  /** The entity is published, with its link active. */
  published: boolean;
  /** It was published, and then moved back to a draft. */
  draft: boolean;
  /** The user has it through someone else's grant, as a reader, writer… */
  sharedWithYou: boolean;
}

/**
 * How an entity is shared, from the two things a panel is given: its publish
 * entity, and the access the user has over it. Who else the owner has shared it
 * with is not known to a panel until its access panel loads, so it is not part
 * of this, and an owner's entity that has not been published reads as private.
 */
export function strataSharingState(
  publishEntity: PublishEntity | null | undefined,
  accessStatus: AccessStatus | null | undefined,
): StrataSharingState {
  return {
    published: publishEntity?.status === PublishEntityStatus.ACTIVE,
    draft: publishEntity?.status === PublishEntityStatus.DRAFT,
    sharedWithYou:
      accessStatus !== null &&
      accessStatus !== undefined &&
      accessStatus.access_level !== AccessLevel.OWNER,
  };
}

export interface StrataSharingChip {
  id: "published" | "shared";
  label: string;
}

/** The chips of the header: only for what is so, and none for what is private. */
export function strataSharingChips(
  state: StrataSharingState,
): StrataSharingChip[] {
  const chips: StrataSharingChip[] = [];
  if (state.published) {
    chips.push({ id: "published", label: "published" });
  }
  if (state.sharedWithYou) {
    chips.push({ id: "shared", label: "shared" });
  }
  return chips;
}
