"""A request for access to a resource by a principal."""

import abc

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.grant.principal_type import PrincipalType
from jupiter.core.common.sub.access.sub.request.status import AccessRequestStatus
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


@entity("AccessDomain")
class AccessRequest(LeafSupportEntity):
    """A request for access to a resource by a principal."""

    access_domain: ParentLink

    entity: EntityLink
    principal: PrincipalType
    user_ref_id: EntityId
    access_level: AccessLevel
    status: AccessRequestStatus

    @staticmethod
    @create_entity_action
    def new_access_request(
        ctx: DomainContext,
        access_domain_ref_id: EntityId,
        entity: EntityLink,
        principal: PrincipalType,
        user_ref_id: EntityId,
        access_level: AccessLevel,
    ) -> "AccessRequest":
        """Create a new access request in the requested state."""
        if principal != PrincipalType.USER:
            raise InputValidationError(
                f"Unsupported access request principal type: {principal.value!r}",
            )
        if not access_level.is_invitable:
            raise InputValidationError(
                "Access requests must use reader, commenter, or writer access level"
            )
        return AccessRequest._create(
            ctx,
            name=NOT_USED_NAME,
            access_domain=ParentLink(access_domain_ref_id),
            entity=entity,
            principal=principal,
            user_ref_id=user_ref_id,
            access_level=access_level,
            status=AccessRequestStatus.REQUESTED,
        )

    @update_entity_action
    def change_access_level(
        self,
        ctx: DomainContext,
        access_level: UpdateAction[AccessLevel],
    ) -> "AccessRequest":
        """Change the requested access level."""
        new_access_level = access_level.or_else(self.access_level)
        if not new_access_level.is_invitable:
            raise InputValidationError(
                "Access requests must use reader, commenter, or writer access level"
            )
        return self._new_version(
            ctx,
            access_level=new_access_level,
        )

    @update_entity_action
    def mark_requested(self, ctx: DomainContext) -> "AccessRequest":
        """Re-open the request as requested."""
        return self._new_version(
            ctx,
            status=AccessRequestStatus.REQUESTED,
        )

    @update_entity_action
    def mark_accepted(self, ctx: DomainContext) -> "AccessRequest":
        """Mark the request as accepted."""
        if self.status != AccessRequestStatus.REQUESTED:
            raise InputValidationError(
                f"Cannot accept access request in status {self.status.value}"
            )
        return self._new_version(
            ctx,
            status=AccessRequestStatus.ACCEPTED,
        )

    @update_entity_action
    def mark_rejected(self, ctx: DomainContext) -> "AccessRequest":
        """Mark the request as rejected."""
        if self.status != AccessRequestStatus.REQUESTED:
            raise InputValidationError(
                f"Cannot reject access request in status {self.status.value}"
            )
        return self._new_version(
            ctx,
            status=AccessRequestStatus.REJECTED,
        )


class AccessRequestRepository(LeafEntityRepository[AccessRequest], abc.ABC):
    """A repository for access requests."""

    @abc.abstractmethod
    async def find_all_for_entity(
        self,
        entity: EntityLink,
        allow_archived: bool = False,
    ) -> list[AccessRequest]:
        """Find all requests for a resource, across all principals."""

    @abc.abstractmethod
    async def find_all_for_entities(
        self,
        entities: list[EntityLink],
        allow_archived: bool = False,
    ) -> list[AccessRequest]:
        """Find all requests for the given resources."""

    @abc.abstractmethod
    async def find_all_for_user(
        self,
        user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessRequest]:
        """Find all requests where the given user is the requester."""

    @abc.abstractmethod
    async def find_all_for_entities_owned_by(
        self,
        owner_user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessRequest]:
        """Find requests on entities the given user owns.

        Join-based, same rationale as
        :meth:`AccessGrantRepository.find_all_shared_on_entities_owned_by`.
        """

    @abc.abstractmethod
    async def upsert(self, request: AccessRequest) -> AccessRequest:
        """Insert a request, or update the matching existing one."""
