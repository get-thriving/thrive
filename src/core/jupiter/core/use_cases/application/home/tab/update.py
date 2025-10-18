"""The command for updating a home small screen tab's properties."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.application.home.home_tab import HomeTab
from jupiter.core.domain.core.entity_icon import EntityIcon
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.progress_reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.update_action import UpdateAction
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class HomeTabUpdateArgs(UseCaseArgsBase):
    """The arguments for updating a home tab."""

    ref_id: EntityId
    name: UpdateAction[EntityName]
    icon: UpdateAction[EntityIcon | None]


@mutation_use_case()
class HomeTabUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[HomeTabUpdateArgs, None]
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
        home_tab = await uow.get_for(HomeTab).load_by_id(
            args.ref_id,
        )

        home_tab = home_tab.update(
            context.domain_context,
            name=args.name,
            icon=args.icon,
        )

        await uow.get_for(HomeTab).save(home_tab)
        await progress_reporter.mark_updated(home_tab)
