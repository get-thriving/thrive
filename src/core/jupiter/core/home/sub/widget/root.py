"""A widget on the home page."""

from jupiter.core.home.sub.tab.target import HomeTabTarget
from jupiter.core.home.widget import (
    WIDGET_CONSTRAINTS,
    WidgetDimension,
    WidgetGeometry,
    WidgetType,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)


@entity("HomeTab")
class HomeWidget(LeafEntity):
    """A widget on the home page."""

    home_tab: ParentLink
    the_type: WidgetType
    geometry: WidgetGeometry

    @staticmethod
    @create_entity_action
    def new_home_widget(
        ctx: DomainContext,
        home_tab_ref_id: EntityId,
        home_tab_target: HomeTabTarget,
        the_type: WidgetType,
        geometry: WidgetGeometry,
    ) -> "HomeWidget":
        """Create a new home widget."""
        constraints = WIDGET_CONSTRAINTS.get(the_type, None)
        if constraints is None:
            raise ValueError(f"Widget type {the_type} is not supported")
        if home_tab_target not in constraints.allowed_dimensions:
            raise ValueError(
                f"Widget type {the_type} is not allowed for tab target {home_tab_target}"
            )
        if geometry.dimension not in constraints.allowed_dimensions[home_tab_target]:
            raise ValueError(
                f"Dimension {geometry.dimension} is not allowed for widget type {the_type}"
            )
        return HomeWidget._create(
            ctx,
            home_tab=ParentLink(home_tab_ref_id),
            name=HomeWidget._build_name(home_tab_target, home_tab_ref_id),
            the_type=the_type,
            geometry=geometry,
        )

    @update_entity_action
    def move_and_resize(
        self,
        ctx: DomainContext,
        home_tab_target_for_reference: HomeTabTarget,
        row: int,
        col: int,
        dimension: WidgetDimension,
    ) -> "HomeWidget":
        """Move and resize a widget."""
        constraints = WIDGET_CONSTRAINTS.get(self.the_type, None)
        if constraints is None:
            raise ValueError(f"Widget type {self.the_type} is not supported")
        if home_tab_target_for_reference not in constraints.allowed_dimensions:
            raise ValueError(
                f"Widget type {self.the_type} is not allowed for tab target {home_tab_target_for_reference}"
            )
        if (
            dimension
            not in constraints.allowed_dimensions[home_tab_target_for_reference]
        ):
            raise ValueError(
                f"Dimension {dimension} is not allowed for widget type {self.the_type}"
            )
        return self._new_version(
            ctx,
            geometry=WidgetGeometry(row=row, col=col, dimension=dimension),
        )

    @staticmethod
    def _build_name(
        home_tab_target: HomeTabTarget, home_tab_ref_id: EntityId
    ) -> EntityName:
        """Build a name for a widget."""
        return EntityName(f"Widget on {home_tab_target.value} {home_tab_ref_id}")
