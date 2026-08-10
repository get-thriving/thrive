"""The level of access a principal has to a shared resource."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class AccessLevel(EnumValue):
    """The level of access a principal has to a shared resource."""

    OWNER = "owner"
    WRITER = "writer"
    COMMENTER = "commenter"
    READER = "reader"

    def allows(self, required: "AccessLevel") -> bool:
        """Whether this access level grants at least the required access level."""
        ranking = ["reader", "commenter", "writer", "owner"]
        return ranking.index(self.value) >= ranking.index(required.value)

    def is_strictly_stronger_than(self, other: "AccessLevel") -> bool:
        """Whether this access level is strictly stronger than another."""
        return self.allows(other) and self != other

    @property
    def is_invitable(self) -> bool:
        """Whether this level can be assigned when inviting a user to an entity."""
        return self != AccessLevel.OWNER
