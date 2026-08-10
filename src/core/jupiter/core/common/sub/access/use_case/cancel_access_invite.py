"""Use case for cancelling an access invite and forgetting the grant."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.access.shareable import (
    refresh_domain_specific_access_for_entity,
)
from jupiter.core.common.sub.access.sub.grant.root import AccessGrant
from jupiter.core.common.sub.access.sub.grant.service.remove_grant_for_entity import (
    RemoveGrantForEntityService,
)
from jupiter.core.common.sub.access.sub.invite.root import AccessInvite
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class CancelAccessInviteArgs(JupiterCreateCrownEntityArgs):
    """CancelAccessInvite args."""

    access_invite_ref_id: EntityId


@use_case_result
class CancelAccessInviteResult(UseCaseResultBase):
    """CancelAccessInvite result."""

    access_invite_ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class CancelAccessInviteUseCase(
    JupiterCreateCrownEntityUseCase[CancelAccessInviteArgs, CancelAccessInviteResult]
):
    """Cancel an access invite by archiving it and forgetting the linked grant."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CancelAccessInviteArgs,
    ) -> CancelAccessInviteResult:
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
                f"User {context.user.ref_id} is not allowed to cancel "
                f"access invite {access_invite.ref_id}"
            )

        if not grant.archived:
            await RemoveGrantForEntityService(self._concept_registry).do_it(
                context.domain_context,
                uow,
                context.user.ref_id,
                grant.ref_id,
            )
            await refresh_domain_specific_access_for_entity(
                context.domain_context,
                uow,
                grant.entity.the_type,
                grant.entity.ref_id,
            )
        elif not access_invite.archived:
            archived_invite = access_invite.mark_archived(
                context.domain_context,
                JupiterArchivalReason.USER,
            )
            await uow.get_for(AccessInvite).save(archived_invite)

        return CancelAccessInviteResult(
            access_invite_ref_id=access_invite.ref_id,
        )
