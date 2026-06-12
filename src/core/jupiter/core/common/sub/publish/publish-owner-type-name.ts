import { NamedEntityTag } from "@jupiter/webapi-client";

import { noteOwnerEntityTagName } from "#/core/common/sub/notes/note-owner-type-name";

/** Human-readable label for a publish entity owner tag. */
export function publishOwnerEntityTagName(ownerType: string): string {
  if (ownerType === "ScheduleEventFullDaysBlock") {
    return "Schedule Event Full Days";
  }

  const tag = ownerType as NamedEntityTag;
  if (Object.values(NamedEntityTag).includes(tag)) {
    return noteOwnerEntityTagName(tag);
  }

  return ownerType;
}
