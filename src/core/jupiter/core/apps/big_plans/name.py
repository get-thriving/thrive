"""The name of the big plan."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class BigPlanName(EntityName):
    """The big plan name."""
