from enum import Enum


class AccessRequestStatus(str, Enum):
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    REQUESTED = "requested"

    def __str__(self) -> str:
        return str(self.value)
