"""The command for archiving a smart list."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


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
        context: JupiterLoggedInMutationContext,
        args: SmartListArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        smart_list = await uow.get_for(SmartList).load_by_id(args.ref_id)

        smart_list_items = await uow.get_for(SmartListItem).find_all(
            smart_list.ref_id,
        )

        for smart_list_item in smart_list_items:
            smart_list_item = smart_list_item.mark_archived(
                context.domain_context, JupiterArchivalReason.USER
            )
            await uow.get_for(SmartListItem).save(smart_list_item)
            await progress_reporter.mark_updated(smart_list_item)

            # Archive all the tags for the smart list item as well
            tag_link_archive_service = TagLinkArchiveService()
            await tag_link_archive_service.archive_for_entity(
                context.domain_context,
                uow,
                EntityLink.std(
                    NamedEntityTag.SMART_LIST_ITEM.value, smart_list_item.ref_id
                ),
                JupiterArchivalReason.USER,
            )

            note_archive_service = NoteArchiveService()
            await note_archive_service.archive_for_owner(
                context.domain_context,
                uow,
                EntityLink.std(
                    NamedEntityTag.SMART_LIST_ITEM.value,
                    smart_list_item.ref_id,
                ),
                JupiterArchivalReason.USER,
            )

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            context.domain_context,
            uow,
            EntityLink.std(NamedEntityTag.SMART_LIST.value, smart_list.ref_id),
            JupiterArchivalReason.USER,
        )
        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_owner(
            context.domain_context,
            uow,
            EntityLink.std(NamedEntityTag.SMART_LIST.value, smart_list.ref_id),
            JupiterArchivalReason.USER,
        )

        smart_list = smart_list.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(SmartList).save(smart_list)
        await progress_reporter.mark_updated(smart_list)
