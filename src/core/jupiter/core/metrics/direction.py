"""The direction for a metric."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class MetricDirection(EnumValue):
    """The direction for a metric - whether up or down is good."""

    NONE = "none"
    UP_IS_GOOD = "up_is_good"
    DOWN_IS_GOOD = "down_is_good"
