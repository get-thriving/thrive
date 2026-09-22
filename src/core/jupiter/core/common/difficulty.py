"""The difficulty of a particular task."""

from functools import total_ordering

from jupiter.framework.value import EnumValue, enum_value


@enum_value
@total_ordering
class Difficulty(EnumValue):
    """The difficulty of a particular task."""

    HARD = "hard"
    MEDIUM = "medium"
    EASY = "easy"

    @property
    def default_event_duration_mins(self) -> int:
        """How long a task of this difficulty is assumed to take."""
        if self is Difficulty.EASY:
            return 15
        elif self is Difficulty.MEDIUM:
            return 30
        else:
            return 60

    def __lt__(self, other: object) -> bool:
        """Compare this with another."""
        if not isinstance(other, Difficulty):
            raise Exception(
                f"Cannot compare a difficulty with {other.__class__.__name__}",
            )

        all_values = self.get_all_values()

        return all_values.index(self.value) < all_values.index(other.value)
