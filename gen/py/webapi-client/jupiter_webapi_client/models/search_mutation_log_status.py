from enum import Enum


class SearchMutationLogStatus(str, Enum):
    ERROR = "error"
    INDEXED = "indexed"
    PROCESSING = "processing"
    UNINDEXED = "unindexed"

    def __str__(self) -> str:
        return str(self.value)
