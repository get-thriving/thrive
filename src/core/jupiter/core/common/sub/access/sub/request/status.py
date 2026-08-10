"""Status for an access request."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class AccessRequestStatus(EnumValue):
    """The status of an access request."""

    REQUESTED = "requested"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
