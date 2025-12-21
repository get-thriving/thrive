"""UseCase for showing the persons."""

from jupiter.cli.command.rendering import (
    entity_id_to_rich_text,
    entity_name_to_rich_text,
    period_to_rich_text,
    person_birthday_to_rich_text,
    person_relationship_to_rich_text,
)
from jupiter.cli.config import JupiterLoggedInReadonlyCommand
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import JupiterLoggedInReadonlyContext
from jupiter.core.features import WorkspaceFeature
from jupiter.core.persons.use_case.find import (
    PersonFindResult,
    PersonFindUseCase,
)
from rich.console import Console
from rich.text import Text
from rich.tree import Tree


class PersonShow(JupiterLoggedInReadonlyCommand[PersonFindUseCase, PersonFindResult]):
    """UseCase for showing the persons."""

    def _render_result(
        self,
        console: Console,
        context: JupiterLoggedInReadonlyContext,
        result: PersonFindResult,
    ) -> None:
        sorted_entries = sorted(
            result.entries,
            key=lambda p: (
                p.person.archived,
                p.person.relationship,
                (
                    p.person.catch_up_params.period
                    if p.person.catch_up_params
                    else RecurringTaskPeriod.YEARLY
                ),
            ),
        )

        rich_tree = Tree("👨 Persons", guide_style="bold bright_blue")

        if context.workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            catch_up_project_text = Text(
                f"The catch up project is {result.catch_up_project.name}",
            )
            rich_tree.add(catch_up_project_text)

        for entry in sorted_entries:
            person = entry.person
            person_text = entity_id_to_rich_text(person.ref_id)

            person_text.append(" ")
            person_text.append(entity_name_to_rich_text(person.name))

            person_text.append(" ")
            person_text.append(person_relationship_to_rich_text(person.relationship))

            if person.catch_up_params:
                person_text.append(" ")
                person_text.append(period_to_rich_text(person.catch_up_params.period))

            if person.birthday:
                person_text.append(" ")
                person_text.append(person_birthday_to_rich_text(person.birthday))

            if person.archived:
                person_text.stylize("gray62")

            rich_tree.add(person_text)

        console.print(rich_tree)
