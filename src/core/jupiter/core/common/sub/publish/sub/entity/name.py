"""The name of a publish entity."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class PublishEntityName(EntityName):
    """The name of a publish entity."""
