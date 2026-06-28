"""The command for hard removing a slack task."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
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
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class SlackTaskRemoveArgs(JupiterRemoveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SLACK_TASKS)
class SlackTaskRemoveUseCase(
    JupiterRemoveCrownEntityUseCase[SlackTaskRemoveArgs, None]
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
        slack_task = await self.load_entity(
            uow, context.user.ref_id, SlackTask, args.ref_id
        )

        await SlackTaskRemoveService().do_it(
            context.domain_context, uow, progress_reporter, slack_task
        )
