"""The user name for a user of jupiter."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class UserName(EntityName):
    """The user name for a user of jupiter."""
