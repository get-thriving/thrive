"""A CLI app progress reporter."""

import argparse
import asyncio
from collections import defaultdict
from collections.abc import AsyncIterator, Iterator
from contextlib import asynccontextmanager, contextmanager
from typing import Final

from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.entity import CrownEntity
from jupiter.framework_new.progress_reporter import NoOpProgressReporter
from jupiter.framework_new.use_case import (
    LoggedInContext,
    LoggedInMutationContext,
    ProgressReporter,
    ProgressReporterFactory,
)
from rich.console import Console
from rich.panel import Panel
from rich.status import Status
from rich.text import Text
from rich.tree import Tree


class RichConsoleProgressReporter(ProgressReporter):
    """A progress reporter based on a Rich console that outputs progress to the console."""

    _console: Final[Console]
    _status: Final[Status]
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
        console: Console,
        status: Status,
        sections: list[str],
        created_entities: list[CrownEntity],
        created_entities_stats: defaultdict[str, list[tuple[EntityName, EntityId]]],
        updated_entities: list[CrownEntity],
        updated_entities_stats: defaultdict[str, int],
        removed_entities: list[CrownEntity],
        removed_entities_stats: defaultdict[str, int],
        print_indent: int,
    ) -> None:
        """Constructor."""
        self._console = console
        self._status = status
        self._sections = sections
        self._created_entities = created_entities
        self._created_entities_stats = created_entities_stats
        self._updated_entities = updated_entities
        self._updated_entities_stats = updated_entities_stats
        self._removed_entities = removed_entities
        self._removed_entities_stats = removed_entities_stats
        self._print_indent = print_indent

    @asynccontextmanager
    async def section(self, title: str) -> AsyncIterator[None]:
        """Start a section or subsection."""
        self._sections.append(title)
        section_text = Text(self._sections[0])
        for section_title in self._sections[1:]:
            section_text.append(" // ")
            section_text.append(section_title)
        panel = Panel(section_text)
        self._console.print(panel)
        yield None
        self._sections.pop()

    async def mark_created(self, entity: CrownEntity) -> None:
        """Mark an entity as created."""
        self._created_entities.append(entity)
        self._created_entities_stats[entity.__class__.__name__].append(
            (entity.name, entity.ref_id),
        )
        text = self._entity_to_str("creating", entity)
        self._status.update(text)
        await asyncio.sleep(0.01)
        self._console.print(text)
        self._status.update("Working on it ...")

    async def mark_updated(self, entity: CrownEntity) -> None:
        """Mark an entity as created."""
        self._updated_entities.append(entity)
        self._updated_entities_stats[entity.__class__.__name__] += 1
        text = self._entity_to_str("updating", entity)
        self._status.update(text)
        await asyncio.sleep(0.01)
        self._console.print(text)
        self._status.update("Working on it ...")

    async def mark_removed(self, entity: CrownEntity) -> None:
        """Mark an entity as created."""
        self._removed_entities.append(entity)
        self._removed_entities_stats[entity.__class__.__name__] += 1
        text = self._entity_to_str("removing", entity)
        self._status.update(text)
        await asyncio.sleep(0.01)
        self._console.print(text)
        self._status.update("Working on it ...")

    def print_prologue(self, command_name: str, args: argparse.Namespace) -> None:
        """Print a prologue section."""
        command_text = Text(f"{command_name}")
        for arg, val in vars(args).items():
            if (
                arg == "subparser_name"
                or arg == "verbose_logging"
                or arg == "min_log_level"
                or arg == "just_show_version"
            ):
                continue  # Ugly, but not the worst thing!
            command_text.append(f" {arg}:{val}")
        command_text.stylize("green on blue bold underline")

        prologue_text = Text("Running command ").append(command_text)
        panel = Panel(prologue_text)
        self._console.print(panel)

    def print_epilogue(self) -> None:
        """Print an epilogue section."""
        epilogue_tree = Tree("Results:", guide_style="bold bright_blue")
        if len(self._created_entities_stats):
            created_tree = epilogue_tree.add("Created:")
            for (
                entity_type,
                created_entity_list,
            ) in self._created_entities_stats.items():
                entity_count = len(created_entity_list)
                entity_type_tree = created_tree.add(
                    f"{entity_type} => {entity_count} in total",
                    guide_style="blue",
                )
                for entity_name, entity_id in created_entity_list:
                    created_entity_text = Text("")
                    created_entity_text.append(_entity_id_to_rich_text(entity_id))
                    created_entity_text.append(" ")
                    created_entity_text.append(
                        _entity_name_to_rich_text(entity_name),
                    )
                    entity_type_tree.add(created_entity_text)
        if len(self._updated_entities_stats):
            updated_tree = epilogue_tree.add("Updated:")
            for entity_type, entity_count in self._updated_entities_stats.items():
                updated_tree.add(
                    f"{entity_type} => {entity_count} in total",
                    guide_style="blue",
                )
        if len(self._removed_entities_stats):
            removed_tree = epilogue_tree.add("Removed:")
            for entity_type, entity_count in self._removed_entities_stats.items():
                removed_tree.add(
                    f"{entity_type} => {entity_count} in total",
                    guide_style="blue",
                )

        results_panel = Panel(epilogue_tree)

        self._console.print(results_panel)

    @property
    def created_entities(self) -> list[CrownEntity]:
        """Created entities."""
        return self._created_entities

    @property
    def updated_entities(self) -> list[CrownEntity]:
        """Created entities."""
        return self._updated_entities

    @property
    def removed_entities(self) -> list[CrownEntity]:
        """Created entities."""
        return self._removed_entities

    def _entity_to_str(self, action_type: str, entity: CrownEntity) -> Text:
        """Prepare the final string form for this one."""
        text = Text(
            self._print_indent * ".."
            + f"✅ Done with {action_type} {entity.__class__.__name__}",
        )

        text.append(" ")
        text.append(_entity_id_to_rich_text(entity.ref_id))
        text.append(" ")
        text.append(_entity_name_to_rich_text(entity.name))

        return text


