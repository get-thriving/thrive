"""The use case for loading a home tab and its widgets."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.home.sub.tab.root import HomeTab
from jupiter.core.home.sub.widget.root import HomeWidget
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


@use_case_args
class HomeTabLoadArgs(UseCaseArgsBase):
    """The arguments for loading a home tab."""

    ref_id: EntityId
    allow_archived: bool | None


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
        allow_archived = args.allow_archived or False
        tab = await uow.get_for(HomeTab).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        widgets = await uow.get_for(HomeWidget).find_all(
            parent_ref_id=tab.ref_id,
            allow_archived=True,
        )

        return HomeTabLoadResult(tab=tab, widgets=list(widgets))
