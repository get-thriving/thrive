"""The command for creating a smart list tag."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.smart_lists.smart_list import SmartList
from jupiter.core.domain.concept.smart_lists.smart_list_tag import SmartListTag
from jupiter.core.domain.core.tags.tag_name import TagName
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
)
from jupiter.framework_new.use_case_io import (
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
        context: JupiterLoggedInMutationUseCaseContext,
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
