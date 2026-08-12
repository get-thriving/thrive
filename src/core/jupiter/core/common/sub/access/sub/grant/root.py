"""A grant of access to a resource for a principal."""

import abc

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.grant.principal_type import PrincipalType
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
class AccessGrant(LeafSupportEntity):
    """A grant of access to a resource for a principal."""

    access_domain: ParentLink

    entity: EntityLink
    principal: PrincipalType
    user_ref_id: EntityId
    access_level: AccessLevel

    @staticmethod
    @create_entity_action
    def new_access_grant(
        ctx: DomainContext,
        access_domain_ref_id: EntityId,
        entity: EntityLink,
        principal: PrincipalType,
        user_ref_id: EntityId,
        access_level: AccessLevel,
    ) -> "AccessGrant":
        """Create a new access grant."""
        if principal != PrincipalType.USER:
            raise InputValidationError(
                f"Unsupported access grant principal type: {principal.value!r}",
            )
        return AccessGrant._create(
            ctx,
            name=NOT_USED_NAME,
            access_domain=ParentLink(access_domain_ref_id),
            entity=entity,
            principal=principal,
            user_ref_id=user_ref_id,
            access_level=access_level,
        )

    @update_entity_action
    def change_access_level(
        self,
        ctx: DomainContext,
        access_level: UpdateAction[AccessLevel],
    ) -> "AccessGrant":
        """Change the access level of the grant."""
        return self._new_version(
            ctx,
            access_level=access_level.or_else(self.access_level),
        )


class AccessGrantRepository(LeafEntityRepository[AccessGrant], abc.ABC):
    """A repository for access grants."""

    @abc.abstractmethod
    async def find_all_for_entity(
        self,
        entity: EntityLink,
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find all grants for a resource, across all principals."""

    @abc.abstractmethod
    async def find_all_for_entities(
        self,
        entities: list[EntityLink],
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find all grants for the given resources."""

    @abc.abstractmethod
    async def find_all_for_user(
        self,
        user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find all grants where the given user is the grantee."""

    @abc.abstractmethod
    async def find_all_shared_with_user(
        self,
        user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find non-owner grants where the given user is the grantee.

        Excludes owner grants in SQL so collaboration loads stay cheap after
        owner-grant backfill (which can create tens of thousands of owner rows
        per user).
        """

    @abc.abstractmethod
    async def find_all_shared_on_entities_owned_by(
        self,
        owner_user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find non-owner grants on entities the given user owns.

        Implemented as a join against owner grants rather than an ``IN`` over
        every owned entity link, so accounts with large owner-grant backfills
        (schedule events, etc.) do not blow past the Postgres bind-parameter
        limit when loading collaborations.
        """

    @abc.abstractmethod
    async def upsert(self, grant: AccessGrant) -> AccessGrant:
        """Insert a grant, or update the access level of the matching existing grant."""
