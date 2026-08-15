"""The effective access status of a principal over a resource."""

import abc

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.reason import AccessStatusReason
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import ParentLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.record import (
    Record,
    create_record_action,
    record,
    update_record_action,
)
from jupiter.framework.storage.repository import RecordRepository
from jupiter.framework.update_action import UpdateAction

AccessStatusKey = tuple[EntityId, EntityLink, EntityId]


class UserNotAllowedAccessToEntityError(Exception):
    """Error raised when a user does not have the required access to an entity."""


@record("AccessDomain")
class AccessStatus(Record):
    """The effective access status of a principal over a resource."""

    access_domain: ParentLink
    entity: EntityLink
    user_ref_id: EntityId
    access_level: AccessLevel
    reason: AccessStatusReason
    access_grant_ref_id: EntityId

    @staticmethod
    @create_record_action
    def new_access_status(
        ctx: DomainContext,
        access_domain_ref_id: EntityId,
        entity: EntityLink,
        user_ref_id: EntityId,
        access_level: AccessLevel,
        reason: AccessStatusReason,
        access_grant_ref_id: EntityId,
    ) -> "AccessStatus":
        """Create a new access status."""
        if entity.purpose != "std":
            raise InputValidationError(
                f"Access status owner link purpose must be 'std', got {entity.purpose!r}",
            )
        return AccessStatus._create(
            ctx,
            access_domain=ParentLink(access_domain_ref_id),
            entity=entity,
            user_ref_id=user_ref_id,
            access_level=access_level,
            reason=reason,
            access_grant_ref_id=access_grant_ref_id,
        )

    @update_record_action
    def update(
        self,
        ctx: DomainContext,
        access_level: UpdateAction[AccessLevel],
        reason: UpdateAction[AccessStatusReason],
        access_grant_ref_id: UpdateAction[EntityId],
    ) -> "AccessStatus":
        """Update the access status."""
        return self._new_version(
            ctx,
            access_level=access_level.or_else(self.access_level),
            reason=reason.or_else(self.reason),
            access_grant_ref_id=access_grant_ref_id.or_else(self.access_grant_ref_id),
        )

    @property
    def raw_key(self) -> AccessStatusKey:
        """Composite key for this materialized ACL row."""
        return (self.access_domain.ref_id, self.entity, self.user_ref_id)


class AccessStatusRepository(RecordRepository[AccessStatus, AccessStatusKey], abc.ABC):
    """A repository for access statuses."""

    @abc.abstractmethod
    async def find_all_for_user(
        self,
        entity_type: str,
        user_id: EntityId,
    ) -> list[AccessStatus]:
        """Find all access statuses for a user over resources of a given type."""

    @abc.abstractmethod
    async def find_all_for_entity(
        self,
        entity: EntityLink,
    ) -> list[AccessStatus]:
        """Find all access statuses for a resource."""

    @abc.abstractmethod
    async def find_all_for_entities(
        self,
        entities: list[EntityLink],
    ) -> list[AccessStatus]:
        """Find all access statuses for the given resources."""

    @abc.abstractmethod
    async def load_optional_for_entity_and_user(
        self,
        entity: EntityLink,
        user_ref_id: EntityId,
    ) -> AccessStatus | None:
        """Load the access status for a specific entity and user, if any."""

    @abc.abstractmethod
    async def load_all_for_entities_and_user(
        self,
        entities: list[EntityLink],
        user_ref_id: EntityId,
    ) -> list[AccessStatus]:
        """Load access statuses for the given entities and user."""

    @abc.abstractmethod
    async def find_all_for_grant(
        self,
        access_grant_ref_id: EntityId,
    ) -> list[AccessStatus]:
        """Find all access statuses derived from a particular grant."""

    @abc.abstractmethod
    async def find_all_for_grants(
        self,
        access_grant_ref_ids: list[EntityId],
    ) -> list[AccessStatus]:
        """Find all access statuses derived from the given grants."""

    @abc.abstractmethod
    async def upsert(self, status: AccessStatus) -> AccessStatus:
        """Insert a status, or update the level and reason of the matching existing one."""
