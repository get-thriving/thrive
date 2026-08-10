"""Use case for acknowledging an access invite by archiving it."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.access.sub.grant.root import AccessGrant
from jupiter.core.common.sub.access.sub.invite.root import AccessInvite
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
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
class AcknowledgeAccessInviteArgs(UseCaseArgsBase):
    """AcknowledgeAccessInvite args."""

    access_invite_ref_id: EntityId


@use_case_result
class AcknowledgeAccessInviteResult(UseCaseResultBase):
    """AcknowledgeAccessInvite result."""

    access_invite_ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class AcknowledgeAccessInviteUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        AcknowledgeAccessInviteArgs, AcknowledgeAccessInviteResult
    ]
):
    """Acknowledge an access invite by archiving it."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: AcknowledgeAccessInviteArgs,
    ) -> AcknowledgeAccessInviteResult:
        """Execute the command's action."""
        access_invite = await uow.get_for(AccessInvite).load_by_id(
            args.access_invite_ref_id,
            allow_archived=True,
        )

        grant = await uow.get_for(AccessGrant).load_by_id(
            access_invite.access_grant_ref_id,
            allow_archived=True,
        )
        if grant.user_ref_id != context.user.ref_id:
            raise UserNotAllowedAccessToEntityError(
                f"User {context.user.ref_id} is not allowed to acknowledge "
                f"access invite {access_invite.ref_id}"
            )

        if not access_invite.archived:
            archived_invite = access_invite.mark_archived(
                context.domain_context,
                JupiterArchivalReason.USER,
            )
            await uow.get_for(AccessInvite).save(archived_invite)
            access_invite = archived_invite

        return AcknowledgeAccessInviteResult(
            access_invite_ref_id=access_invite.ref_id,
        )
