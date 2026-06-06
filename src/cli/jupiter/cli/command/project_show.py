"""UseCase for showing the projects."""

from typing import cast

from jupiter.cli.command.rendering import (
    actionable_date_to_rich_text,
    aspect_to_rich_text,
    project_status_to_rich_text,
    due_date_to_rich_text,
    entity_id_to_rich_text,
    inbox_task_summary_to_rich_text,
)
from jupiter.cli.config import JupiterLoggedInReadonlyCommand
from jupiter.core.projects.use_case.find import (
    ProjectFindResult,
    ProjectFindUseCase,
)
from jupiter.core.config import JupiterLoggedInReadonlyContext
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.framework.base.adate import ADate
from rich.console import Console
from rich.text import Text
from rich.tree import Tree


class ProjectShow(
    JupiterLoggedInReadonlyCommand[ProjectFindUseCase, ProjectFindResult]
):
    """UseCase class for showing the projects."""

    def _render_result(
        self,
        console: Console,
        context: JupiterLoggedInReadonlyContext,
        result: ProjectFindResult,
    ) -> None:
        sorted_projects = sorted(
            result.entries,
            key=lambda bpe: (
                bpe.project.archived,
                bpe.project.status,
                (
                    bpe.project.actionable_date
                    if bpe.project.actionable_date
                    else ADate.from_str("2100-01-01")
                ),
            ),
        )

        rich_tree = Tree("🌍 Projects", guide_style="bold bright_blue")

        for project_entry in sorted_projects:
            project = project_entry.project
            aspect = cast(Aspect, project_entry.aspect)
            inbox_tasks = project_entry.inbox_tasks

            project_text = project_status_to_rich_text(
                project.status,
                project.archived,
            )
            project_text.append(" ")
            project_text.append(entity_id_to_rich_text(project.ref_id))
            if project.is_key:
                project_text.append(" 🔑")
            project_text.append(f" {project.name}")

            project_info_text = Text("")
            if project.actionable_date is not None:
                project_info_text.append(
                    actionable_date_to_rich_text(project.actionable_date),
                )

            if project.due_date is not None:
                project_info_text.append(" ")
                project_info_text.append(due_date_to_rich_text(project.due_date))

            if aspect is not None and context.workspace.is_feature_available(
                WorkspaceFeature.LIFE_PLAN
            ):
                project_info_text.append(" ")
                project_info_text.append(aspect_to_rich_text(aspect.name))

            if project.archived:
                project_text.stylize("gray62")
                project_info_text.stylize("gray62")

            project_tree = rich_tree.add(
                project_text,
                guide_style="gray62" if project.archived else "blue",
            )
            project_tree.add(project_info_text)

            if inbox_tasks is None or len(inbox_tasks) == 0:
                continue

            sorted_inbox_tasks = sorted(
                inbox_tasks,
                key=lambda it: (
                    it.archived,
                    it.status,
                    it.due_date if it.due_date else ADate.from_str("2100-01-01"),
                ),
            )

            for inbox_task in sorted_inbox_tasks:
                inbox_task_text = inbox_task_summary_to_rich_text(inbox_task)
                project_tree.add(inbox_task_text)

        console.print(rich_tree)
