"""The use case for loading a home small screen widget."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.home.sub.tab.root import HomeTab
from jupiter.core.home.sub.widget.root import HomeWidget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class HomeWidgetLoadArgs(JupiterLoadCrownEntityArgs):
    """The arguments for loading a home widget."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class HomeWidgetLoadResult(UseCaseResultBase):
    """The result of loading a home widget."""

    widget: HomeWidget


@readonly_use_case()
class HomeWidgetLoadUseCase(
    JupiterLoadCrownEntityUseCase[HomeWidgetLoadArgs, HomeWidgetLoadResult]
):
    """The use case for loading a home widget."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: HomeWidgetLoadArgs,
    ) -> HomeWidgetLoadResult:
        """Execute the use case's action."""
        allow_archived = args.allow_archived or False
        widget = await uow.get_for(HomeWidget).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )
        await self.check_entity(
            uow,
            context.user.ref_id,
            HomeTab,
            widget.home_tab.ref_id,
            allow_archived,
        )
        return HomeWidgetLoadResult(widget=widget)
