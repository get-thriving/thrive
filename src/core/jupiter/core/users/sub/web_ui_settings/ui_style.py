"""The UI style of the web app."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class UiStyle(EnumValue):
    """The UI style of the web app: the original look, or Strata."""

    CLASSIC = "classic"
    STRATA = "strata"
