"""The particulars of an app."""

import abc
from dataclasses import dataclass


@dataclass(frozen=True)
class AppParticulars(abc.ABC):
    """The particulars of an app."""

    @abc.abstractmethod
    def as_event_source(self) -> str:
        """The event source of the app."""
