"""The helpers are helping."""

import abc
from collections.abc import Iterable
from contextlib import AbstractAsyncContextManager
from typing import ContextManager

from jupiter.framework.entity import CrownEntity


class ProgressReporter(abc.ABC):
    """A reporter to the user in real-time on modifications to entities."""

    @abc.abstractmethod
    def section(self, title: str) -> AbstractAsyncContextManager[None]:
        """Start a section or subsection."""

    @abc.abstractmethod
    async def mark_created(self, entity: CrownEntity) -> None:
        """Mark a particular entity as created."""

    @abc.abstractmethod
    async def mark_updated(self, entity: CrownEntity) -> None:
        """Mark a particular entity as updated."""

    @abc.abstractmethod
    async def mark_removed(self, entity: CrownEntity) -> None:
        """Mark a particular entity as removed."""

    @property
    @abc.abstractmethod
    def created_entities(self) -> Iterable[CrownEntity]:
        """The set of entities that were created while this progress reporter was active."""

    @property
    @abc.abstractmethod
    def updated_entities(self) -> Iterable[CrownEntity]:
        """The set of entities that were updated while this progress reporter was active."""

    @property
    @abc.abstractmethod
    def removed_entities(self) -> Iterable[CrownEntity]:
        """The set of entities that were removed while this progress reporter was active."""


class ProgressReporterFactory(abc.ABC):
    """A factory for progress reporters."""

    @abc.abstractmethod
    def envelope(
        self, name: str, add_prologue_and_epilogue: bool
    ) -> ContextManager[None]:
        """Envelope the execution of a command with a progress reporter."""

    @abc.abstractmethod
    def new_reporter(self, dedup_key: str) -> ProgressReporter:
        """Build a progress reporter for a given context."""
