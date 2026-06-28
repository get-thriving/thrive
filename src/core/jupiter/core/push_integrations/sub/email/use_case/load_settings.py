"""Load settings for email tasks use case."""

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
class EmailTaskLoadSettingsArgs(JupiterFindCrownEntityArgs):
    """EmailTaskLoadSettings args."""


@use_case_result
class EmailTaskLoadSettingsResult(UseCaseResultBase):
    """EmailTaskLoadSettings results."""


@readonly_use_case(WorkspaceFeature.EMAIL_TASKS, exclude_component=[AppCore.CLI])
class EmailTaskLoadSettingsUseCase(
    JupiterFindCrownEntityUseCase[
        EmailTaskLoadSettingsArgs, EmailTaskLoadSettingsResult
    ],
):
    """The command for loading the settings around email tasks."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: EmailTaskLoadSettingsArgs,
    ) -> EmailTaskLoadSettingsResult:
        """Execute the command's action."""
        return EmailTaskLoadSettingsResult()
