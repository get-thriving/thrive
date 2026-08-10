"""Base for domain-specific access refresh after grant changes."""

import abc

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class RefreshAccessForEntityService(abc.ABC):
    """Refresh effective access for an entity after grants change.

    Use for hierarchies that are not fully covered by generic
    OwnsLink/ContainsLink cascade (for example docs/dirs
    ``parent_dir_ref_id``).
    """

    @abc.abstractmethod
    async def refresh_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity_ref_id: EntityId,
    ) -> None:
        """Reconcile inherited/direct access statuses for the entity."""
