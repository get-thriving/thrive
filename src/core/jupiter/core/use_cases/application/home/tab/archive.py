"""The command for archiving a home small screen tab."""

from jupiter.core.config import JupiterTransactionalLoggedInMutationUseCase
from jupiter.core.domain.application.home.home_config import HomeConfig
from jupiter.core.domain.application.home.home_tab import HomeTab
from jupiter.core.domain.core.archival_reason import ArchivalReason
from jupiter.core.domain.infra.generic_crown_archiver import generic_crown_archiver
from jupiter.core.domain.storage_engine import DomainUnitOfWork
from jupiter.core.use_cases.infra.use_cases import (
    AppLoggedInMutationUseCaseContext,
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.use_case import ProgressReporter
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class HomeTabArchiveArgs(UseCaseArgsBase):
    """The arguments for archiving a home tab."""

    ref_id: EntityId


@mutation_use_case()
class HomeTabArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[HomeTabArchiveArgs, None]
):
    """The command for archiving a home tab."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
        args: HomeTabArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        tab = await uow.get_for(HomeTab).load_by_id(args.ref_id)

        home_config = await uow.get_for(HomeConfig).load_by_parent(workspace.ref_id)
        home_config = home_config.remove_tab(
            context.domain_context, tab.target, tab.ref_id
        )
        await uow.get_for(HomeConfig).save(home_config)

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            HomeTab,
            args.ref_id,
            ArchivalReason.USER,
        )
