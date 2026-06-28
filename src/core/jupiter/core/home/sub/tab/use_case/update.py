"""The command for updating a home small screen tab's properties."""

from jupiter.core.common.entity_icon import EntityIcon
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.home.sub.tab.root import HomeTab
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class HomeTabUpdateArgs(JupiterUpdateCrownEntityArgs):
    """The arguments for updating a home tab."""

    ref_id: EntityId
    name: UpdateAction[EntityName]
    icon: UpdateAction[EntityIcon | None]


@mutation_use_case()
class HomeTabUpdateUseCase(
    JupiterUpdateCrownEntityUseCase[HomeTabUpdateArgs, None]
):
    """The command for updating a home tab's properties."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HomeTabUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        home_tab = await self.load_entity(
            uow, context.user.ref_id, HomeTab, args.ref_id
        )

        home_tab = home_tab.update(
            context.domain_context,
            name=args.name,
            icon=args.icon,
        )

        await uow.get_for(HomeTab).save(home_tab)
        await progress_reporter.mark_updated(home_tab)
