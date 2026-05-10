"""A directory in the doc collection."""

import abc

from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.docs.sub.dir.name import DirName
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    LeafEntity,
    OwnsAtMostOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity("DocCollection")
class Dir(LeafEntity):
    """A directory in the doc collection."""

    doc_collection: ParentLink
    parent_dir_ref_id: EntityId | None
    name: DirName

    tag_link = OwnsAtMostOne(TagLink, owner=IsEntityLinkStd(NamedEntityTag.DIR.value))

    @staticmethod
    @create_entity_action
    def new_root_dir(
        ctx: DomainContext,
        doc_collection_ref_id: EntityId,
        name: DirName,
    ) -> "Dir":
        """Create the root directory for a doc collection."""
        return Dir._create(
            ctx,
            doc_collection=ParentLink(doc_collection_ref_id),
            parent_dir_ref_id=None,
            name=name,
        )

    @staticmethod
    @create_entity_action
    def new_dir(
        ctx: DomainContext,
        doc_collection_ref_id: EntityId,
        parent_dir_ref_id: EntityId,
        name: DirName,
    ) -> "Dir":
        """Create a subdirectory."""
        return Dir._create(
            ctx,
            doc_collection=ParentLink(doc_collection_ref_id),
            parent_dir_ref_id=parent_dir_ref_id,
            name=name,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[DirName],
        parent_dir_ref_id: UpdateAction[EntityId],
    ) -> "Dir":
        """Update the directory."""
        if self.is_root and parent_dir_ref_id.should_change:
            raise Exception("Cannot change the parent of the root directory.")
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            parent_dir_ref_id=parent_dir_ref_id.or_else(self.parent_dir_ref_id_sure),
        )

    @property
    def is_safe_to_archive(self) -> bool:
        """Return True if it is safe to archive or remove this directory."""
        return not self.is_root

    @property
    def is_root(self) -> bool:
        """Return True if this is the root directory."""
        return self.parent_dir_ref_id is None

    @property
    def parent_dir_ref_id_sure(self) -> EntityId:
        """Return the parent directory ID."""
        if self.parent_dir_ref_id is None:
            raise Exception("The parent directory ID is not set.")
        return self.parent_dir_ref_id


class DirRepository(LeafEntityRepository[Dir], abc.ABC):
    """A repository of directories."""

    @abc.abstractmethod
    async def load_root_dir(self, parent_ref_id: EntityId) -> Dir:
        """Load the root directory for a doc collection."""
