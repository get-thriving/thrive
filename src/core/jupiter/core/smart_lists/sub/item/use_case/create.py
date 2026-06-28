"""The command for creating a smart list item."""

from jupiter.core.common.url import URL
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.name import (
    SmartListItemName,
)
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class SmartListItemCreateArgs(JupiterCreateCrownEntityArgs):
    """SmartListItemCreate args."""

    smart_list_ref_id: EntityId
    name: SmartListItemName
    is_done: bool
    url: URL | None


@use_case_result
class SmartListItemCreateResult(UseCaseResultBase):
    """SmartListItemCreate result."""

    new_smart_list_item: SmartListItem


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListItemCreateUseCase(
    JupiterCreateCrownEntityUseCase[
        SmartListItemCreateArgs, SmartListItemCreateResult
    ],
):
    """The command for creating a smart list item."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SmartListItemCreateArgs,
    ) -> SmartListItemCreateResult:
        """Execute the command's action."""
        await self.check_entity(
            uow, context.user.ref_id, SmartList, args.smart_list_ref_id
        )

        new_smart_list_item = SmartListItem.new_smart_list_item(
            ctx=context.domain_context,
            smart_list_ref_id=args.smart_list_ref_id,
            name=args.name,
            is_done=args.is_done,
            url=args.url,
        )
        new_smart_list_item = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_smart_list_item,
        )

        return SmartListItemCreateResult(new_smart_list_item=new_smart_list_item)
