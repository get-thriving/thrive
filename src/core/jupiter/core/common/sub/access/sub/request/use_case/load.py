"""Use case for loading an access request."""

from jupiter.core.app import AppCore
from jupiter.core.common.entity_summary import EntitySummary
from jupiter.core.common.sub.access.sub.grant.service.load_user_that_owns_entity import (
    LoadUserThatOwnsEntityService,
)
from jupiter.core.common.sub.access.sub.request.root import AccessRequest
from jupiter.core.common.sub.access.sub.request.status import AccessRequestStatus
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.users.root import UserRepository
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
class AccessRequestLoadArgs(UseCaseArgsBase):
    """AccessRequestLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class AccessRequestLoadResult(UseCaseResultBase):
    """AccessRequestLoad result."""

    access_request: AccessRequest
    entity: EntitySummary
    requester: UserLight
    owner: UserLight
    can_accept: bool
    can_reject: bool
    can_cancel: bool


@readonly_use_case(exclude_component=[AppCore.CLI])
class AccessRequestLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        AccessRequestLoadArgs, AccessRequestLoadResult
    ]
):
    """Use case for loading an access request."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: AccessRequestLoadArgs,
    ) -> AccessRequestLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        access_request = await uow.get_for(AccessRequest).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )

        owner = await LoadUserThatOwnsEntityService().do_it(
            uow,
            access_request.entity,
        )
        is_requester = access_request.user_ref_id == context.user.ref_id
        is_owner = owner.ref_id == context.user.ref_id
        if not is_requester and not is_owner:
            raise UserNotAllowedAccessToEntityError(
                f"User {context.user.ref_id} is not allowed to load "
                f"access request {access_request.ref_id}"
            )

        requesters = await uow.get(UserRepository).find_all_light_by_ref_ids(
            [access_request.user_ref_id]
        )
        if len(requesters) == 0:
            raise UserNotAllowedAccessToEntityError(
                f"Requester {access_request.user_ref_id} for access request "
                f"{access_request.ref_id} does not exist"
            )

        try:
            entity_cls = self._concept_registry.get_entity_by_name(
                access_request.entity.the_type,
            )
        except ConceptNotFoundError as err:
            raise UserNotAllowedAccessToEntityError(
                f"Unknown entity type {access_request.entity.the_type!r}"
            ) from err

        if not issubclass(entity_cls, CrownEntity) or issubclass(
            entity_cls, LeafSupportEntity
        ):
            raise UserNotAllowedAccessToEntityError(
                f"Entity type {access_request.entity.the_type} is not a crown entity"
            )

        entity = await uow.get_for(entity_cls).load_by_id(
            access_request.entity.ref_id,
            allow_archived=True,
        )

        pending = (
            access_request.status == AccessRequestStatus.REQUESTED
            and not access_request.archived
        )

        return AccessRequestLoadResult(
            access_request=access_request,
            entity=EntitySummary.from_entity(entity),
            requester=requesters[0],
            owner=owner,
            can_accept=is_owner and pending,
            can_reject=is_owner and pending,
            can_cancel=is_requester and pending,
        )
