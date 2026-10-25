"""Use case for loading an OAuth grant."""

from jupiter.core.auth.sub.oauth_grant.oauth_grant_summary import OAuthGrantSummary
from jupiter.core.auth.sub.oauth_grant.root import OAuthGrant
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class OAuthGrantLoadArgs(UseCaseArgsBase):
    """OAuth grant load args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class OAuthGrantLoadResult(UseCaseResultBase):
    """OAuth grant load result."""

    oauth_grant: OAuthGrantSummary


@readonly_use_case()
class OAuthGrantLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        OAuthGrantLoadArgs, OAuthGrantLoadResult
    ]
):
    """Use case for loading an OAuth grant.

    A grant is private to the user who gave it. It is neither a workspace entity nor
    shared, so there are no access grants to check, and it is the owner that is
    checked instead. Someone else's grant looks like one that does not exist.
    """

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: OAuthGrantLoadArgs,
    ) -> OAuthGrantLoadResult:
        """Execute the command's action."""
        grant = await uow.get_for(OAuthGrant).load_by_id(
            args.ref_id, allow_archived=args.allow_archived or False
        )
        if grant.user.ref_id != context.user.ref_id:
            raise EntityNotFoundError(f"OAuthGrant {args.ref_id} does not exist")
        return OAuthGrantLoadResult(
            oauth_grant=grant.summary_at(self._time_provider.get_current_time())
        )
