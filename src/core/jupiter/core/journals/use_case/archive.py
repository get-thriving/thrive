"""Use case for archiving a journal."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.journals.root import Journal
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class JournalArchiveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI])
class JournalArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[JournalArchiveArgs, None]
):
    """Use case for archiving a journal."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        journal = await uow.get_for(Journal).load_by_id(args.ref_id)
        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            context.domain_context,
            uow,
            TagNamespace.JOURNAL,
            journal.ref_id,
            JupiterArchivalReason.USER,
        )
        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            Journal,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
