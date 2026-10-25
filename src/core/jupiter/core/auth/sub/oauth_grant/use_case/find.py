"""Use case for finding the OAuth grants a user has given."""

from jupiter.core.auth.sub.oauth_grant.oauth_grant_summary import OAuthGrantSummary
from jupiter.core.auth.sub.oauth_grant.root import OAuthGrant
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class OAuthGrantFindArgs(UseCaseArgsBase):
    """OAuth grant find args."""

    allow_archived: bool | None


@use_case_result
class OAuthGrantFindResult(UseCaseResultBase):
    """OAuth grant find result."""

    oauth_grants: list[OAuthGrantSummary]


@readonly_use_case()
class OAuthGrantFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        OAuthGrantFindArgs, OAuthGrantFindResult
    ]
):
    """Use case for finding the OAuth grants a user has given.

    Only grants whose code was redeemed are real connections. A consent that was
    never followed through is not listed. Grants are private to the user who gave
    them, so this lists only the caller's own and needs no access grants.
    """

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: OAuthGrantFindArgs,
    ) -> OAuthGrantFindResult:
        """Execute the command's action."""
        right_now = self._time_provider.get_current_time()
        grants = await uow.get_for(OAuthGrant).find_all(
            parent_ref_id=context.user.ref_id,
            allow_archived=args.allow_archived or False,
        )
        return OAuthGrantFindResult(
            oauth_grants=[
                grant.summary_at(right_now) for grant in grants if grant.code_redeemed
            ]
        )
