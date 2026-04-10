import { noteOwnerLinkToEntityTag } from "#/core/common/sub/notes/note-owner-to-entity-tag";
import { noteOwnerEntityTagName } from "#/core/common/sub/notes/note-owner-type-name";
import { SlimChip } from "#/core/infra/component/chips";

interface NoteOwnerTypeChipProps {
  owner: string;
}

export function NoteOwnerTypeChip(props: NoteOwnerTypeChipProps) {
  const tag = noteOwnerLinkToEntityTag(props.owner);
  return (
    <SlimChip label={noteOwnerEntityTagName(tag)} color="default" />
  );
}
