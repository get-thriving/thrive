"""The color scheme of the web app."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class ColorScheme(EnumValue):
    """The color scheme of the web app: light, dark, or the one the device uses."""

    SYSTEM = "system"
    LIGHT = "light"
    DARK = "dark"
