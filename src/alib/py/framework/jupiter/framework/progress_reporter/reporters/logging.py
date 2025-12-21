"""A progress reporter that logs to the console."""

import logging
from collections import defaultdict
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager, contextmanager
from typing import Final, Iterator

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.entity import CrownEntity
from jupiter.framework.progress_reporter.reporter import (
    ProgressReporter,
    ProgressReporterFactory,
)

LOGGER = logging.getLogger(__name__)


class LoggingProgressReporter(ProgressReporter):
    """A progress reporter that simply logs entity modifications."""

    _sections: Final[list[str]]
    _created_entities: Final[list[CrownEntity]]
    _created_entities_stats: Final[defaultdict[str, list[tuple[EntityName, EntityId]]]]
    _updated_entities: Final[list[CrownEntity]]
    _updated_entities_stats: Final[defaultdict[str, int]]
    _removed_entities: Final[list[CrownEntity]]
    _removed_entities_stats: Final[defaultdict[str, int]]
    _print_indent: Final[int]

    def __init__(
        self,
        sections: list[str] | None = None,
        created_entities: list[CrownEntity] | None = None,
        created_entities_stats: (
            defaultdict[str, list[tuple[EntityName, EntityId]]] | None
        ) = None,
        updated_entities: list[CrownEntity] | None = None,
        updated_entities_stats: defaultdict[str, int] | None = None,
        removed_entities: list[CrownEntity] | None = None,
        removed_entities_stats: defaultdict[str, int] | None = None,
        print_indent: int = 0,
    ) -> None:
        """Constructor."""
        self._sections = sections if sections is not None else []
        self._created_entities = (
            created_entities if created_entities is not None else []
        )
        self._created_entities_stats = (
            created_entities_stats
            if created_entities_stats is not None
            else defaultdict(list)
        )
        self._updated_entities = (
            updated_entities if updated_entities is not None else []
        )
        self._updated_entities_stats = (
            updated_entities_stats
            if updated_entities_stats is not None
            else defaultdict(int)
        )
        self._removed_entities = (
            removed_entities if removed_entities is not None else []
        )
        self._removed_entities_stats = (
            removed_entities_stats
            if removed_entities_stats is not None
            else defaultdict(int)
        )
        self._print_indent = print_indent

    @asynccontextmanager
    async def section(self, title: str) -> AsyncIterator[None]:
        """Start a section or subsection."""
        self._sections.append(title)
        LOGGER.info(
            "%s[section] %s", self._print_indent * "..", " // ".join(self._sections)
        )
        try:
            yield None
        finally:
            self._sections.pop()

    async def mark_created(self, entity: CrownEntity) -> None:
        """Mark an entity as created."""
        self._created_entities.append(entity)
        self._created_entities_stats[entity.__class__.__name__].append(
            (entity.name, entity.ref_id)
        )
        LOGGER.info(
            "%s[created] %s %s %s",
            self._print_indent * "..",
            entity.__class__.__name__,
            entity.ref_id,
            entity.name,
        )

    async def mark_updated(self, entity: CrownEntity) -> None:
        """Mark an entity as updated."""
        self._updated_entities.append(entity)
        self._updated_entities_stats[entity.__class__.__name__] += 1
        LOGGER.info(
            "%s[updated] %s %s %s",
            self._print_indent * "..",
            entity.__class__.__name__,
            entity.ref_id,
            entity.name,
        )

    async def mark_removed(self, entity: CrownEntity) -> None:
        """Mark an entity as removed."""
        self._removed_entities.append(entity)
        self._removed_entities_stats[entity.__class__.__name__] += 1
        LOGGER.info(
            "%s[removed] %s %s %s",
            self._print_indent * "..",
            entity.__class__.__name__,
            entity.ref_id,
            entity.name,
        )

    @property
    def created_entities(self) -> list[CrownEntity]:
        """Get the list of created entities."""
        return self._created_entities

    @property
    def updated_entities(self) -> list[CrownEntity]:
        """Get the list of updated entities."""
        return self._updated_entities

    @property
    def removed_entities(self) -> list[CrownEntity]:
        """Get the list of removed entities."""
        return self._removed_entities


class LoggingProgressReporterFactory(ProgressReporterFactory):
    """A factory for producing LoggingProgressReporter instances."""

    def __init__(self) -> None:
        """Constructor."""

    @contextmanager
    def envelope(
        self,
        name: str,
        add_prologue_and_epilogue: bool,
    ) -> Iterator[None]:
        """Envelope the execution of a command with a progress reporter that logs to the console."""
        if add_prologue_and_epilogue:
            LOGGER.info("Running command %s", name)
        yield None
        if add_prologue_and_epilogue:
            LOGGER.info("Command %s finished", name)

    def new_reporter(self, dedup_key: str) -> ProgressReporter:
        """Create a new progress reporter."""
        return LoggingProgressReporter()
