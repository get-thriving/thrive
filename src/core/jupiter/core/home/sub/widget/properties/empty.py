"""The properties of a home widget that has nothing to configure."""

from typing import Literal

from jupiter.framework.value import CompositeValue, value


@value
class EmptyHomeWidgetProperties(CompositeValue):
    """The properties of a home widget that has nothing to configure."""

    kind: Literal["empty"]

    @staticmethod
    def new() -> "EmptyHomeWidgetProperties":
        """Build the properties of a widget with nothing to configure."""
        return EmptyHomeWidgetProperties(kind="empty")
