"""The use case for creating a home small screen widget."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import (
    UserFeature,
    WorkspaceFeature,
)
from jupiter.core.home.sub.tab.root import HomeTab
from jupiter.core.home.sub.widget.root import HomeWidget
from jupiter.core.home.widget import (
    WIDGET_CONSTRAINTS,
    WidgetDimension,
    WidgetGeometry,
    WidgetType,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class HomeWidgetCreateArgs(UseCaseArgsBase):
    """The arguments for the create home widget use case."""

    home_tab_ref_id: EntityId
    the_type: WidgetType
    row: int
    col: int
    dimension: WidgetDimension


@use_case_result
class HomeWidgetCreateResult(UseCaseResultBase):
    """The result of the create home widget use case."""

    new_widget: HomeWidget


@mutation_use_case()
class HomeWidgetCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        HomeWidgetCreateArgs, HomeWidgetCreateResult
    ]
):
    """The use case for creating a home small screen widget."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HomeWidgetCreateArgs,
    ) -> HomeWidgetCreateResult:
        """Execute the command's action."""
        user = context.user
        workspace = context.workspace

        constraints = WIDGET_CONSTRAINTS[args.the_type]
        if not constraints.is_allowed_for(user.feature_flags, workspace.feature_flags):
            # make the the_feature be the first one in the constraints
            the_feature: WorkspaceFeature | UserFeature | str = ""
            if (
                constraints.only_for_user_features is not None
                and len(constraints.only_for_user_features) > 0
            ):
                the_feature = constraints.only_for_user_features[0]
            elif (
                constraints.only_for_workspace_features is not None
                and len(constraints.only_for_workspace_features) > 0
            ):
                the_feature = constraints.only_for_workspace_features[0]
            raise UnavailableForContextError(the_feature)

        home_tab = await uow.get_for(HomeTab).load_by_id(
            args.home_tab_ref_id,
        )

        home_widget = HomeWidget.new_home_widget(
            context.domain_context,
            home_tab_ref_id=home_tab.ref_id,
            home_tab_target=home_tab.target,
            the_type=args.the_type,
            geometry=WidgetGeometry(
                row=args.row, col=args.col, dimension=args.dimension
            ),
        )
        home_widget = await uow.get_for(HomeWidget).create(home_widget)
        await progress_reporter.mark_created(home_widget)

        home_tab = home_tab.add_widget(
            context.domain_context,
            widget_ref_id=home_widget.ref_id,
            geometry=WidgetGeometry(
                row=args.row, col=args.col, dimension=args.dimension
            ),
        )
        await uow.get_for(HomeTab).save(home_tab)
        await progress_reporter.mark_updated(home_tab)

        return HomeWidgetCreateResult(new_widget=home_widget)
