"""The vacation name."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class VacationName(EntityName):
    """The vacation name."""
