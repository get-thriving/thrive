"""A note in the notebook."""

import abc

from jupiter.core.common.sub.notes.content_block import OneOfNoteContentBlock
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity
class Note(LeafSupportEntity):
    """A note in the notebook."""

    note_collection: ParentLink
    namespace: NoteNamespace
    source_entity_ref_id: EntityId
    content: list[OneOfNoteContentBlock]

    @staticmethod
    @create_entity_action
    def new_note(
        ctx: MutationContext,
        note_collection_ref_id: EntityId,
        namespace: NoteNamespace,
        source_entity_ref_id: EntityId,
        content: list[OneOfNoteContentBlock],
    ) -> "Note":
        """Create a note."""
        return Note._create(
            ctx,
            name=NOT_USED_NAME,
            note_collection=ParentLink(note_collection_ref_id),
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
            content=content,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        content: UpdateAction[list[OneOfNoteContentBlock]],
    ) -> "Note":
        """Update the note name and content."""
        return self._new_version(
            ctx,
            content=content.or_else(self.content),
        )

    @property
    def can_be_removed_independently(self) -> bool:
        """Whether the note can be removed independently."""
        if (
            self.namespace == NoteNamespace.WORKING_MEM
            or self.namespace == NoteNamespace.DOC
            or self.namespace == NoteNamespace.JOURNAL
        ):
            return False
        return True


class NoteRepository(LeafEntityRepository[Note], abc.ABC):
    """A repository of notes."""

    @abc.abstractmethod
    async def load_for_source(
        self,
        namespace: NoteNamespace,
        source_entity_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> Note:
        """Load a particular note via its source entity."""

    @abc.abstractmethod
    async def load_optional_for_source(
        self,
        namespace: NoteNamespace,
        source_entity_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> Note | None:
        """Load a particular note via its source entity."""
