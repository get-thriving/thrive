"""Command for showing the time plans."""

from jupiter.cli.command.rendering import (
    entity_id_to_rich_text,
    entity_name_to_rich_text,
    period_to_rich_text,
    time_plan_source_to_rich_text,
)
from jupiter.cli.config import JupiterLoggedInReadonlyCommand
from jupiter.core.config import JupiterLoggedInReadonlyContext
from jupiter.core.time_plans.use_case.find import (
    TimePlanFindResult,
    TimePlanFindUseCase,
)
from rich.console import Console
from rich.text import Text
from rich.tree import Tree


class TimePlanShow(
    JupiterLoggedInReadonlyCommand[TimePlanFindUseCase, TimePlanFindResult]
):
    """Command for showing the time plans."""

    def _render_result(
        self,
        console: Console,
        context: JupiterLoggedInReadonlyContext,
        result: TimePlanFindResult,
    ) -> None:
        sorted_time_plans = sorted(
            result.entries,
            key=lambda tp: (
                tp.time_plan.archived,
                tp.time_plan.right_now,
                tp.time_plan.period,
            ),
            reverse=True,
        )

        rich_tree = Tree("🏭 Time Plans", guide_style="bold bright_blue")

        for time_plan_entry in sorted_time_plans:
            time_plan = time_plan_entry.time_plan

            time_plan_text = (
                Text("")
                .append(entity_id_to_rich_text(time_plan.ref_id))
                .append(" ")
                .append(entity_name_to_rich_text(time_plan.name))
                .append(" ")
                .append(time_plan_source_to_rich_text(time_plan.source))
                .append(" ")
                .append(period_to_rich_text(time_plan.period))
            )

            rich_tree.add(
                time_plan_text, guide_style="gray62" if time_plan.archived else "blue"
            )

        console.print(rich_tree)
