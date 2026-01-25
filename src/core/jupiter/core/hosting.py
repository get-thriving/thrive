"""The type of hosting jupiter is run into."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class Hosting(EnumValue):
    """The type of hosting jupiter is run into."""

    HOSTED_GLOBAL = "hosted-global"
    SELF_HOSTED = "self-hosted"
    LOCAL = "local"

    @property
    def is_hosted_global(self) -> bool:
        """Whether this is a hosted global instance."""
        return self == Hosting.HOSTED_GLOBAL

    def __str__(self) -> str:
        """The string representation of the hosting."""
        return self.value
