"""Command for loading the time plans."""

from jupiter.cli.command.rendering import (
    project_status_to_rich_text,
    difficulty_to_rich_text,
    eisen_to_rich_text,
    entity_id_to_rich_text,
    entity_name_to_rich_text,
    inbox_task_status_to_rich_text,
    period_to_rich_text,
    source_to_rich_text,
    time_plan_activity_feasability_to_rich_text,
    time_plan_activity_kind_to_rich_text,
    time_plan_source_to_rich_text,
)
from jupiter.cli.config import JupiterLoggedInReadonlyCommand
from jupiter.core.config import JupiterLoggedInReadonlyContext
from jupiter.core.time_plans.use_case.load import (
    TimePlanLoadResult,
    TimePlanLoadUseCase,
)
from jupiter.framework.base.adate import ADate
from rich.console import Console
from rich.text import Text
from rich.tree import Tree


class TimePlanLoad(
    JupiterLoggedInReadonlyCommand[TimePlanLoadUseCase, TimePlanLoadResult]
):
    """Command for loading the time plans."""

    def _render_result(
        self,
        console: Console,
        context: JupiterLoggedInReadonlyContext,
        result: TimePlanLoadResult,
    ) -> None:
        time_plan = result.time_plan
        inbox_tasks_by_ref_id = {t.ref_id: t for t in result.target_inbox_tasks or []}
        projects_by_ref_id = {t.ref_id: t for t in result.target_projects or []}
        sorted_activities = sorted(
            result.activities, key=lambda a: (a.archived, a.feasability, a.kind)
        )

        time_plan_text = (
            Text("🏭 ")
            .append(entity_id_to_rich_text(time_plan.ref_id))
            .append(" ")
            .append(entity_name_to_rich_text(time_plan.name))
            .append(" ")
            .append(time_plan_source_to_rich_text(time_plan.source))
            .append(" ")
            .append(period_to_rich_text(time_plan.period))
        )

        rich_tree = Tree(time_plan_text, guide_style="bold bright_blue")

        activity_tree = rich_tree.add("Activities")

        for activity in sorted_activities:
            if activity.is_target_inbox_task:
                target_inbox_task = inbox_tasks_by_ref_id[activity.target.ref_id]
                target_name_text = entity_name_to_rich_text(target_inbox_task.name)
                target_status_text = inbox_task_status_to_rich_text(
                    target_inbox_task.status, target_inbox_task.archived
                )
            else:
                target_project = projects_by_ref_id[activity.target.ref_id]
                target_name_text = entity_name_to_rich_text(target_project.name)
                target_status_text = project_status_to_rich_text(
                    target_project.status, target_project.archived
                )

            activity_text = (
                Text("")
                .append(entity_id_to_rich_text(activity.ref_id))
                .append(" Work on ")
                .append("inbox task " if activity.is_target_inbox_task else "project ")
                .append(entity_id_to_rich_text(activity.target.ref_id))
                .append(" ")
                .append(target_name_text)
                .append(" [")
                .append(target_status_text)
                .append("] ")
                .append(time_plan_activity_kind_to_rich_text(activity.kind))
                .append(" ")
                .append(
                    time_plan_activity_feasability_to_rich_text(activity.feasability)
                )
            )

            activity_tree.add(activity_text)

        if (
            result.completed_nontarget_inbox_tasks is not None
            and len(result.completed_nontarget_inbox_tasks) > 0
        ):
            completed_nontarget_tree = rich_tree.add(
                "Completed Non-targets Inbox Tasks"
            )

            sorted_inbox_tasks = sorted(
                result.completed_nontarget_inbox_tasks,
                key=lambda it: (
                    it.archived,
                    it.eisen,
                    it.status,
                    it.due_date or ADate.from_str("2100-01-01"),
                    it.difficulty,
                ),
            )

            for inbox_task in sorted_inbox_tasks:
                inbox_task_text = inbox_task_status_to_rich_text(
                    inbox_task.status,
                    inbox_task.archived,
                )
                inbox_task_text.append(" ").append(
                    entity_id_to_rich_text(inbox_task.ref_id)
                ).append(f" {inbox_task.name}").append(" ").append(
                    source_to_rich_text(inbox_task.owner.the_type)
                ).append(
                    " "
                ).append(
                    eisen_to_rich_text(inbox_task.eisen)
                )

                if inbox_task.difficulty:
                    inbox_task_text.append(" ").append(
                        difficulty_to_rich_text(inbox_task.difficulty),
                    )

                completed_nontarget_tree.add(inbox_task_text)

        if (
            result.completed_nottarget_projects
            and len(result.completed_nottarget_projects) > 0
        ):
            completed_nontarget_tree = rich_tree.add("Completed Non-targets Projects")

            sorted_projects = sorted(
                result.completed_nottarget_projects,
                key=lambda bpe: (
                    bpe.archived,
                    bpe.status,
                    (
                        bpe.actionable_date
                        if bpe.actionable_date
                        else ADate.from_str("2100-01-01")
                    ),
                ),
            )

            for project in sorted_projects:
                project_text = project_status_to_rich_text(
                    project.status,
                    project.archived,
                )
                project_text.append(" ").append(
                    entity_id_to_rich_text(project.ref_id)
                ).append(f" {project.name}")

                completed_nontarget_tree.add(project_text)

        console.print(rich_tree)
