"""Use case for revoking an OAuth grant."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.auth.sub.oauth_grant.root import OAuthGrant
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class OAuthGrantArchiveArgs(UseCaseArgsBase):
    """OAuth grant archive args."""

    ref_id: EntityId


@secure_class
@mutation_use_case()
class OAuthGrantArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[OAuthGrantArchiveArgs, None]
):
    """Use case for revoking an OAuth grant.

    The app keeps any access token it already holds until that token expires, up
    to an hour. It can no longer refresh it. A grant is private to the user who gave
    it, so it is the owner that is checked, not access grants, and someone else's
    grant looks like one that does not exist.
    """

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: OAuthGrantArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        grant = await uow.get_for(OAuthGrant).load_by_id(args.ref_id)
        if grant.user.ref_id != context.user.ref_id:
            raise EntityNotFoundError(f"OAuthGrant {args.ref_id} does not exist")
        grant = grant.mark_archived(context.domain_context, JupiterArchivalReason.USER)
        await uow.get_for(OAuthGrant).save(grant)
