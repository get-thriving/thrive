"""Status of a deferred search indexing mutation log row."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class SearchMutationLogStatus(EnumValue):
    """Whether search indexing work for a mutation has been applied."""

    UNINDEXED = "unindexed"
    PROCESSING = "processing"
    INDEXED = "indexed"
    ERROR = "error"
