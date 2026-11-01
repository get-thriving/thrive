"""Tests for the home widget entity."""

import pytest
from jupiter.core.home.sub.tab.target import HomeTabTarget
from jupiter.core.home.sub.widget.properties.empty import EmptyHomeWidgetProperties
from jupiter.core.home.sub.widget.properties.key_habits_streaks import (
    KeyHabitsStreaksHomeWidgetProperties,
)
from jupiter.core.home.sub.widget.root import HomeWidget
from jupiter.core.home.widget import WidgetDimension, WidgetGeometry, WidgetType
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError

_GEOMETRY = WidgetGeometry(row=0, col=0, dimension=WidgetDimension.DIM_1x1)


def _ctx() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_unix_timestamp(0),
        _context_str="test",
    )


def _habits(*ref_ids: str) -> KeyHabitsStreaksHomeWidgetProperties:
    return KeyHabitsStreaksHomeWidgetProperties.new([EntityId(r) for r in ref_ids])


def _widget(
    the_type: WidgetType,
    properties: KeyHabitsStreaksHomeWidgetProperties | EmptyHomeWidgetProperties | None,
) -> HomeWidget:
    return HomeWidget.new_home_widget(
        _ctx(),
        home_tab_ref_id=EntityId("1"),
        home_tab_target=HomeTabTarget.BIG_SCREEN,
        the_type=the_type,
        geometry=_GEOMETRY,
        properties=properties,
    ).assign_ref_id(EntityId("5"))


def test_a_new_widget_starts_with_the_default_properties_of_its_type() -> None:
    """Not saying anything about properties gives the type's defaults."""
    assert _widget(WidgetType.KEY_HABITS_STREAKS, None).properties == _habits()
    assert _widget(WidgetType.MOTD, None).properties == EmptyHomeWidgetProperties.new()


def test_a_new_widget_keeps_the_properties_it_was_created_with() -> None:
    """Chosen habits and their order survive creation."""
    widget = _widget(WidgetType.KEY_HABITS_STREAKS, _habits("4", "2", "9"))

    assert widget.properties == _habits("4", "2", "9")


def test_a_new_widget_refuses_properties_of_another_type() -> None:
    """Properties for a different type of widget are an input error."""
    with pytest.raises(InputValidationError):
        _widget(WidgetType.MOTD, _habits("1"))


def test_updating_properties_changes_habits_and_their_order() -> None:
    """Re-ordering and removing habits produces a new version."""
    widget = _widget(WidgetType.KEY_HABITS_STREAKS, _habits("1", "2", "3"))

    updated = widget.update_properties(_ctx(), _habits("3", "1"))

    assert updated.properties == _habits("3", "1")
    assert updated.version == widget.version + 1


def test_updating_to_the_same_properties_changes_nothing() -> None:
    """Saving an unchanged list does not create a new version."""
    widget = _widget(WidgetType.KEY_HABITS_STREAKS, _habits("1", "2"))

    updated = widget.update_properties(_ctx(), _habits("1", "2"))

    assert updated is widget


def test_updating_properties_does_not_touch_the_geometry() -> None:
    """Properties and placement are changed independently."""
    widget = _widget(WidgetType.KEY_HABITS_STREAKS, _habits("1"))

    updated = widget.update_properties(_ctx(), _habits("2"))

    assert updated.geometry == widget.geometry


def test_updating_to_properties_of_another_type_is_refused() -> None:
    """A key habits widget cannot be given empty properties, or the reverse."""
    habits_widget = _widget(WidgetType.KEY_HABITS_STREAKS, None)
    motd_widget = _widget(WidgetType.MOTD, None)

    with pytest.raises(InputValidationError):
        habits_widget.update_properties(_ctx(), EmptyHomeWidgetProperties.new())
    with pytest.raises(InputValidationError):
        motd_widget.update_properties(_ctx(), _habits("1"))
