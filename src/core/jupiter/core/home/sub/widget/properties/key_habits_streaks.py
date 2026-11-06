"""The properties of a key habits streaks home widget."""

from typing import Literal

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import CompositeValue, value


@value
class KeyHabitsStreaksHomeWidgetProperties(CompositeValue):
    """The properties of a key habits streaks home widget.

    The widget shows the streaks of exactly these habits, in this order.
    """

    kind: Literal["key-habits-streaks"]
    habit_ref_ids: list[EntityId]

    def __post_init__(self) -> None:
        """Validate the properties."""
        if len(set(self.habit_ref_ids)) != len(self.habit_ref_ids):
            raise InputValidationError(
                "A habit can only appear once in the habits of a widget"
            )

    @staticmethod
    def new(habit_ref_ids: list[EntityId]) -> "KeyHabitsStreaksHomeWidgetProperties":
        """Build the properties of a key habits streaks widget."""
        return KeyHabitsStreaksHomeWidgetProperties(
            kind="key-habits-streaks", habit_ref_ids=habit_ref_ids
        )
