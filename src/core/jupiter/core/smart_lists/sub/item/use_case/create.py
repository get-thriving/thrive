"""The command for creating a smart list item."""

from jupiter.core.common.tags.name import TagName
from jupiter.core.common.url import URL
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.name import (
    SmartListItemName,
)
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.core.smart_lists.sub.tag.root import SmartListTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_loader import generic_loader


@use_case_args
class SmartListItemCreateArgs(UseCaseArgsBase):
    """SmartListItemCreate args."""

    smart_list_ref_id: EntityId
    name: SmartListItemName
    is_done: bool
    tag_names: list[TagName]
    url: URL | None


@use_case_result
class SmartListItemCreateResult(UseCaseResultBase):
    """SmartListItemCreate result."""

    new_smart_list_item: SmartListItem


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListItemCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
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
        smart_list, tags = await generic_loader(
            uow, SmartList, args.smart_list_ref_id, SmartList.tags
        )
        smart_list_tags = {t.tag_name: t for t in tags if t.tag_name in args.tag_names}

        for tag_name in args.tag_names:
            if tag_name in smart_list_tags:
                continue

            smart_list_tag = SmartListTag.new_smart_list_tag(
                ctx=context.domain_context,
                smart_list_ref_id=smart_list.ref_id,
                tag_name=tag_name,
            )
            smart_list_tag = await uow.get_for(SmartListTag).create(
                smart_list_tag,
            )
            await progress_reporter.mark_created(smart_list_tag)
            smart_list_tags[smart_list_tag.tag_name] = smart_list_tag

        new_smart_list_item = SmartListItem.new_smart_list_item(
            ctx=context.domain_context,
            smart_list_ref_id=smart_list.ref_id,
            name=args.name,
            is_done=args.is_done,
            tags_ref_id=[t.ref_id for t in smart_list_tags.values()],
            url=args.url,
        )
        new_smart_list_item = await uow.get_for(SmartListItem).create(
            new_smart_list_item,
        )
        await progress_reporter.mark_created(new_smart_list_item)

        return SmartListItemCreateResult(new_smart_list_item=new_smart_list_item)
