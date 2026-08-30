from enum import StrEnum


class AccessRequestStatus(StrEnum):
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    REQUESTED = "requested"

    def __str__(self) -> str:
        return str(self.value)
