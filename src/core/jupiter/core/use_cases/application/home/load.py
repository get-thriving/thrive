"""The use case for loading the home."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.application.home.home_config import HomeConfig
from jupiter.core.domain.application.home.home_tab import HomeTab
from jupiter.core.domain.application.home.home_widget import HomeWidget
from jupiter.core.domain.application.home.widget import (
    WIDGET_CONSTRAINTS,
    WidgetType,
    WidgetTypeConstraints,
)
from jupiter.framework_new.storage.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    readonly_use_case,
)
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class HomeConfigLoadArgs(UseCaseArgsBase):
    """The arguments for the home config load use case."""


@use_case_result
class HomeConfigLoadResult(UseCaseResultBase):
    """The result of the home config load use case."""

    home_config: HomeConfig
    tabs: list[HomeTab]
    widgets: list[HomeWidget]
    widget_constraints: dict[WidgetType, WidgetTypeConstraints]


@readonly_use_case()
class HomeConfigLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        HomeConfigLoadArgs, HomeConfigLoadResult
    ]
):
    """The use case for loading the home config."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: HomeConfigLoadArgs,
    ) -> HomeConfigLoadResult:
        """Execute the command's action."""
        workspace = context.workspace
        home_config = await uow.get_for(HomeConfig).load_by_parent(workspace.ref_id)

        tabs = await uow.get_for(HomeTab).find_all(
            parent_ref_id=home_config.ref_id,
            allow_archived=False,
        )

        all_widgets = []
        for tab in tabs:
            widgets = await uow.get_for(HomeWidget).find_all_generic(
                parent_ref_id=tab.ref_id,
                allow_archived=False,
            )
            all_widgets.extend(widgets)

        return HomeConfigLoadResult(
            home_config=home_config,
            tabs=tabs,
            widgets=all_widgets,
            widget_constraints=WIDGET_CONSTRAINTS,
        )
