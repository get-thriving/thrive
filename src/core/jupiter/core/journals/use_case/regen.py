"""A use case for regenerating journals."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.domainx.application.gen.service.gen_service import GenService
from jupiter.core.features import WorkspaceFeature
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class JournalRegenArgs(UseCaseArgsBase):
    """The arguments for the journal regen use case."""


@mutation_use_case(WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI])
class JournalRegenUseCase(JupiterLoggedInMutationUseCase[JournalRegenArgs, None]):
    """A use case for regenerating journals."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalRegenArgs,
    ) -> None:
        """Perform the mutation."""
        gen_service = GenService(
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        await gen_service.do_it(
            ctx=context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            gen_even_if_not_modified=True,
            today=self._time_provider.get_current_date(),
            gen_targets=[SyncTarget.JOURNALS],
            period=None,
        )
