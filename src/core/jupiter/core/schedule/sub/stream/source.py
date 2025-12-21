"""The source of a particular schedule."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class ScheduleStreamSource(EnumValue):
    """The source of a schedule."""

    USER = "user"
    EXTERNAL_ICAL = "external-ical"
