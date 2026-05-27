"""The name of a schedule export."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class ScheduleExportName(EntityName):
    """The name of a schedule export."""
