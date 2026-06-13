"""The reason a principal has a particular access status over a resource."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class AccessStatusReason(EnumValue):
    """The reason a principal has a particular access status over a resource."""

    GRANT = "grant"
    INHERITED = "inherited"
