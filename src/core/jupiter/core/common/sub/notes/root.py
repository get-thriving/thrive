"""A note in the notebook."""

import abc
from typing import Final

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.content_block import OneOfNoteContentBlock
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction

# Allowed ``EntityLink.the_type`` values for :class:`Note` owners.
ALLOWED_NOTE_OWNER_TYPES: Final[frozenset[str]] = frozenset(
    {
        NamedEntityTag.TODO_TASK.value,
        NamedEntityTag.WORKING_MEM.value,
        NamedEntityTag.TIME_PLAN.value,
        NamedEntityTag.TIME_PLAN_ACTIVITY.value,
        NamedEntityTag.SCHEDULE_STREAM.value,
        NamedEntityTag.SCHEDULE_EXPORT.value,
        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
        NamedEntityTag.HABIT.value,
        NamedEntityTag.CHORE.value,
        NamedEntityTag.BIG_PLAN.value,
        NamedEntityTag.DOC.value,
        NamedEntityTag.JOURNAL.value,
        NamedEntityTag.VACATION.value,
        NamedEntityTag.ASPECT.value,
        NamedEntityTag.CHAPTER.value,
        NamedEntityTag.GOAL.value,
        NamedEntityTag.MILESTONE.value,
        NamedEntityTag.VISION.value,
        NamedEntityTag.SMART_LIST.value,
        NamedEntityTag.SMART_LIST_ITEM.value,
        NamedEntityTag.METRIC.value,
        NamedEntityTag.METRIC_ENTRY.value,
        NamedEntityTag.PERSON.value,
        NamedEntityTag.OCCASION.value,
    }
)


@entity("NoteCollection")
class Note(LeafSupportEntity):
    """A note in the notebook."""

    note_collection: ParentLink
    owner: EntityLink
    content: list[OneOfNoteContentBlock]

    @staticmethod
    @create_entity_action
    def new_note(
        ctx: DomainContext,
        note_collection_ref_id: EntityId,
        owner: EntityLink,
        content: list[OneOfNoteContentBlock],
    ) -> "Note":
        """Create a note."""
        if owner.the_type not in ALLOWED_NOTE_OWNER_TYPES:
            raise InputValidationError(
                f"Invalid note owner entity type: {owner.the_type!r}",
            )
        if owner.purpose != "std":
            raise InputValidationError(
                f"Note owner link purpose must be 'std', got {owner.purpose!r}",
            )
        return Note._create(
            ctx,
            name=Note.build_name(owner),
            note_collection=ParentLink(note_collection_ref_id),
            owner=owner,
            content=content,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
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
        if self.owner.the_type in (
            "WorkingMem",
            "Doc",
            "Journal",
        ):
            return False
        return True

    @staticmethod
    def build_name(owner: EntityLink) -> EntityName:
        """Build the name of the note."""
        return EntityName(f"{owner.the_type} with id #{owner.ref_id}")


class NoteRepository(LeafEntityRepository[Note], abc.ABC):
    """A repository of notes."""

    @abc.abstractmethod
    async def load_for_owner(
        self,
        owner: EntityLink,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> Note:
        """Load a particular note via its owner link."""

    @abc.abstractmethod
    async def load_optional_for_owner(
        self,
        owner: EntityLink,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> Note | None:
        """Load a particular note via its owner link, if it exists."""

    @abc.abstractmethod
    async def find_all_for_note_collection(
        self,
        *,
        note_collection_ref_id: EntityId,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
        filter_ref_ids: list[EntityId] | None = None,
        filter_owner_types: list[str] | None = None,
        filter_owners: list[EntityLink] | None = None,
    ) -> list[Note]:
        """Find notes in a collection, optionally by ref id and/or owner filters."""
