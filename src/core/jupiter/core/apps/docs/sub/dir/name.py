"""The directory name."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class DirName(EntityName):
    """The directory name."""
