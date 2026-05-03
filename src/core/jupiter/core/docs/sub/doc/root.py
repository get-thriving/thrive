"""A doc in the docbook."""

import abc

from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.docs.sub.doc.idempotency_key import DocIdempotencyKey
from jupiter.core.docs.sub.doc.name import DocName
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    LeafEntity,
    OwnsAtMostOne,
    OwnsOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity("DocCollection")
class Doc(LeafEntity):
    """A doc in the docbook."""

    doc_collection: ParentLink
    parent_dir_ref_id: EntityId
    idempotency_key: DocIdempotencyKey
    name: DocName

    tag_link = OwnsAtMostOne(TagLink, owner=IsEntityLinkStd(NamedEntityTag.DOC.value))
    note = OwnsOne(Note, owner=IsEntityLinkStd(NamedEntityTag.DOC.value))

    @staticmethod
    @create_entity_action
    def new_doc(
        ctx: DomainContext,
        doc_collection_ref_id: EntityId,
        parent_dir_ref_id: EntityId,
        idempotency_key: DocIdempotencyKey,
        name: DocName,
    ) -> "Doc":
        """Create a doc."""
        return Doc._create(
            ctx,
            doc_collection=ParentLink(doc_collection_ref_id),
            parent_dir_ref_id=parent_dir_ref_id,
            idempotency_key=idempotency_key,
            name=name,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[DocName],
        parent_dir_ref_id: UpdateAction[EntityId],
    ) -> "Doc":
        """Update the doc name and parent folder."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            parent_dir_ref_id=parent_dir_ref_id.or_else(self.parent_dir_ref_id),
        )


class DocRepository(LeafEntityRepository[Doc], abc.ABC):
    """A repository of docs."""

    @abc.abstractmethod
    async def create_if_not_exists(self, doc: Doc) -> tuple[Doc, bool]:
        """Create a doc if it doesn't exist."""

    @abc.abstractmethod
    async def find_all_for_parent_dir(
        self,
        *,
        doc_collection_ref_id: EntityId,
        parent_dir_ref_id: EntityId,
        allow_archived: bool,
    ) -> list["Doc"]:
        """Load all docs whose parent folder is the given directory."""
