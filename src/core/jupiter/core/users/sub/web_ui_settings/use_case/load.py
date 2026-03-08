"""The command for loading the web UI settings for the current user."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.users.sub.web_ui_settings.root import WebUiSettings
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
class WebUiSettingsLoadArgs(UseCaseArgsBase):
    """Web UI settings load args."""


@use_case_result
class WebUiSettingsLoadResult(UseCaseResultBase):
    """Web UI settings load result."""

    web_ui_settings: WebUiSettings


@readonly_use_case()
class WebUiSettingsLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        WebUiSettingsLoadArgs, WebUiSettingsLoadResult
    ]
):
    """The command for loading the web UI settings for the current user."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: WebUiSettingsLoadArgs,
    ) -> WebUiSettingsLoadResult:
        """Execute the command's action."""
        web_ui_settings = await uow.get_for(WebUiSettings).load_by_parent(
            context.user.ref_id
        )
        return WebUiSettingsLoadResult(web_ui_settings=web_ui_settings)
