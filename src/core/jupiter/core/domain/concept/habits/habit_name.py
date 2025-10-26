"""The habit name."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class HabitName(EntityName):
    """The habit name."""
