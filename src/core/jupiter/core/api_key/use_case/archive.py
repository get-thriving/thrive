"""Archive an API key."""

from jupiter.core.api_key.root import APIKey
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class APIKeyArchiveArgs(JupiterArchiveCrownEntityArgs):
    """API key archive args."""

    ref_id: EntityId


@secure_class
class APIKeyArchiveUseCase(JupiterArchiveCrownEntityUseCase[APIKeyArchiveArgs, None]):
    """The command for archiving an API key."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: APIKeyArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        api_key = await self.load_entity(uow, context.user.ref_id, APIKey, args.ref_id)
        api_key = api_key.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(APIKey).save(api_key)
