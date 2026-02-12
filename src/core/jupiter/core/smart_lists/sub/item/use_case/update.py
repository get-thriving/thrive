"""The command for updating a smart list item."""

from jupiter.core.common.url import URL
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.smart_lists.sub.item.name import (
    SmartListItemName,
)
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SmartListItemUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[SmartListItemName]
    is_done: UpdateAction[bool]
    url: UpdateAction[URL | None]


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListItemUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[SmartListItemUpdateArgs, None]
):
    """The command for updating a smart list item."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SmartListItemUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        smart_list_item = await uow.get_for(SmartListItem).load_by_id(args.ref_id)

        smart_list_item = smart_list_item.update(
            ctx=context.domain_context,
            name=args.name,
            is_done=args.is_done,
            url=args.url,
        )

        await uow.get_for(SmartListItem).save(smart_list_item)
        await progress_reporter.mark_updated(smart_list_item)
