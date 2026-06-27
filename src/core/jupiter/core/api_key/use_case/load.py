"""Use case for loading an API key."""

from jupiter.core.api_key.api_key_summary import APIKeySummary
from jupiter.core.api_key.root import APIKey
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.crown_entity_support import JupiterLoadCrownEntityArgs, JupiterLoadCrownEntityUseCase
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class APIKeyLoadArgs(JupiterLoadCrownEntityArgs):
    """APIKeyLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class APIKeyLoadResult(UseCaseResultBase):
    """APIKeyLoad result."""

    api_key: APIKeySummary


class APIKeyLoadUseCase(
    JupiterLoadCrownEntityUseCase[APIKeyLoadArgs, APIKeyLoadResult]
):
    """Use case for loading an API key."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: APIKeyLoadArgs,
    ) -> APIKeyLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        api_key = await self.load_entity(uow, context.user.ref_id, APIKey, args.ref_id, allow_archived)
        return APIKeyLoadResult(api_key=api_key.summary)
