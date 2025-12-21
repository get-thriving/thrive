"""The particulars of an app."""

import abc
from dataclasses import dataclass

from jupiter.framework.value import EnumValue


class UnavailableForComponentError(Exception):
    """Exception raise when an action is blocked in a component."""


@dataclass(frozen=True)
class ComponentProperties(abc.ABC):
    """The particulars of an app component."""

    @abc.abstractmethod
    def allows(
        self, only_for: list[EnumValue] | None, excluded: list[EnumValue] | None
    ) -> bool:
        """Whether this component properties allows for a given filter."""

    @abc.abstractmethod
    def as_event_source(self) -> str:
        """The event source of the app."""
