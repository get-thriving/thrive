"""The command for archiving a smart list item."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.smart_lists.smart_list_item import SmartListItem
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_crown_archiver import generic_crown_archiver
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SmartListItemArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListItemArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[SmartListItemArchiveArgs, None]
):
    """The command for archiving a smart list item."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: SmartListItemArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            SmartListItem,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
