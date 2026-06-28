"""The command for archiving a email task."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.push_integrations.sub.email.service.archive import (
    EmailTaskArchiveService,
)
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class EmailTaskArchiveArgs(JupiterArchiveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.EMAIL_TASKS)
class EmailTaskArchiveUseCase(
    JupiterArchiveCrownEntityUseCase[EmailTaskArchiveArgs, None]
):
    """The command for archiving a email task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: EmailTaskArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        email_task = await self.load_entity(
            uow, context.user.ref_id, EmailTask, args.ref_id
        )

        await EmailTaskArchiveService().do_it(
            context.domain_context,
            uow,
            progress_reporter,
            email_task,
            JupiterArchivalReason.USER,
        )
