"""The name of a schedule stream."""

from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.value import hashable_value


@hashable_value
class ScheduleStreamName(EntityName):
    """The name of a schedule stream."""
