"""Use case for archiving a chapter."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.chapters.service.unlink_entities import (
    ChapterUnlinkEntitiesService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class ChapterArchiveArgs(UseCaseArgsBase):
    """Chapter archive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class ChapterArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ChapterArchiveArgs, None]
):
    """The command for archiving a chapter."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChapterArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        life_plan = await uow.get_for(LifePlan).load_by_parent(context.workspace.ref_id)
        chapter = await uow.get_for(Chapter).load_by_id(args.ref_id)

        await ChapterUnlinkEntitiesService().unlink_entities(
            context.domain_context,
            uow,
            progress_reporter,
            life_plan,
            chapter,
        )

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            Chapter,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
