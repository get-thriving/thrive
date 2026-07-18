"""The type of principal an access grant is given to."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class PrincipalType(EnumValue):
    """The type of principal an access grant is given to."""

    USER = "user"
