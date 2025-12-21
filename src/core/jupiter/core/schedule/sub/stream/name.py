"""The name of a schedule stream."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class ScheduleStreamName(EntityName):
    """The name of a schedule stream."""
