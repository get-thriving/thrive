"""Load settings for slack tasks use case."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class SlackTaskLoadSettingsArgs(JupiterFindCrownEntityArgs):
    """SlackTaskLoadSettings args."""


@use_case_result
class SlackTaskLoadSettingsResult(UseCaseResultBase):
    """SlackTaskLoadSettings results."""


@readonly_use_case(WorkspaceFeature.SLACK_TASKS, exclude_component=[AppCore.CLI])
class SlackTaskLoadSettingsUseCase(
    JupiterFindCrownEntityUseCase[
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
        return SlackTaskLoadSettingsResult()
