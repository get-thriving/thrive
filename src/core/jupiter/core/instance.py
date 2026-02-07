"""An instance for a jupiter application."""

from typing import Final

from jupiter.framework.errors import InputValidationError
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, hashable_value

_MAIN_INSTANCE: Final[str] = "Main"
_TO_FILL_INSTANCE: Final[str] = "TO-FILL"


@hashable_value
class Instance(AtomicValue[str]):
    """An instance for a Thrive application."""

    the_instance: str

    @staticmethod
    def new_or_generate(value: str, branch_name: str) -> "Instance":
        """Create a new instance or generate a new one."""
        if value == _TO_FILL_INSTANCE:
            return Instance(f"{branch_name.replace('/', '--')}")
        return Instance(value)

    def _validate(self) -> None:
        """Validate this instance."""
        if len(self.the_instance.strip()) == 0:
            raise InputValidationError("Expected instance to be non-empty")

    def __str__(self) -> str:
        """The string representation of the instance."""
        return self.the_instance

    def is_main(self) -> bool:
        """Whether this is the main instance."""
        return self.the_instance == _MAIN_INSTANCE


class InstanceDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[Instance]):
    """Encode to a database primitive."""

    def to_primitive(self, value: Instance) -> Primitive:
        """Encode to a primitive."""
        return str(value.the_instance)


class InstanceDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[Instance]):
    """Decode from a database primitive."""

    def from_raw_str(self, value: str) -> Instance:
        """Decode from a raw string."""
        return Instance(value)
