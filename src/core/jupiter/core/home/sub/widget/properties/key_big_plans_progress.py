"""The properties of a key big plans progress home widget."""

from typing import Literal

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import CompositeValue, value


@value
class KeyBigPlansProgressHomeWidgetProperties(CompositeValue):
    """The properties of a key big plans progress home widget.

    The widget shows the progress of exactly these big plans. It lays them out
    by how pressing they are, the same as it always has, so unlike the habits
    of a key habits streaks widget their order here carries no meaning.
    """

    kind: Literal["key-big-plans-progress"]
    big_plan_ref_ids: list[EntityId]

    def __post_init__(self) -> None:
        """Validate the properties."""
        if len(set(self.big_plan_ref_ids)) != len(self.big_plan_ref_ids):
            raise InputValidationError(
                "A big plan can only appear once in the big plans of a widget"
            )

    @staticmethod
    def new(
        big_plan_ref_ids: list[EntityId],
    ) -> "KeyBigPlansProgressHomeWidgetProperties":
        """Build the properties of a key big plans progress widget."""
        return KeyBigPlansProgressHomeWidgetProperties(
            kind="key-big-plans-progress", big_plan_ref_ids=big_plan_ref_ids
        )
