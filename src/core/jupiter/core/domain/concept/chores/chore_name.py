"""The chore name."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class ChoreName(EntityName):
    """The chore name."""
