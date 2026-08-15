"""The name of a todo task."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class TodoTaskName(EntityName):
    """The todo task name."""
