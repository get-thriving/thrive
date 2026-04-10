"""A doc in the docbook."""

import abc

from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.docs.idempotency_key import DocIdempotencyKey
from jupiter.core.docs.name import DocName
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    IsRefId,
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
    parent_doc_ref_id: EntityId | None
    idempotency_key: DocIdempotencyKey
    name: DocName

    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.DOC, source_entity_ref_id=IsRefId()
    )
    note = OwnsOne(Note, owner=IsEntityLinkStd(NamedEntityTag.DOC.value))

    @staticmethod
    @create_entity_action
    def new_doc(
        ctx: DomainContext,
        doc_collection_ref_id: EntityId,
        parent_doc_ref_id: EntityId | None,
        idempotency_key: DocIdempotencyKey,
        name: DocName,
    ) -> "Doc":
        """Create a doc."""
        return Doc._create(
            ctx,
            doc_collection=ParentLink(doc_collection_ref_id),
            parent_doc_ref_id=parent_doc_ref_id,
            idempotency_key=idempotency_key,
            name=name,
        )

    @update_entity_action
    def change_parent(
        self,
        ctx: DomainContext,
        parent_doc_ref_id: EntityId | None,
    ) -> "Doc":
        """Change the parent doc of the doc."""
        return self._new_version(
            ctx,
            parent_doc_ref_id=parent_doc_ref_id,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[DocName],
    ) -> "Doc":
        """Update the doc name and content."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )


class DocRepository(LeafEntityRepository[Doc], abc.ABC):
    """A repository of docs."""

    @abc.abstractmethod
    async def create_if_not_exists(self, doc: Doc) -> tuple[Doc, bool]:
        """Create a doc if it doesn't exist."""
