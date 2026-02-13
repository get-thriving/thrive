"""The name of an API key."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class APIKeyName(EntityName):
    """The name of an API key."""
