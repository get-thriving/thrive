"""Use case for finding API keys."""

from jupiter.core.api_key.api_key_summary import APIKeySummary
from jupiter.core.api_key.root import APIKey
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class APIKeyFindArgs(UseCaseArgsBase):
    """APIKeyFind args."""

    allow_archived: bool


@use_case_result
class APIKeyFindResult(UseCaseResultBase):
    """APIKeyFind result."""

    api_keys: list[APIKeySummary]


class APIKeyFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[APIKeyFindArgs, APIKeyFindResult]
):
    """Use case for finding API keys."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: APIKeyFindArgs,
    ) -> APIKeyFindResult:
        """Execute the command's action."""
        user = context.user
        api_keys = await uow.get_for(APIKey).find_all(
            parent_ref_id=user.ref_id,
            allow_archived=args.allow_archived,
        )
        api_keys = [
            ak.summary
            for ak in api_keys
        ]
        return APIKeyFindResult(api_keys=api_keys)
