"""An invite linking a user to a newly created access grant."""

import abc

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
)
from jupiter.framework.storage.repository import LeafEntityRepository


@entity("AccessDomain")
class AccessInvite(LeafSupportEntity):
    """An unacknowledged invite pointing at an access grant."""

    access_domain: ParentLink

    access_grant_ref_id: EntityId

    @staticmethod
    @create_entity_action
    def new_access_invite(
        ctx: DomainContext,
        access_domain_ref_id: EntityId,
        access_grant_ref_id: EntityId,
    ) -> "AccessInvite":
        """Create a new access invite for a grant."""
        return AccessInvite._create(
            ctx,
            name=NOT_USED_NAME,
            access_domain=ParentLink(access_domain_ref_id),
            access_grant_ref_id=access_grant_ref_id,
        )


class AccessInviteRepository(LeafEntityRepository[AccessInvite], abc.ABC):
    """A repository for access invites."""

    @abc.abstractmethod
    async def find_all_for_grant(
        self,
        access_grant_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessInvite]:
        """Find all invites linked to a grant."""

    @abc.abstractmethod
    async def find_all_for_grants(
        self,
        access_grant_ref_ids: list[EntityId],
        allow_archived: bool = False,
    ) -> list[AccessInvite]:
        """Find all invites linked to the given grants."""

    @abc.abstractmethod
    async def upsert(self, invite: AccessInvite) -> AccessInvite:
        """Insert an invite, or unarchive/refresh the matching one for the grant."""
