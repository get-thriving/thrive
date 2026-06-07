"""Status for publish entities."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class PublishEntityStatus(EnumValue):
    """The status of a publish entity."""

    DRAFT = "draft"
    ACTIVE = "active"
