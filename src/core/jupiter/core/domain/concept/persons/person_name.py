"""The person name."""

from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.value import hashable_value


@hashable_value
class PersonName(EntityName):
    """The person name."""
