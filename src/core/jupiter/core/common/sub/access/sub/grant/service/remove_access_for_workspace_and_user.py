"""Services for removing access control data scoped to a workspace or user."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.grant.root import (
    AccessGrant,
    AccessGrantRepository,
)
from jupiter.core.common.sub.access.sub.invite.root import (
    AccessInvite,
    AccessInviteRepository,
)
from jupiter.core.common.sub.access.sub.request.root import (
    AccessRequest,
    AccessRequestRepository,
)
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatusRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
    RecordNotFoundError,
)


class RemoveAccessForWorkspaceAndUserService:
    """Remove access grants and statuses for a workspace and/or user."""

    async def remove_for_workspace(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        owner_user_ref_id: EntityId,
    ) -> None:
        """Remove grants, statuses, invites, and requests on entities the user owns."""
        grant_repository = uow.get(AccessGrantRepository)
        owner_grants = [
            grant
            for grant in await grant_repository.find_all_for_user(
                owner_user_ref_id,
                allow_archived=True,
            )
            if grant.access_level == AccessLevel.OWNER
        ]
        shared_grants = await grant_repository.find_all_shared_on_entities_owned_by(
            owner_user_ref_id,
            allow_archived=True,
        )
        requests = await uow.get(
            AccessRequestRepository
        ).find_all_for_entities_owned_by(
            owner_user_ref_id,
            allow_archived=True,
        )
        await self._remove_grants_and_related(
            ctx,
            uow,
            _unique_grants([*owner_grants, *shared_grants]),
            requests,
        )

    async def remove_for_user(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        user_ref_id: EntityId,
    ) -> None:
        """Remove all grants and statuses granted to the given user."""
        grants = await uow.get(AccessGrantRepository).find_all_for_user(
            user_ref_id,
            allow_archived=True,
        )
        requests = await uow.get(AccessRequestRepository).find_all_for_user(
            user_ref_id,
            allow_archived=True,
        )
        await self._remove_grants_and_related(ctx, uow, grants, requests)

    async def _remove_grants_and_related(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        grants: list[AccessGrant],
        requests: list[AccessRequest],
    ) -> None:
        grant_ref_ids = [grant.ref_id for grant in grants]
        statuses = await uow.get(AccessStatusRepository).find_all_for_grants(
            grant_ref_ids,
        )
        invites = await uow.get(AccessInviteRepository).find_all_for_grants(
            grant_ref_ids,
            allow_archived=True,
        )

        status_repository = uow.get(AccessStatusRepository)
        for status in statuses:
            try:
                await status_repository.remove(status.raw_key)
            except RecordNotFoundError:
                continue

        invite_repository = uow.get_for(AccessInvite)
        for invite in invites:
            try:
                await invite_repository.remove(ctx, invite.ref_id)
            except EntityNotFoundError:
                continue

        request_repository = uow.get_for(AccessRequest)
        for request in requests:
            try:
                await request_repository.remove(ctx, request.ref_id)
            except EntityNotFoundError:
                continue

        grant_repository = uow.get_for(AccessGrant)
        for grant in grants:
            try:
                await grant_repository.remove(ctx, grant.ref_id)
            except EntityNotFoundError:
                continue


def _unique_grants(grants: list[AccessGrant]) -> list[AccessGrant]:
    by_ref_id: dict[EntityId, AccessGrant] = {}
    for grant in grants:
        by_ref_id[grant.ref_id] = grant
    return list(by_ref_id.values())
