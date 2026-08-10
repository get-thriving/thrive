"""Use case for cancelling an access request by archiving it."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.access.sub.request.root import AccessRequest
from jupiter.core.common.sub.access.sub.request.status import AccessRequestStatus
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class CancelAccessToEntityArgs(UseCaseArgsBase):
    """CancelAccessToEntity args."""

    access_request_ref_id: EntityId


@use_case_result
class CancelAccessToEntityResult(UseCaseResultBase):
    """CancelAccessToEntity result."""

    access_request_ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class CancelAccessToEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        CancelAccessToEntityArgs, CancelAccessToEntityResult
    ]
):
    """Use case for cancelling an access request by archiving it."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CancelAccessToEntityArgs,
    ) -> CancelAccessToEntityResult:
        """Execute the command's action."""
        access_request = await uow.get_for(AccessRequest).load_by_id(
            args.access_request_ref_id,
            allow_archived=False,
        )

        if access_request.user_ref_id != context.user.ref_id:
            raise UserNotAllowedAccessToEntityError(
                f"User {context.user.ref_id} is not allowed to cancel "
                f"access request {access_request.ref_id}"
            )

        if access_request.status != AccessRequestStatus.REQUESTED:
            raise InputValidationError(
                f"Cannot cancel access request in status {access_request.status.value}"
            )

        archived_request = access_request.mark_archived(
            context.domain_context,
            JupiterArchivalReason.USER,
        )
        await uow.get_for(AccessRequest).save(archived_request)

        return CancelAccessToEntityResult(
            access_request_ref_id=archived_request.ref_id,
        )
