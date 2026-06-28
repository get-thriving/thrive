"""The command for archiving a chore."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.chores.root import Chore
from jupiter.core.chores.service.archive import (
    ChoreArchiveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class ChoreArchiveArgs(JupiterArchiveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.CHORES)
class ChoreArchiveUseCase(JupiterArchiveCrownEntityUseCase[ChoreArchiveArgs, None]):
    """The command for archiving a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChoreArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        chore = await self.load_entity(uow, context.user.ref_id, Chore, args.ref_id)

        await ChoreArchiveService().do_it(
            context.domain_context,
            uow,
            progress_reporter,
            chore,
            JupiterArchivalReason.USER,
        )
