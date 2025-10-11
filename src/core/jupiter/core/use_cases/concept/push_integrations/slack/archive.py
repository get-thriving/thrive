"""The command for archiving a slack task."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.push_integrations.slack.service.archive_service import (
    SlackTaskArchiveService,
)
from jupiter.core.domain.concept.push_integrations.slack.slack_task import SlackTask
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SlackTaskArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SLACK_TASKS)
class SlackTaskArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[SlackTaskArchiveArgs, None]
):
    """The command for archiving a slack task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: SlackTaskArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        slack_task = await uow.get_for(SlackTask).load_by_id(ref_id=args.ref_id)

        slack_task_archive_service = SlackTaskArchiveService()

        await slack_task_archive_service.do_it(
            context.domain_context,
            uow,
            progress_reporter,
            slack_task,
            JupiterArchivalReason.USER,
        )
