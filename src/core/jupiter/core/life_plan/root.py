"""A life plan."""

from typing import ClassVar

from jupiter.core.common.birth_year import BirthYear
from jupiter.core.common.birthday import Birthday
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.life_plan.eval_approach import LifePlanEvalApproach
from jupiter.core.life_plan.partial_date import MAX_AGE
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.core.life_plan.sub.visions.root import Vision
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsEntityLinkStd,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction

TIME_PLAN_MAX_LIFE_PLAN_LINKS = 3


@entity("Workspace")
class LifePlan(TrunkEntity):
    """A aspect collection."""

    ALLOWED_EVAL_PERIODS: ClassVar[set[RecurringTaskPeriod]] = {
        RecurringTaskPeriod.MONTHLY,
        RecurringTaskPeriod.QUARTERLY,
        RecurringTaskPeriod.YEARLY,
    }

    workspace: ParentLink

    birthday: Birthday
    birth_year: BirthYear
    max_age: int
    time_plan_max_life_plan_links: int

    eval_approach: LifePlanEvalApproach
    eval_periods: set[RecurringTaskPeriod]
    eval_task_gen_params: RecurringTaskGenParams | None
    eval_task_generation_in_advance_days: dict[RecurringTaskPeriod, int]

    aspects = ContainsMany(Aspect, life_plan_ref_id=IsRefId())
    chapters = ContainsMany(Chapter, life_plan_ref_id=IsRefId())
    goals = ContainsMany(Goal, life_plan_ref_id=IsRefId())
    milestones = ContainsMany(Milestone, life_plan_ref_id=IsRefId())
    visions = ContainsMany(Vision, life_plan_ref_id=IsRefId())
    eval_tasks = ContainsMany(InboxTask, owner=IsEntityLinkStd("LifePlan"))

    @staticmethod
    @create_entity_action
    def new_life_plan(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
        birthday: Birthday,
        birth_year: BirthYear,
    ) -> "LifePlan":
        """Create a life plan."""
        return LifePlan._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
            birthday=birthday,
            birth_year=birth_year,
            max_age=MAX_AGE,
            time_plan_max_life_plan_links=TIME_PLAN_MAX_LIFE_PLAN_LINKS,
            eval_approach=LifePlanEvalApproach.NONE,
            eval_periods=set(),
            eval_task_gen_params=None,
            eval_task_generation_in_advance_days={},
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        birthday: UpdateAction[Birthday],
        birth_year: UpdateAction[BirthYear],
    ) -> "LifePlan":
        """Update a life plan."""
        final_birthday = birthday.or_else(self.birthday)
        final_birth_year = birth_year.or_else(self.birth_year)
        return self._new_version(
            ctx, birthday=final_birthday, birth_year=final_birth_year
        )

    @update_entity_action
    def update_eval_settings(
        self,
        ctx: DomainContext,
        eval_approach: UpdateAction[LifePlanEvalApproach],
        eval_periods: UpdateAction[set[RecurringTaskPeriod]],
        eval_task_eisen: UpdateAction[Eisen | None],
        eval_task_difficulty: UpdateAction[Difficulty | None],
        eval_task_generation_in_advance_days: UpdateAction[
            dict[RecurringTaskPeriod, int]
        ],
    ) -> "LifePlan":
        """Update the eval settings for a life plan."""
        final_eval_approach = eval_approach.or_else(self.eval_approach)
        final_eval_periods = eval_periods.or_else(self.eval_periods)
        final_eval_task_eisen = eval_task_eisen.or_else(
            self.eval_task_gen_params.eisen
            if self.eval_task_gen_params is not None
            else None
        )
        final_eval_task_difficulty = eval_task_difficulty.or_else(
            self.eval_task_gen_params.difficulty
            if self.eval_task_gen_params is not None
            else None
        )
        final_eval_task_generation_in_advance_days = (
            eval_task_generation_in_advance_days.or_else(
                self.eval_task_generation_in_advance_days
            )
        )

        # Ensure the keys for generation in advance days match the periods selected
        LifePlan._validate_allowed_eval_periods(final_eval_periods)
        LifePlan._validate_allowed_eval_periods(
            set(final_eval_task_generation_in_advance_days.keys())
        )

        if final_eval_approach == LifePlanEvalApproach.NONE:
            if len(final_eval_task_generation_in_advance_days) > 0:
                raise InputValidationError(
                    "Generation in advance days cannot be set if eval approach is NONE"
                )
            if final_eval_task_eisen is not None:
                raise InputValidationError(
                    "Eval task eisen cannot be set if eval approach is NONE"
                )
            if final_eval_task_difficulty is not None:
                raise InputValidationError(
                    "Eval task difficulty cannot be set if eval approach is NONE"
                )
            final_eval_task_gen_params = None
        elif final_eval_approach == LifePlanEvalApproach.TASK:
            if len(final_eval_periods) == 0:
                raise InputValidationError("Eval periods cannot be empty")
            if final_eval_periods != final_eval_task_generation_in_advance_days.keys():
                raise InputValidationError(
                    "Periods must match generation in advance days keys"
                )
            if final_eval_task_eisen is None:
                raise InputValidationError(
                    "Eval task eisen must be set if eval approach is TASK"
                )
            if final_eval_task_difficulty is None:
                raise InputValidationError(
                    "Eval task difficulty must be set if eval approach is TASK"
                )
            final_eval_task_gen_params = RecurringTaskGenParams(
                period=RecurringTaskPeriod.DAILY,
                eisen=final_eval_task_eisen,
                difficulty=final_eval_task_difficulty,
                actionable_from_day=None,
                actionable_from_month=None,
                due_at_day=None,
                due_at_month=None,
                skip_rule=None,
            )
        else:
            raise InputValidationError(f"Unknown eval approach: {final_eval_approach}")

        LifePlan._validate_eval_task_generation_in_advance_days(
            final_eval_task_generation_in_advance_days
        )

        return self._new_version(
            ctx,
            eval_periods=final_eval_periods,
            eval_approach=final_eval_approach,
            eval_task_gen_params=final_eval_task_gen_params,
            eval_task_generation_in_advance_days=final_eval_task_generation_in_advance_days,
        )

    @staticmethod
    def _validate_allowed_eval_periods(periods: set[RecurringTaskPeriod]) -> None:
        """Validate allowed periods for life plan eval."""
        invalid_periods = [
            period for period in periods if period not in LifePlan.ALLOWED_EVAL_PERIODS
        ]
        if len(invalid_periods) > 0:
            raise InputValidationError(
                "Eval periods must be monthly, quarterly, or yearly"
            )

    @staticmethod
    def _validate_eval_task_generation_in_advance_days(
        generation_in_advance_days: dict[RecurringTaskPeriod, int],
    ) -> None:
        """Validate the generation in advance days."""
        if RecurringTaskPeriod.DAILY in generation_in_advance_days:
            if generation_in_advance_days[RecurringTaskPeriod.DAILY] != 1:
                raise InputValidationError(
                    "Generation in advance days for daily must be 1"
                )
        if RecurringTaskPeriod.WEEKLY in generation_in_advance_days:
            if (
                generation_in_advance_days[RecurringTaskPeriod.WEEKLY] < 1
                or generation_in_advance_days[RecurringTaskPeriod.WEEKLY] > 7
            ):
                raise InputValidationError(
                    "Generation in advance days for weekly must be between 1 and 7"
                )
        if RecurringTaskPeriod.MONTHLY in generation_in_advance_days:
            if (
                generation_in_advance_days[RecurringTaskPeriod.MONTHLY] < 1
                or generation_in_advance_days[RecurringTaskPeriod.MONTHLY] > 30
            ):
                raise InputValidationError(
                    "Generation in advance days for monthly must be between 1 and 30"
                )

    @property
    def birthday_date(self) -> ADate:
        """Get the birthday date."""
        return ADate.from_components(
            self.birth_year.the_year, self.birthday.month, self.birthday.day
        )

    @property
    def end_date(self) -> ADate:
        """Get the end date."""
        return self.birthday_date.add_years(self.max_age)
