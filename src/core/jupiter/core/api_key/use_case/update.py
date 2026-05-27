"""Use case for updating an API key."""

from jupiter.core.api_key.name import APIKeyName
from jupiter.core.api_key.root import APIKey
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class APIKeyUpdateArgs(UseCaseArgsBase):
    """API key update args."""

    ref_id: EntityId
    name: UpdateAction[APIKeyName]


@secure_class
class APIKeyUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[APIKeyUpdateArgs, None]
):
    """Use case for updating an API key."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: APIKeyUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        api_key = await uow.get_for(APIKey).load_by_id(args.ref_id)
        api_key = api_key.update(
            ctx=context.domain_context,
            name=args.name,
        )
        await uow.get_for(APIKey).save(api_key)
