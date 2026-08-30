from enum import StrEnum


class AppDistributionState(StrEnum):
    IN_REVIEW = "in-review"
    NOT_AVAILABLE = "not-available"
    READY = "ready"

    def __str__(self) -> str:
        return str(self.value)
