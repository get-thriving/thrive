"""Find habits suitable for adding to a time plan."""

from jupiter.core.app import AppCore
from jupiter.core.apps.habits.root import Habit
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class HabitFindSuitableForTimePlanArgs(JupiterFindCrownEntityArgs):
    """Args."""

    time_plan_ref_id: EntityId


@use_case_result_part
class HabitFindSuitableForTimePlanResultEntry(UseCaseResultBase):
    """A habit with suitability for adding to a time plan."""

    habit: Habit
    aspect: Aspect | None
    has_uncompleted_historical_inbox_tasks: bool
    would_generate_in_time_plan: bool


@use_case_result
class HabitFindSuitableForTimePlanResult(UseCaseResultBase):
    """The result."""

    entries: list[HabitFindSuitableForTimePlanResultEntry]


@readonly_use_case(
    WorkspaceFeature.HABITS,
    WorkspaceFeature.TIME_PLANS,
    only_for_component=[AppCore.WEBUI, AppCore.API],
)
class HabitFindSuitableForTimePlanUseCase(
    JupiterFindCrownEntityUseCase[
        HabitFindSuitableForTimePlanArgs, HabitFindSuitableForTimePlanResult
    ]
):
    """Find habits suitable for adding to a time plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: HabitFindSuitableForTimePlanArgs,
    ) -> HabitFindSuitableForTimePlanResult:
        """Execute the command's action."""
        time_plan = await self.load_entity(
            uow,
            context.user.ref_id,
            TimePlan,
            args.time_plan_ref_id,
        )

        if not time_plan.allows_inbox_tasks:
            raise InputValidationError(
                "Habits can only be added to daily or weekly time plans"
            )

        habits = await self.find_all_entities(
            uow,
            context.user.ref_id,
            Habit,
            allow_archived=False,
        )
        if not habits:
            return HabitFindSuitableForTimePlanResult(entries=[])

        habit_owner_links = [
            EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id) for habit in habits
        ]
        owners_with_uncompleted = await uow.get(
            InboxTaskRepository
        ).find_owner_ref_ids_with_uncompleted_tasks(habit_owner_links)

        if context.workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            aspect_ref_ids = list({habit.aspect_ref_id for habit in habits})
            aspects = (
                await uow.get_for(Aspect).find_all_generic(
                    allow_archived=True,
                    ref_id=aspect_ref_ids,
                )
                if aspect_ref_ids
                else []
            )
            aspect_by_ref_id = {aspect.ref_id: aspect for aspect in aspects}
        else:
            aspect_by_ref_id = None

        return HabitFindSuitableForTimePlanResult(
            entries=[
                HabitFindSuitableForTimePlanResultEntry(
                    habit=habit,
                    aspect=(
                        aspect_by_ref_id.get(habit.aspect_ref_id)
                        if aspect_by_ref_id is not None
                        else None
                    ),
                    has_uncompleted_historical_inbox_tasks=(
                        habit.ref_id in owners_with_uncompleted
                    ),
                    would_generate_in_time_plan=habit.would_generate_in_time_plan(
                        time_plan.start_date,
                        time_plan.end_date,
                    ),
                )
                for habit in habits
            ],
        )
