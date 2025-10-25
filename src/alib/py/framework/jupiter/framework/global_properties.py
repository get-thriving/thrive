"""Framework level global properties."""

import abc
from dataclasses import dataclass

from jupiter.framework.value import EnumValue


class UnavailableGloballyError(Exception):
    """Exception raised when global properties block a certain action."""


@dataclass(frozen=True)
class GlobalProperties(abc.ABC):
    """The base class for global properties."""

    @abc.abstractmethod
    def allows(
        self, only_for: list[EnumValue] | None, excluded: list[EnumValue] | None
    ) -> bool:
        """Whether this global properties allows for a given filter."""
