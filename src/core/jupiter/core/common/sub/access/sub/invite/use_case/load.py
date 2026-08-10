"""Use case for loading an access invite."""

from jupiter.core.app import AppCore
from jupiter.core.common.entity_summary import EntitySummary
from jupiter.core.common.sub.access.sub.grant.root import AccessGrant
from jupiter.core.common.sub.access.sub.grant.service.load_user_that_owns_entity import (
    LoadUserThatOwnsEntityService,
)
from jupiter.core.common.sub.access.sub.invite.root import AccessInvite
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.concepts.registry import ConceptNotFoundError
from jupiter.framework.entity import CrownEntity, LeafSupportEntity
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class AccessInviteLoadArgs(UseCaseArgsBase):
    """AccessInviteLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class AccessInviteLoadResult(UseCaseResultBase):
    """AccessInviteLoad result."""

    access_invite: AccessInvite
    access_grant: AccessGrant
    entity: EntitySummary
    owner: UserLight
    can_cancel: bool


@readonly_use_case(exclude_component=[AppCore.CLI])
class AccessInviteLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        AccessInviteLoadArgs, AccessInviteLoadResult
    ]
):
    """Use case for loading an access invite."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: AccessInviteLoadArgs,
    ) -> AccessInviteLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        access_invite = await uow.get_for(AccessInvite).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )

        access_grant = await uow.get_for(AccessGrant).load_by_id(
            access_invite.access_grant_ref_id,
            allow_archived=True,
        )
        if access_grant.user_ref_id != context.user.ref_id:
            raise UserNotAllowedAccessToEntityError(
                f"User {context.user.ref_id} is not allowed to load "
                f"access invite {access_invite.ref_id}"
            )

        owner = await LoadUserThatOwnsEntityService().do_it(
            uow,
            access_grant.entity,
        )

        try:
            entity_cls = self._concept_registry.get_entity_by_name(
                access_grant.entity.the_type,
            )
        except ConceptNotFoundError as err:
            raise UserNotAllowedAccessToEntityError(
                f"Unknown entity type {access_grant.entity.the_type!r}"
            ) from err

        if not issubclass(entity_cls, CrownEntity) or issubclass(
            entity_cls, LeafSupportEntity
        ):
            raise UserNotAllowedAccessToEntityError(
                f"Entity type {access_grant.entity.the_type} is not a crown entity"
            )

        entity = await uow.get_for(entity_cls).load_by_id(
            access_grant.entity.ref_id,
            allow_archived=True,
        )

        return AccessInviteLoadResult(
            access_invite=access_invite,
            access_grant=access_grant,
            entity=EntitySummary.from_entity(entity),
            owner=owner,
            can_cancel=not access_grant.archived,
        )
