"""The command for creating a chapter."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.partial_date import PartialDate
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.name import ChapterName
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ChapterCreateArgs(UseCaseArgsBase):
    """Chapter create args."""

    name: ChapterName
    project_ref_id: EntityId
    start_date: PartialDate
    end_date: PartialDate


@use_case_result
class ChapterCreateResult(UseCaseResultBase):
    """Chapter create results."""

    new_chapter: Chapter


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class ChapterCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ChapterCreateArgs, ChapterCreateResult]
):
    """The command for creating a chapter."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChapterCreateArgs,
    ) -> ChapterCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )

        milestones = await uow.get_for(Milestone).find_all(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
        )
        milestone_dates_by_ref_id = {
            milestone.ref_id: milestone.date for milestone in milestones
        }

        earliest_start_date = args.start_date.earliest_relative_to(
            life_plan.birthday_date,
            ADate.from_timestamp(context.domain_context.action_timestamp),
            milestone_dates_by_ref_id,
        )
        latest_end_date = args.end_date.latest_relative_to(
            life_plan.birthday_date,
            ADate.from_timestamp(context.domain_context.action_timestamp),
            milestone_dates_by_ref_id,
        )

        if earliest_start_date < life_plan.birthday_date:
            raise InputValidationError(
                f"Start date {earliest_start_date} is before birthday {life_plan.birthday_date}"
            )

        if latest_end_date > life_plan.end_date:
            raise InputValidationError(
                f"End date {latest_end_date} is after end date {life_plan.end_date}"
            )

        project = await uow.get_for(Project).load_by_id(args.project_ref_id)

        new_chapter = Chapter.new_chapter(
            ctx=context.domain_context,
            life_plan_ref_id=life_plan.ref_id,
            birthday=life_plan.birthday_date,
            milestone_dates_by_ref_id=milestone_dates_by_ref_id,
            name=args.name,
            project_ref_id=project.ref_id,
            start_date=args.start_date,
            end_date=args.end_date,
        )

        new_chapter = await uow.get_for(Chapter).create(new_chapter)
        await progress_reporter.mark_created(new_chapter)

        return ChapterCreateResult(new_chapter=new_chapter)
