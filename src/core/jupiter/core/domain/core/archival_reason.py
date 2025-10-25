"""The reason why an entity was archived."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class JupiterArchivalReason(EnumValue):
    """The reason why an entity was archived."""

    USER = "user"
    GC = "gc"
    SYNC = "sync"
