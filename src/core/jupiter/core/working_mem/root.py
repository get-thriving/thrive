"""An entry in the working_mem.txt system."""

import abc

from jupiter.core.common.sub.notes.root import Note
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    OwnsOne,
    ParentLink,
    StubEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import StubEntityRepository


@entity("WorkingMemCollection")
class WorkingMem(StubEntity):
    """An entry in the working_mem.txt system."""

    working_mem_collection: ParentLink

    note = OwnsOne(Note, owner=IsEntityLinkStd(NamedEntityTag.WORKING_MEM.value))

    @staticmethod
    @create_entity_action
    def new_working_mem(
        ctx: DomainContext,
        working_mem_collection_ref_id: EntityId,
    ) -> "WorkingMem":
        """Create a working memory entry."""
        return WorkingMem._create(
            ctx,
            working_mem_collection=ParentLink(working_mem_collection_ref_id),
        )

    @update_entity_action
    def unarchive(self, ctx: DomainContext) -> "WorkingMem":
        """Unarchive this working memory entry."""
        return self._new_version(
            ctx,
            archived=False,
            archived_time=None,
            archival_reason=None,
        )


class WorkingMemRepository(StubEntityRepository[WorkingMem], abc.ABC):
    """The working memory repository."""

    @abc.abstractmethod
    async def load_the_working_mem(
        self,
        working_mem_collection_ref_id: EntityId,
        *,
        allow_archived: bool = False,
    ) -> WorkingMem:
        """Load the working memory entry."""