class RichConsoleProgressReporterFactory(
    ProgressReporterFactory[LoggedInMutationContext]
):
    """A progress reporter factory that builds Rich progress reporters."""

    _console: Final[Console]
    _status: Final[Status]
    _stored_progress_reporter: Final[RichConsoleProgressReporter]
    _should_have_streaming_progress_report: bool

    def __init__(self, console: Console) -> None:
        """Constructor."""
        self._console = console
        self._status = self._console.status("Working on it ...", spinner="bouncingBall")
        self._stored_progress_reporter = RichConsoleProgressReporter(
            console=self._console,
            status=self._status,
            sections=[],
            created_entities=[],
            created_entities_stats=defaultdict(list),
            updated_entities=[],
            updated_entities_stats=defaultdict(lambda: 0),
            removed_entities=[],
            removed_entities_stats=defaultdict(lambda: 0),
            print_indent=0,
        )
        self._should_have_streaming_progress_report = True

    def new_reporter(self, context: LoggedInContext) -> ProgressReporter:
        """Create a new progress reporter."""
        if not self._should_have_streaming_progress_report:
            return NoOpProgressReporter()
        return self._stored_progress_reporter

    @contextmanager
    def envelope(
        self,
        should_have_streaming_progress_report: bool,
        command_name: str,
        args: argparse.Namespace,
    ) -> Iterator["RichConsoleProgressReporterFactory"]:
        """Evelope execution of this with nice graphics."""
        self._should_have_streaming_progress_report = (
            should_have_streaming_progress_report
        )
        try:
            if should_have_streaming_progress_report:
                self._status.start()
                self._stored_progress_reporter.print_prologue(command_name, args)
            yield self
            if should_have_streaming_progress_report:
                self._stored_progress_reporter.print_epilogue()
        finally:
            self._status.stop()


def _entity_id_to_rich_text(entity_id: EntityId) -> Text:
    """Transform an entity id into text."""
    return Text(f"#{entity_id}", style="blue bold")


def _entity_name_to_rich_text(name: EntityName) -> Text:
    """Transform an entity name into text."""
    return Text(str(name), style="green underline")
