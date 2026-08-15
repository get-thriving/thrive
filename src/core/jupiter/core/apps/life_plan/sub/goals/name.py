"""The name of a goal in a life plan."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class GoalName(EntityName):
    """The name of a goal in a life plan."""
