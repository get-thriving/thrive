"""The command for archiving a smart list."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.smart_lists.smart_list import SmartList
from jupiter.core.domain.concept.smart_lists.smart_list_item import SmartListItem
from jupiter.core.domain.concept.smart_lists.smart_list_tag import SmartListTag
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.core.notes.service.note_archive_service import (
    NoteArchiveService,
)
from jupiter.core.domain.features import WorkspaceFeature
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
class SmartListArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[SmartListArchiveArgs, None]
):
    """The command for archiving a smart list."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: SmartListArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        smart_list = await uow.get_for(SmartList).load_by_id(args.ref_id)

        smart_list_tags = await uow.get_for(SmartListTag).find_all(
            smart_list.ref_id,
        )
        smart_list_items = await uow.get_for(SmartListItem).find_all(
            smart_list.ref_id,
        )

        for smart_list_tag in smart_list_tags:
            smart_list_tag = smart_list_tag.mark_archived(
                context.domain_context, JupiterArchivalReason.USER
            )
            await uow.get_for(SmartListTag).save(smart_list_tag)
            await progress_reporter.mark_updated(smart_list_tag)

        for smart_list_item in smart_list_items:
            smart_list_item = smart_list_item.mark_archived(
                context.domain_context, JupiterArchivalReason.USER
            )
            await uow.get_for(SmartListItem).save(smart_list_item)
            await progress_reporter.mark_updated(smart_list_item)

            note_archive_service = NoteArchiveService()
            await note_archive_service.archive_for_source(
                context.domain_context,
                uow,
                NoteDomain.SMART_LIST_ITEM,
                smart_list_item.ref_id,
                JupiterArchivalReason.USER,
            )

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_source(
            context.domain_context,
            uow,
            NoteDomain.SMART_LIST,
            smart_list.ref_id,
            JupiterArchivalReason.USER,
        )

        smart_list = smart_list.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(SmartList).save(smart_list)
        await progress_reporter.mark_updated(smart_list)
