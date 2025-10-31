"""Load settings for email tasks use case."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.projects.root import Project
from jupiter.core.push_integrations.group import (
    PushIntegrationGroup,
)
from jupiter.core.push_integrations.sub.slack.task_collection import (
    SlackTaskCollection,
)
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class SlackTaskLoadSettingsArgs(UseCaseArgsBase):
    """SlackTaskLoadSettings args."""


@use_case_result
class SlackTaskLoadSettingsResult(UseCaseResultBase):
    """SlackTaskLoadSettings results."""

    generation_project: Project


@readonly_use_case(WorkspaceFeature.SLACK_TASKS, exclude_component=[AppCore.CLI])
class SlackTaskLoadSettingsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        SlackTaskLoadSettingsArgs, SlackTaskLoadSettingsResult
    ],
):
    """The command for loading the settings around slack tasks."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: SlackTaskLoadSettingsArgs,
    ) -> SlackTaskLoadSettingsResult:
        """Execute the command's action."""
        workspace = context.workspace

        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
            workspace.ref_id,
        )
        slack_task_collection = await uow.get_for(SlackTaskCollection).load_by_parent(
            push_integration_group.ref_id,
        )
        generation_project = await uow.get_for(Project).load_by_id(
            slack_task_collection.generation_project_ref_id,
        )

        return SlackTaskLoadSettingsResult(generation_project=generation_project)
