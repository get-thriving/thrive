"""The person name."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class PersonName(EntityName):
    """The person name."""
