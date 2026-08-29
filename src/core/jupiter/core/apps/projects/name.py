"""The name of the project."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class ProjectName(EntityName):
    """The project name."""
