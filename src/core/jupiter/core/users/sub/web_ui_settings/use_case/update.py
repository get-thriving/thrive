"""The command for updating the web UI settings for the current user."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.users.sub.web_ui_settings.root import WebUiSettings
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class WebUiSettingsUpdateArgs(UseCaseArgsBase):
    """Web UI settings update args."""

    use_night_mode: UpdateAction[bool]


@mutation_use_case()
class WebUiSettingsUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[WebUiSettingsUpdateArgs, None]
):
    """The command for updating the web UI settings for the current user."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: WebUiSettingsUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        web_ui_settings = await uow.get_for(WebUiSettings).load_by_parent(
            context.user.ref_id
        )
        web_ui_settings = web_ui_settings.update(
            context.domain_context,
            use_night_mode=args.use_night_mode,
        )
        await uow.get_for(WebUiSettings).save(web_ui_settings)
