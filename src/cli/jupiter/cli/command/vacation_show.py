"""UseCase for showing the vacations."""

from jupiter.core.config import JupiterLoggedInReadonlyUseCaseContext
from jupiter.cli.config import JupiterLoggedInReadonlyCommand
from jupiter.cli.command.rendering import (
    end_date_to_rich_text,
    entity_id_to_rich_text,
    entity_name_to_rich_text,
    start_date_to_rich_text,
)
from jupiter.core.use_cases.concept.vacations.find import (
    VacationFindResult,
    VacationFindUseCase,
)
from jupiter.core.use_cases.infra.use_cases import AppLoggedInReadonlyUseCaseContext
from rich.console import Console
from rich.text import Text
from rich.tree import Tree


class VacationShow(JupiterLoggedInReadonlyCommand[VacationFindUseCase, VacationFindResult]):
    """UseCase class for showing the vacations."""

    def _render_result(
        self,
        console: Console,
        context: JupiterLoggedInReadonlyUseCaseContext,
        result: VacationFindResult,
    ) -> None:
        sorted_vacations = sorted(
            result.entries,
            key=lambda v: (
                v.vacation.archived,
                v.vacation.start_date,
                v.vacation.end_date,
            ),
        )

        rich_tree = Tree("🌴 Vacations", guide_style="bold bright_blue")

        for entry in sorted_vacations:
            vacation_text = Text("")
            vacation_text.append(entity_id_to_rich_text(entry.vacation.ref_id))
            vacation_text.append(" ")
            vacation_text.append(entity_name_to_rich_text(entry.vacation.name))
            vacation_text.append(" ")
            vacation_text.append(start_date_to_rich_text(entry.vacation.start_date))
            vacation_text.append(" ")
            vacation_text.append(end_date_to_rich_text(entry.vacation.end_date))

            if entry.vacation.archived:
                vacation_text.stylize("gray62")

            rich_tree.add(vacation_text)

        console.print(rich_tree)
