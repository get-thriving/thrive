"""The command for archiving a smart list tag."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.smart_lists.smart_list_item import SmartListItem
from jupiter.core.domain.concept.smart_lists.smart_list_tag import SmartListTag
from jupiter.core.domain.core.archival_reason import ArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.update_action import UpdateAction
from jupiter.framework_new.use_case import (
    ProgressReporter,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SmartListTagArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListTagArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[SmartListTagArchiveArgs, None]
):
    """The command for archiving a smart list tag."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: SmartListTagArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        smart_list_tag = await uow.get_for(SmartListTag).load_by_id(args.ref_id)

        smart_list_items = await uow.get_for(SmartListItem).find_all_generic(
            parent_ref_id=smart_list_tag.smart_list.ref_id,
            allow_archived=True,
            tag_ref_id=[args.ref_id],
        )

        for smart_list_item in smart_list_items:
            smart_list_item = smart_list_item.update(
                ctx=context.domain_context,
                name=UpdateAction.do_nothing(),
                is_done=UpdateAction.do_nothing(),
                tags_ref_id=UpdateAction.change_to(
                    [t for t in smart_list_item.tags_ref_id if t != args.ref_id],
                ),
                url=UpdateAction.do_nothing(),
            )
            await uow.get_for(SmartListItem).save(smart_list_item)
            await progress_reporter.mark_updated(smart_list_item)

        smart_list_tag = smart_list_tag.mark_archived(
            context.domain_context, ArchivalReason.USER
        )
        await uow.get_for(SmartListTag).save(smart_list_tag)
        await progress_reporter.mark_updated(smart_list_tag)
