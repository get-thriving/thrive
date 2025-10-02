"""The metric name."""

from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.value import hashable_value


@hashable_value
class MetricName(EntityName):
    """THe metric name."""
