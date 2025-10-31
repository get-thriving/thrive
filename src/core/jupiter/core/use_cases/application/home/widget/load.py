"""The use case for loading a home small screen widget."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
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


@use_case_args
class HomeWidgetLoadArgs(UseCaseArgsBase):
    """The arguments for loading a home widget."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class HomeWidgetLoadResult(UseCaseResultBase):
    """The result of loading a home widget."""

    widget: HomeWidget


@readonly_use_case()
class HomeWidgetLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        HomeWidgetLoadArgs, HomeWidgetLoadResult
    ]
):
    """The use case for loading a home widget."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: HomeWidgetLoadArgs,
    ) -> HomeWidgetLoadResult:
        """Execute the use case's action."""
        widget = await uow.get_for(HomeWidget).load_by_id(
            args.ref_id,
            allow_archived=args.allow_archived,
        )
        return HomeWidgetLoadResult(widget=widget)
