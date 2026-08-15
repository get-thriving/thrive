"""Status for visions in a life plan."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class VisionStatus(EnumValue):
    """The status of a vision."""

    ACTIVE = "active"
    DRAFT = "draft"
    OLD = "old"
