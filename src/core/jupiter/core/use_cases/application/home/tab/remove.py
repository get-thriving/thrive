"""The command for archiving a home small screen tab."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domainx.application.home.home_config import HomeConfig
from jupiter.core.domainx.application.home.home_tab import HomeTab
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class HomeTabRemoveArgs(UseCaseArgsBase):
    """The arguments for archiving a home tab."""

    ref_id: EntityId


@mutation_use_case()
class HomeTabRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[HomeTabRemoveArgs, None]
):
    """The command for archiving a home tab."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HomeTabRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        tab = await uow.get_for(HomeTab).load_by_id(args.ref_id, allow_archived=True)
        home_config = await uow.get_for(HomeConfig).load_by_parent(workspace.ref_id)
        home_config = home_config.remove_tab(
            context.domain_context, tab.target, tab.ref_id
        )
        await uow.get_for(HomeConfig).save(home_config)

        await generic_crown_remover(
            context.domain_context,
            uow,
            progress_reporter,
            HomeTab,
            args.ref_id,
        )
