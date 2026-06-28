"""The use case for archiving a home small screen widget."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.home.sub.tab.root import HomeTab
from jupiter.core.home.sub.widget.root import HomeWidget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class HomeWidgetArchiveArgs(JupiterArchiveCrownEntityArgs):
    """The arguments for archiving a home widget."""

    ref_id: EntityId


@mutation_use_case()
class HomeWidgetArchiveUseCase(
    JupiterArchiveCrownEntityUseCase[HomeWidgetArchiveArgs, None]
):
    """The use case for archiving a home widget."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HomeWidgetArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        widget = await self.load_entity(uow, context.user.ref_id, HomeWidget, args.ref_id)
        home_tab = await self.load_entity(
            uow, context.user.ref_id, HomeTab, widget.home_tab.ref_id
        )
        home_tab = home_tab.remove_widget(context.domain_context, widget.ref_id)
        await uow.get_for(HomeTab).save(home_tab)
        await progress_reporter.mark_updated(home_tab)

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            HomeWidget,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
