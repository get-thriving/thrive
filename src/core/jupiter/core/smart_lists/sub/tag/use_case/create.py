"""The command for creating a smart list tag."""

from jupiter.core.common.sub.tags.sub.tag.name import TagName
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.smart_lists.root import SmartList
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


@use_case_args
class SmartListTagCreateArgs(UseCaseArgsBase):
    """SmartListTagCreate args."""

    smart_list_ref_id: EntityId
    tag_name: TagName


@use_case_result
class SmartListTagCreateResult(UseCaseResultBase):
    """SmartListTagCreate result."""

    new_smart_list_tag: SmartListTag


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListTagCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        SmartListTagCreateArgs, SmartListTagCreateResult
    ],
):
    """The command for creating a smart list tag."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SmartListTagCreateArgs,
    ) -> SmartListTagCreateResult:
        """Execute the command's action."""
        metric = await uow.get_for(SmartList).load_by_id(
            args.smart_list_ref_id,
        )
        new_smart_list_tag = SmartListTag.new_smart_list_tag(
            ctx=context.domain_context,
            smart_list_ref_id=metric.ref_id,
            tag_name=args.tag_name,
        )
        new_smart_list_tag = await uow.get_for(SmartListTag).create(
            new_smart_list_tag,
        )
        await progress_reporter.mark_created(new_smart_list_tag)

        return SmartListTagCreateResult(new_smart_list_tag=new_smart_list_tag)
