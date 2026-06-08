"""Shared service for loading published doc directory subtrees."""

from dataclasses import dataclass

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.docs.root import DocCollection
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork


@dataclass(frozen=True)
class PublishedDirContext:
    """Resolved publish context for a published directory."""

    publish_entity: PublishEntity
    doc_collection: DocCollection
    published_dir: Dir


class DirPublishedLoadService:
    """Shared service for validating and loading published directory subtrees."""

    async def load_context(
        self,
        uow: DomainUnitOfWork,
        external_id: PublishExternalId,
    ) -> PublishedDirContext:
        """Load and validate an active publish entity for a directory."""
        publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
            external_id
        )

        if publish_entity.status != PublishEntityStatus.ACTIVE:
            raise InputValidationError(
                "The publish entity is not active and cannot be loaded."
            )

        if publish_entity.owner.the_type != NamedEntityTag.DIR.value:
            raise InputValidationError(
                "The publish entity does not refer to a directory."
            )
        if publish_entity.owner.purpose != "std":
            raise InputValidationError(
                "The publish entity owner link purpose must be 'std'."
            )

        publish_domain = await uow.get_for(PublishDomain).load_by_id(
            publish_entity.publish_domain.ref_id
        )
        doc_collection = await uow.get_for(DocCollection).load_by_parent(
            publish_domain.workspace.ref_id
        )
        published_dir = await uow.get_for(Dir).load_by_id(
            publish_entity.owner.ref_id,
            allow_archived=False,
        )
        if published_dir.doc_collection.ref_id != doc_collection.ref_id:
            raise InputValidationError(
                "The publish entity does not refer to a workspace directory."
            )

        return PublishedDirContext(
            publish_entity=publish_entity,
            doc_collection=doc_collection,
            published_dir=published_dir,
        )

    async def load_dir_under_published_root(
        self,
        uow: DomainUnitOfWork,
        context: PublishedDirContext,
        target_dir_ref_id: EntityId,
    ) -> Dir:
        """Load a directory that is the published root or one of its descendants."""
        if not await self._dir_is_under_published_root(
            uow,
            context.doc_collection.ref_id,
            context.published_dir.ref_id,
            target_dir_ref_id,
        ):
            raise InputValidationError(
                "The directory is not part of the published directory tree."
            )

        return await uow.get_for(Dir).load_by_id(
            target_dir_ref_id,
            allow_archived=False,
        )

    async def load_doc_under_published_dir(
        self,
        uow: DomainUnitOfWork,
        context: PublishedDirContext,
        parent_dir_ref_id: EntityId,
        doc_ref_id: EntityId,
    ) -> Doc:
        """Load a doc that belongs to a directory under the published root."""
        if not await self._dir_is_under_published_root(
            uow,
            context.doc_collection.ref_id,
            context.published_dir.ref_id,
            parent_dir_ref_id,
        ):
            raise InputValidationError(
                "The directory is not part of the published directory tree."
            )

        doc = await uow.get_for(Doc).load_by_id(
            doc_ref_id,
            allow_archived=False,
        )
        if doc.doc_collection.ref_id != context.doc_collection.ref_id:
            raise InputValidationError("The doc does not belong to this workspace.")
        if doc.parent_dir_ref_id != parent_dir_ref_id:
            raise InputValidationError(
                "The doc does not belong to the requested directory."
            )

        return doc

    async def _dir_is_under_published_root(
        self,
        uow: DomainUnitOfWork,
        doc_collection_ref_id: EntityId,
        published_dir_ref_id: EntityId,
        target_dir_ref_id: EntityId,
    ) -> bool:
        """Return True if target_dir is the published root or a descendant."""
        if target_dir_ref_id == published_dir_ref_id:
            return True

        dir_entity = await uow.get_for(Dir).load_by_id(
            target_dir_ref_id,
            allow_archived=False,
        )
        if dir_entity.doc_collection.ref_id != doc_collection_ref_id:
            return False

        current = dir_entity
        while current.parent_dir_ref_id is not None:
            if current.parent_dir_ref_id == published_dir_ref_id:
                return True
            current = await uow.get_for(Dir).load_by_id(
                current.parent_dir_ref_id,
                allow_archived=False,
            )

        return False
