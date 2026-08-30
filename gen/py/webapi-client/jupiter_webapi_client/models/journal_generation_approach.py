from enum import StrEnum


class JournalGenerationApproach(StrEnum):
    BOTH_JOURNAL_AND_TASK = "both-journal-and-task"
    NONE = "none"
    ONLY_JOURNAL = "only-journal"

    def __str__(self) -> str:
        return str(self.value)
