"""The command for updating a life plan."""

from jupiter.core.common.birth_year import BirthYear
from jupiter.core.common.birthday import Birthday
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.adate import ADate
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class LifePlanUpdateArgs(UseCaseArgsBase):
    """Life plan update args."""

    birthday: UpdateAction[Birthday]
    birth_year: UpdateAction[BirthYear]


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class LifePlanUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[LifePlanUpdateArgs, None]
):
    """The command for updating a life plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LifePlanUpdateArgs,
    ) -> None:
        """Execute the command."""
        workspace = context.workspace
        today = ADate.from_timestamp(context.domain_context.action_timestamp)

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        life_plan = life_plan.update(
            ctx=context.domain_context,
            birthday=args.birthday,
            birth_year=args.birth_year,
        )

        milestones = await uow.get_for(Milestone).find_all(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
        )
        milestone_dates_by_ref_id = {
            milestone.ref_id: milestone.date for milestone in milestones
        }

        for milestone in milestones:
            if milestone.date < life_plan.birthday_date:
                raise InputValidationError(
                    f"Milestone {milestone.name} date {milestone.date} is before life plan's start date {life_plan.birthday_date}"
                )
            if milestone.date > life_plan.end_date:
                raise InputValidationError(
                    f"Milestone {milestone.name} date {milestone.date} is after life plan's end date {life_plan.end_date}"
                )

        chapters = await uow.get_for(Chapter).find_all(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
        )
        for chapter in chapters:
            earliest_start_date = chapter.start_date.earliest_relative_to(
                life_plan.birthday_date,
                today,
                milestone_dates_by_ref_id,
            )
            latest_end_date = chapter.end_date.latest_relative_to(
                life_plan.birthday_date,
                today,
                milestone_dates_by_ref_id,
            )

            if earliest_start_date < life_plan.birthday_date:
                raise InputValidationError(
                    f"Chapter {chapter.name} start date {earliest_start_date} is before life plan's start date {life_plan.birthday_date}"
                )

            if latest_end_date > life_plan.end_date:
                raise InputValidationError(
                    f"Chapter {chapter.name} end date {latest_end_date} is after life plan's end date {life_plan.end_date}"
                )

        life_plan = await uow.get_for(LifePlan).save(life_plan)
