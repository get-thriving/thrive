"""Use case for archiving a doc."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.concept.docs.doc import Doc
from jupiter.core.domain.concept.docs.service.doc_archive_service import (
    DocArchiveService,
)
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DocArchiveArgs(UseCaseArgsBase):
    """DocArchive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[DocArchiveArgs, None]
):
    """Use case for archiving a doc."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: DocArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        doc = await uow.get_for(Doc).load_by_id(args.ref_id)
        await DocArchiveService().do_it(
            context.domain_context,
            uow,
            progress_reporter,
            doc,
            JupiterArchivalReason.USER,
        )
