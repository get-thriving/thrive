from enum import StrEnum


class MetricDirection(StrEnum):
    DOWN_IS_GOOD = "down_is_good"
    NONE = "none"
    UP_IS_GOOD = "up_is_good"

    def __str__(self) -> str:
        return str(self.value)
