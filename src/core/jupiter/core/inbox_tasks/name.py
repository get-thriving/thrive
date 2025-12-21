"""The name of an inbox task."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class InboxTaskName(EntityName):
    """The name of an inbox task."""
