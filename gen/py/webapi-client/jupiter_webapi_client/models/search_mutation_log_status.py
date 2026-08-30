from enum import StrEnum


class SearchMutationLogStatus(StrEnum):
    ERROR = "error"
    INDEXED = "indexed"
    PROCESSING = "processing"
    UNINDEXED = "unindexed"

    def __str__(self) -> str:
        return str(self.value)
