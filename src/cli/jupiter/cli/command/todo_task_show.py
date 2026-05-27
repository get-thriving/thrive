"""UseCase for showing the todo tasks."""

from jupiter.cli.command.rendering import (
    actionable_date_to_rich_text,
    aspect_to_rich_text,
    contact_to_rich_text,
    difficulty_to_rich_text,
    due_date_to_rich_text,
    eisen_to_rich_text,
    entity_id_to_rich_text,
    inbox_task_status_to_rich_text,
    tag_to_rich_text,
)
from jupiter.cli.config import JupiterLoggedInReadonlyCommand
from jupiter.core.config import JupiterLoggedInReadonlyContext
from jupiter.core.features import WorkspaceFeature
from jupiter.core.todo.use_case.find import (
    TodoTaskFindResult,
    TodoTaskFindUseCase,
)
from jupiter.framework.base.adate import ADate
from rich.console import Console
from rich.text import Text
from rich.tree import Tree


class TodoTaskShow(
    JupiterLoggedInReadonlyCommand[TodoTaskFindUseCase, TodoTaskFindResult]
):
    """UseCase class for showing the todo tasks."""

    def _render_result(
        self,
        console: Console,
        context: JupiterLoggedInReadonlyContext,
        result: TodoTaskFindResult,
    ) -> None:
        sorted_todo_tasks = sorted(
            result.entries,
            key=lambda entry: (
                entry.todo_task.archived,
                entry.inbox_task.status if entry.inbox_task else "zzz",
                (
                    entry.inbox_task.due_date
                    if entry.inbox_task and entry.inbox_task.due_date
                    else ADate.from_str("2100-01-01")
                ),
            ),
        )

        rich_tree = Tree("📝 Todo Tasks", guide_style="bold bright_blue")

        for todo_entry in sorted_todo_tasks:
            todo_task = todo_entry.todo_task
            inbox_task = todo_entry.inbox_task
            aspect = todo_entry.aspect
            tags = todo_entry.tags
            contacts = todo_entry.contacts

            todo_task_text = Text("")
            if inbox_task:
                todo_task_text.append(
                    inbox_task_status_to_rich_text(
                        inbox_task.status,
                        inbox_task.archived,
                    )
                )
                todo_task_text.append(" ")
            todo_task_text.append(entity_id_to_rich_text(todo_task.ref_id))
            if inbox_task and inbox_task.is_key:
                todo_task_text.append(" 🔑")
            todo_task_text.append(f" {todo_task.name}")

            todo_task_info_text = Text("")
            if inbox_task:
                todo_task_info_text.append(eisen_to_rich_text(inbox_task.eisen))

                if inbox_task.difficulty:
                    todo_task_info_text.append(" ")
                    todo_task_info_text.append(
                        difficulty_to_rich_text(inbox_task.difficulty),
                    )

                if inbox_task.actionable_date:
                    todo_task_info_text.append(" ")
                    todo_task_info_text.append(
                        actionable_date_to_rich_text(inbox_task.actionable_date),
                    )

                if inbox_task.due_date:
                    todo_task_info_text.append(" ")
                    todo_task_info_text.append(
                        due_date_to_rich_text(inbox_task.due_date),
                    )

            if aspect is not None and context.workspace.is_feature_available(
                WorkspaceFeature.LIFE_PLAN
            ):
                if len(todo_task_info_text.plain) > 0:
                    todo_task_info_text.append(" ")
                todo_task_info_text.append(aspect_to_rich_text(aspect.name))

            for tag in tags:
                if len(todo_task_info_text.plain) > 0:
                    todo_task_info_text.append(" ")
                todo_task_info_text.append(tag_to_rich_text(str(tag.name)))

            for contact in contacts:
                if len(todo_task_info_text.plain) > 0:
                    todo_task_info_text.append(" ")
                todo_task_info_text.append(contact_to_rich_text(str(contact.name)))

            if todo_task.archived:
                todo_task_text.stylize("gray62")
                todo_task_info_text.stylize("gray62")

            todo_tree = rich_tree.add(
                todo_task_text,
                guide_style="gray62" if todo_task.archived else "blue",
            )
            if len(todo_task_info_text.plain) > 0:
                todo_tree.add(todo_task_info_text)

        console.print(rich_tree)
