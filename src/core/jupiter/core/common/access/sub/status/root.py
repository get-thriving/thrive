"""The effective access status of a principal over a resource."""

import abc

from jupiter.core.common.access.access_level import AccessLevel
from jupiter.core.common.access.sub.status.reason import AccessStatusReason
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import NOT_USED_NAME
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


class UserNotAllowedAccessToEntityError(Exception):
    """Error raised when a user does not have the required access to an entity."""


@entity("AccessDomain")
class AccessStatus(LeafSupportEntity):
    """The effective access status of a principal over a resource."""

    access_domain: ParentLink

    entity: EntityLink
    user_ref_id: EntityId
    access_level: AccessLevel
    reason: AccessStatusReason

    @staticmethod
    @create_entity_action
    def new_access_status(
        ctx: DomainContext,
        access_domain_ref_id: EntityId,
        entity: EntityLink,
        user_ref_id: EntityId,
        access_level: AccessLevel,
        reason: AccessStatusReason,
    ) -> "AccessStatus":
        """Create a new access status."""
        if entity.purpose != "std":
            raise InputValidationError(
                f"Access status owner link purpose must be 'std', got {entity.purpose!r}",
            )
        return AccessStatus._create(
            ctx,
            name=NOT_USED_NAME,
            access_domain=ParentLink(access_domain_ref_id),
            entity=entity,
            user_ref_id=user_ref_id,
            access_level=access_level,
            reason=reason,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        access_level: UpdateAction[AccessLevel],
        reason: UpdateAction[AccessStatusReason],
    ) -> "AccessStatus":
        """Update the access status."""
        return self._new_version(
            ctx,
            access_level=access_level.or_else(self.access_level),
            reason=reason.or_else(self.reason),
        )


class AccessStatusRepository(LeafEntityRepository[AccessStatus], abc.ABC):
    """A repository for access statuses."""

    @abc.abstractmethod
    async def find_all_for_user(
        self,
        entity_type: str,
        user_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessStatus]:
        """Find all access statuses for a user over resources of a given type."""

    @abc.abstractmethod
    async def load_optional_for_entity_and_user(
        self,
        entity: EntityLink,
        user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> AccessStatus | None:
        """Load the access status for a specific entity and user, if any."""

    @abc.abstractmethod
    async def load_all_for_entities_and_user(
        self,
        entities: list[EntityLink],
        user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessStatus]:
        """Load access statuses for the given entities and user."""

    @abc.abstractmethod
    async def upsert(self, status: AccessStatus) -> AccessStatus:
        """Insert a status, or update the level and reason of the matching existing one."""
