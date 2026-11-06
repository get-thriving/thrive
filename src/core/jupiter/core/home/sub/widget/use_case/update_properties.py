"""The use case for changing the properties of a home widget."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.home.sub.widget.properties.one_of import OneOfHomeWidgetProperties
from jupiter.core.home.sub.widget.root import HomeWidget
from jupiter.core.home.sub.widget.service.check_properties_references import (
    CheckHomeWidgetPropertiesReferencesService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class HomeWidgetUpdatePropertiesArgs(JupiterUpdateCrownEntityArgs):
    """The arguments for changing the properties of a home widget."""

    ref_id: EntityId
    properties: OneOfHomeWidgetProperties


@mutation_use_case()
class HomeWidgetUpdatePropertiesUseCase(
    JupiterUpdateCrownEntityUseCase[HomeWidgetUpdatePropertiesArgs, None]
):
    """The use case for changing the properties of a home widget."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HomeWidgetUpdatePropertiesArgs,
    ) -> None:
        """Execute the command's action."""
        widget = await self.load_entity(
            uow, context.user.ref_id, HomeWidget, args.ref_id
        )
        await CheckHomeWidgetPropertiesReferencesService().do_it(
            uow, context.user.ref_id, args.properties
        )
        widget = widget.update_properties(context.domain_context, args.properties)
        await uow.get_for(HomeWidget).save(widget)
        await progress_reporter.mark_updated(widget)
