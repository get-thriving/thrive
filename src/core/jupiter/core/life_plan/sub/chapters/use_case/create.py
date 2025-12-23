"""The command for creating a chapter."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.partial_date import PartialDate
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.chapters.name import ChapterName
from jupiter.core.life_plan.sub.chapters.root import Chapter
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

        new_chapter = Chapter.new_chapter(
            ctx=context.domain_context,
            life_plan_ref_id=life_plan.ref_id,
            birthday=life_plan.birthday_date,
            name=args.name,
            start_date=args.start_date,
            end_date=args.end_date,
        )

        new_chapter = await uow.get_for(Chapter).create(new_chapter)
        await progress_reporter.mark_created(new_chapter)

        return ChapterCreateResult(new_chapter=new_chapter)
