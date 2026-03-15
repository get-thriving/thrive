"""Use case for archiving a schedule export."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class ScheduleExportArchiveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleExportArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleExportArchiveArgs, None]
):
    """Use case for archiving a schedule export."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleExportArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            context.domain_context,
            uow,
            TagNamespace.SCHEDULE_EXPORT,
            args.ref_id,
            JupiterArchivalReason.USER,
        )

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            ScheduleExport,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
