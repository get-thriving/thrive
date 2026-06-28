"""The use case for moving a home small screen widget."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.home.sub.tab.root import HomeTab
from jupiter.core.home.sub.widget.root import HomeWidget
from jupiter.core.home.widget import WidgetDimension
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class HomeWidgetMoveAndResizeArgs(JupiterUpdateCrownEntityArgs):
    """The arguments for moving a home widget."""

    ref_id: EntityId
    row: int
    col: int
    dimension: WidgetDimension


@mutation_use_case()
class HomeWidgetMoveAndResizeUseCase(
    JupiterUpdateCrownEntityUseCase[HomeWidgetMoveAndResizeArgs, None]
):
    """The use case for moving a home widget."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HomeWidgetMoveAndResizeArgs,
    ) -> None:
        """Execute the command's action."""
        widget = await self.load_entity(uow, context.user.ref_id, HomeWidget, args.ref_id)
        home_tab = await self.load_entity(uow, context.user.ref_id, HomeTab, widget.home_tab.ref_id)
        widget = widget.move_and_resize(
            context.domain_context,
            home_tab.target,
            args.row,
            args.col,
            args.dimension,
        )
        await uow.get_for(HomeWidget).save(widget)
        await progress_reporter.mark_updated(widget)

        home_tab = home_tab.move_widget_to(
            context.domain_context,
            widget_ref_id=args.ref_id,
            geometry=widget.geometry,
        )
        await uow.get_for(HomeTab).save(home_tab)
        await progress_reporter.mark_updated(home_tab)
