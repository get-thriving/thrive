"""The command for putting the keys of the current user back to the defaults."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.users.sub.web_ui_settings.root import WebUiSettings
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class WebUiSettingsResetKeyBindingsArgs(UseCaseArgsBase):
    """Web UI settings reset key bindings args."""


@use_case_result
class WebUiSettingsResetKeyBindingsResult(UseCaseResultBase):
    """Web UI settings reset key bindings result."""

    updated_web_ui_settings: WebUiSettings


@mutation_use_case()
class WebUiSettingsResetKeyBindingsUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        WebUiSettingsResetKeyBindingsArgs, WebUiSettingsResetKeyBindingsResult
    ]
):
    """The command for putting the keys of the current user back to the defaults."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: WebUiSettingsResetKeyBindingsArgs,
    ) -> WebUiSettingsResetKeyBindingsResult:
        """Execute the command's action."""
        web_ui_settings = await uow.get_for(WebUiSettings).load_by_parent(
            context.user.ref_id
        )
        web_ui_settings = web_ui_settings.reset_key_bindings(context.domain_context)
        web_ui_settings = await uow.get_for(WebUiSettings).save(web_ui_settings)

        return WebUiSettingsResetKeyBindingsResult(
            updated_web_ui_settings=web_ui_settings
        )
