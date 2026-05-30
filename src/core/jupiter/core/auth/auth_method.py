"""The auth method a user registered with."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class UserAuthMethod(EnumValue):
    """The auth method for a user."""

    LOCAL = "local"
    GOOGLE = "google"
    APPLE = "apple"
