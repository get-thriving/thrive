"""Use case for searching users by name or email."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.search.limit import SearchLimit
from jupiter.core.search.query import SearchQuery
from jupiter.core.users.root import UserRepository
from jupiter.core.users.search_match import UserSearchMatch
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)

_MIN_QUERY_LENGTH = 2


@use_case_args
class SearchForUserArgs(UseCaseArgsBase):
    """SearchForUser args."""

    query: SearchQuery
    limit: SearchLimit


@use_case_result
class SearchForUserResult(UseCaseResultBase):
    """SearchForUser result."""

    users: list[UserSearchMatch]


@readonly_use_case()
class SearchForUserUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[SearchForUserArgs, SearchForUserResult]
):
    """Use case for searching users by name or email."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: SearchForUserArgs,
    ) -> SearchForUserResult:
        """Execute the command's action."""
        query = args.query.the_query.strip()
        if len(query) < _MIN_QUERY_LENGTH:
            return SearchForUserResult(users=[])

        users = await uow.get(UserRepository).search_by_name_or_email(
            query=query,
            limit=args.limit.the_limit,
            exclude_ref_ids=[context.user.ref_id],
        )

        return SearchForUserResult(
            users=[
                UserSearchMatch(
                    ref_id=user.ref_id,
                    name=user.name,
                    email_address=user.email_address,
                )
                for user in users
            ]
        )
