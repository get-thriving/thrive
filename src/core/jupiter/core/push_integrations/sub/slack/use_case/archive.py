"""The command for archiving a slack task."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.push_integrations.sub.slack.service.archive import (
    SlackTaskArchiveService,
)
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class SlackTaskArchiveArgs(JupiterArchiveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SLACK_TASKS)
class SlackTaskArchiveUseCase(
    JupiterArchiveCrownEntityUseCase[SlackTaskArchiveArgs, None]
):
    """The command for archiving a slack task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SlackTaskArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        slack_task = await self.load_entity(
            uow, context.user.ref_id, SlackTask, args.ref_id
        )

        await SlackTaskArchiveService().do_it(
            context.domain_context,
            uow,
            progress_reporter,
            slack_task,
            JupiterArchivalReason.USER,
        )
