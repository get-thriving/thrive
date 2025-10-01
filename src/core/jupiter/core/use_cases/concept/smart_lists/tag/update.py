"""The command for updating a smart list tag."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.smart_lists.smart_list_tag import SmartListTag
from jupiter.core.domain.core.tags.tag_name import TagName
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.use_cases.infra.use_cases import (
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
class SmartListTagUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId
    tag_name: UpdateAction[TagName]


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListTagUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[SmartListTagUpdateArgs, None]
):
    """The command for updating a smart list tag."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: SmartListTagUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        smart_list_tag = await uow.get_for(SmartListTag).load_by_id(args.ref_id)
        smart_list_tag = smart_list_tag.update(
            ctx=context.domain_context,
            tag_name=args.tag_name,
        )

        await uow.get_for(SmartListTag).save(smart_list_tag)
        await progress_reporter.mark_updated(smart_list_tag)
