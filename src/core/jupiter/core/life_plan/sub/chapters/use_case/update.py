"""The command for updating a chapter."""

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
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ChapterUpdateArgs(UseCaseArgsBase):
    """Chapter update args."""

    ref_id: EntityId
    name: UpdateAction[ChapterName]
    project_ref_id: UpdateAction[EntityId]
    start_date: UpdateAction[PartialDate]
    end_date: UpdateAction[PartialDate]


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class ChapterUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ChapterUpdateArgs, None]
):
    """The command for updating a chapter."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChapterUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )

        chapter = await uow.get_for(Chapter).load_by_id(args.ref_id)
        _ = await uow.get_for(Project).load_by_id(
            args.project_ref_id.or_else(chapter.project_ref_id)
        )
        chapter = chapter.update(
            ctx=context.domain_context,
            birthday=life_plan.birthday_date,
            name=args.name,
            project_ref_id=args.project_ref_id,
            start_date=args.start_date,
            end_date=args.end_date,
        )

        await uow.get_for(Chapter).save(chapter)
        await progress_reporter.mark_updated(chapter)
