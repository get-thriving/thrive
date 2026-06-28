"""Create a slack task for integration tests."""

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.env import Env
from jupiter.core.features import WorkspaceFeature
from jupiter.core.push_integrations.extra_info import PushGenerationExtraInfo
from jupiter.core.push_integrations.group import PushIntegrationGroup
from jupiter.core.push_integrations.sub.slack.channel_name import SlackChannelName
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.core.push_integrations.sub.slack.task_collection import (
    SlackTaskCollection,
)
from jupiter.core.push_integrations.sub.slack.user_name import SlackUserName
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class CreateSlackTaskForTestArgs(JupiterCreateCrownEntityArgs):
    """Arguments for creating a slack task in tests."""

    message: str


@use_case_result
class CreateSlackTaskForTestResult(UseCaseResultBase):
    """Result of creating a slack task in tests."""

    new_slack_task: SlackTask


@mutation_use_case([WorkspaceFeature.SLACK_TASKS], exclude_globally=[Env.PRODUCTION])
class CreateSlackTaskForTestUseCase(
    JupiterCreateCrownEntityUseCase[
        CreateSlackTaskForTestArgs, CreateSlackTaskForTestResult
    ]
):
    """Create a slack task for integration tests."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CreateSlackTaskForTestArgs,
    ) -> CreateSlackTaskForTestResult:
        """Execute the command's action."""
        workspace = context.workspace
        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
            workspace.ref_id,
        )
        slack_task_collection = await uow.get_for(SlackTaskCollection).load_by_parent(
            push_integration_group.ref_id,
        )

        new_slack_task = SlackTask.new_slack_task(
            context.domain_context,
            slack_task_collection.ref_id,
            user=SlackUserName("test-user"),
            channel=SlackChannelName("general"),
            message=args.message,
            generation_extra_info=PushGenerationExtraInfo(
                timezone=context.user.timezone,
                name=None,
                status=None,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
                actionable_date=None,
                due_date=None,
            ),
        )
        new_slack_task = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_slack_task,
        )

        return CreateSlackTaskForTestResult(new_slack_task=new_slack_task)
