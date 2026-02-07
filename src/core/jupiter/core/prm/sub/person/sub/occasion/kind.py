"""The kind of an occasion."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class OccasionKind(EnumValue):
    """The kind of an occasion."""

    BIRTHDAY = "birthday"
    ANNIVERSARY = "anniversary"
    HOLIDAY = "holiday"
    OTHER = "other"
