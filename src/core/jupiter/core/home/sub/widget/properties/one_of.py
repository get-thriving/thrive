"""The properties of a home widget, whatever its type."""

from jupiter.core.home.sub.widget.properties.empty import EmptyHomeWidgetProperties
from jupiter.core.home.sub.widget.properties.key_habits_streaks import (
    KeyHabitsStreaksHomeWidgetProperties,
)
from jupiter.core.home.widget import WidgetType
from jupiter.framework.errors import InputValidationError

OneOfHomeWidgetProperties = (
    KeyHabitsStreaksHomeWidgetProperties | EmptyHomeWidgetProperties
)


def build_default_home_widget_properties(
    the_type: WidgetType,
) -> OneOfHomeWidgetProperties:
    """Build the properties a freshly created widget of a type starts with."""
    if the_type == WidgetType.KEY_HABITS_STREAKS:
        return KeyHabitsStreaksHomeWidgetProperties.new([])
    return EmptyHomeWidgetProperties.new()


def check_home_widget_properties_fit_type(
    the_type: WidgetType, properties: OneOfHomeWidgetProperties
) -> None:
    """Check that properties are the kind a widget of this type has."""
    expected = build_default_home_widget_properties(the_type)
    if type(properties) is not type(expected):
        raise InputValidationError(
            f"Widget type {the_type.value} does not take {properties.kind} properties"
        )
