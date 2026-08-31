"""The name of a location."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class LocationName(EntityName):
    """The name of a location."""
