"""A universe for a jupiter application."""

import re
from typing import Final

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import PrimitiveAtomicValueDatabaseDecoder, PrimitiveAtomicValueDatabaseEncoder
from jupiter.framework.value import AtomicValue, hashable_value

_UNIVERSE_RE: Final[re.Pattern[str]] = re.compile(r"^[a-z0-9-]+$")
_THRIVE_UNIVERSE: Final[str] = "thrive"


@hashable_value
class Universe(AtomicValue[str]):
    """A universe for a jupiter application."""

    the_universe: str

    def _validate(self) -> None:
        """Validate this universe."""
        if len(self.the_universe) == 0:
            raise InputValidationError("Expected universe to be non-empty")

        if not _UNIVERSE_RE.match(self.the_universe):
            raise InputValidationError(
                f"Expected universe '{self.the_universe}' to match '{_UNIVERSE_RE.pattern}'",
            )

    def __str__(self) -> str:
        """The string representation of the universe."""
        return self.the_universe

    def is_thrive(self) -> bool:
        """Whether this is the Thrive universe."""
        return self.the_universe == _THRIVE_UNIVERSE


class UniverseDatabaseEncoder(
    PrimitiveAtomicValueDatabaseEncoder[Universe]
):
    """Encode to a database primitive."""

    def to_primitive(self, value: Universe) -> Primitive:
        """Encode to a primitive."""
        return str(value.the_universe)


class UniverseDatabaseDecoder(
    PrimitiveAtomicValueDatabaseDecoder[Universe]
):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> Universe:
        """Decode from a raw string."""
        return Universe(value)