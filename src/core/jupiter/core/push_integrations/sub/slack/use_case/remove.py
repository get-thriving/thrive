"""The command for hard removing a slack task."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.push_integrations.sub.slack.service.remove import (
    SlackTaskRemoveService,
)
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SlackTaskRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SLACK_TASKS)
class SlackTaskRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[SlackTaskRemoveArgs, None]
):
    """The command for archiving a slack task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SlackTaskRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        slack_task = await uow.get_for(SlackTask).load_by_id(
            args.ref_id, allow_archived=True
        )

        slack_task_remove_service = SlackTaskRemoveService()

        await slack_task_remove_service.do_it(
            context.domain_context, uow, progress_reporter, slack_task
        )
