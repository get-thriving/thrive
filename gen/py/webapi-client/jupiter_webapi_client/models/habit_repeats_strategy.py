from enum import StrEnum


class HabitRepeatsStrategy(StrEnum):
    ALL_SAME = "all-same"
    SPREAD_OUT_NO_OVERLAP = "spread-out-no-overlap"

    def __str__(self) -> str:
        return str(self.value)
