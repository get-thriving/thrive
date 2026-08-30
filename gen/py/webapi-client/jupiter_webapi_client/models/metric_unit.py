from enum import StrEnum


class MetricUnit(StrEnum):
    COUNT = "count"
    MONEY = "money"
    WEIGHT = "weight"

    def __str__(self) -> str:
        return str(self.value)
