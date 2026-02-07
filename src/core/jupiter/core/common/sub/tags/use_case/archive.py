"""Use case for archiving a tag."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tags.root import Tag
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TagArchiveArgs(UseCaseArgsBase):
    """TagArchive args."""

    ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class TagArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TagArchiveArgs, None]
):
    """Use case for archiving a tag."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TagArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        tag = await uow.get_for(Tag).load_by_id(args.ref_id)
        tag = tag.mark_archived(context.domain_context, JupiterArchivalReason.USER)
        await uow.get_for(Tag).save(tag)
        await progress_reporter.mark_updated(tag)

