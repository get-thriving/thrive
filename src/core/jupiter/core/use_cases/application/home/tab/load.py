"""The use case for loading a home tab and its widgets."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domainx.application.home.home_tab import HomeTab
from jupiter.core.domainx.application.home.home_widget import HomeWidget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_loader import generic_loader


@use_case_args
class HomeTabLoadArgs(UseCaseArgsBase):
    """The arguments for loading a home tab."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class HomeTabLoadResult(UseCaseResultBase):
    """The result of loading a home tab."""

    tab: HomeTab
    widgets: list[HomeWidget]


@readonly_use_case()
class HomeTabLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[HomeTabLoadArgs, HomeTabLoadResult]
):
    """The use case for loading a home tab."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: HomeTabLoadArgs,
    ) -> HomeTabLoadResult:
        """Execute the use case's action."""
        tab, widgets = await generic_loader(
            uow,
            HomeTab,
            args.ref_id,
            HomeTab.widgets,
            allow_archived=args.allow_archived,
            allow_subentity_archived=True,
        )

        return HomeTabLoadResult(tab=tab, widgets=list(widgets))
