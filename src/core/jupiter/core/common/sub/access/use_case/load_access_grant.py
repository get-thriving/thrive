"""Load a single access grant for the collaboration leaf."""

from jupiter.core.app import AppCore
from jupiter.core.common.entity_summary import EntitySummary
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.shareable import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
)
from jupiter.core.common.sub.access.sub.grant.root import (
    AccessGrant,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptNotFoundError
from jupiter.framework.entity import CrownEntity, LeafSupportEntity
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class LoadAccessGrantArgs(UseCaseArgsBase):
    """LoadAccessGrant args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class LoadAccessGrantResult(UseCaseResultBase):
    """LoadAccessGrant result."""

    access_grant: AccessGrant
    entity: EntitySummary
    owner: UserLight
    grantee: UserLight
    can_update: bool
    can_revoke: bool
    can_forget: bool


@readonly_use_case(exclude_component=[AppCore.CLI])
class LoadAccessGrantUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        LoadAccessGrantArgs, LoadAccessGrantResult
    ]
):
    """Load one non-owner access grant for a party to that grant."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: LoadAccessGrantArgs,
    ) -> LoadAccessGrantResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        user_ref_id = context.user.ref_id

        grant = await uow.get_for(AccessGrant).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )

        if grant.access_level == AccessLevel.OWNER:
            raise EntityNotFoundError(f"Access grant {args.ref_id} does not exist")

        if grant.entity.the_type not in ALLOWED_SHARED_ACCESS_OWNER_TYPES:
            raise EntityNotFoundError(f"Access grant {args.ref_id} does not exist")

        owner_ref_ids = await OwnerUserRefIdsForEntitiesService().do_it(
            uow,
            [grant.entity],
        )
        owner_ref_id = owner_ref_ids.get(grant.entity.ref_id)
        if owner_ref_id is None:
            raise EntityNotFoundError(f"Access grant {args.ref_id} does not exist")

        is_grantee = grant.user_ref_id == user_ref_id
        is_owner = owner_ref_id == user_ref_id
        if not is_grantee and not is_owner:
            raise EntityNotFoundError(f"Access grant {args.ref_id} does not exist")

        entity_summary = await self._load_entity_summary(
            uow,
            grant.entity,
            allow_archived=True,
        )
        if entity_summary is None:
            raise EntityNotFoundError(f"Access grant {args.ref_id} does not exist")

        users = await uow.get(UserRepository).find_all_light_by_ref_ids(
            [owner_ref_id, grant.user_ref_id]
        )
        users_by_ref_id = {user.ref_id: user for user in users}
        owner = users_by_ref_id.get(owner_ref_id)
        grantee = users_by_ref_id.get(grant.user_ref_id)
        if owner is None or grantee is None:
            raise EntityNotFoundError(f"Access grant {args.ref_id} does not exist")

        return LoadAccessGrantResult(
            access_grant=grant,
            entity=entity_summary,
            owner=owner,
            grantee=grantee,
            can_update=is_owner and not grant.archived,
            can_revoke=is_owner and not grant.archived,
            can_forget=is_grantee and not is_owner and not grant.archived,
        )

    async def _load_entity_summary(
        self,
        uow: DomainUnitOfWork,
        entity_link: EntityLink,
        allow_archived: bool,
    ) -> EntitySummary | None:
        """Load a crown entity summary for the grant's entity."""
        try:
            entity_cls = self._concept_registry.get_entity_by_name(
                entity_link.the_type,
            )
        except ConceptNotFoundError:
            return None
        if not issubclass(entity_cls, CrownEntity) or issubclass(
            entity_cls, LeafSupportEntity
        ):
            return None

        try:
            entity = await uow.get_for(entity_cls).load_by_id(
                entity_link.ref_id,
                allow_archived=allow_archived,
            )
        except EntityNotFoundError:
            return None
        return EntitySummary.from_entity(entity)
