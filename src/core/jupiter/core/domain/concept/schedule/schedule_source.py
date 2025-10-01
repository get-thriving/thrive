"""The source of a particular schedule."""

from jupiter.framework_new.value import EnumValue, enum_value


@enum_value
class ScheduleSource(EnumValue):
    """The source of a schedule."""

    USER = "user"
    EXTERNAL_ICAL = "external-ical"
