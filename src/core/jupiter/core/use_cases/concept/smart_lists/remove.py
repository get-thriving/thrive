"""The command for hard removing a smart list."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.smart_lists.service.remove_service import (
    SmartListRemoveService,
)
from jupiter.core.domain.concept.smart_lists.smart_list import SmartList
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SmartListRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[SmartListRemoveArgs, None]
):
    """The command for removing a smart list."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: SmartListRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        smart_list = await uow.get_for(SmartList).load_by_id(
            args.ref_id, allow_archived=True
        )

        smart_list_remove_service = SmartListRemoveService()
        await smart_list_remove_service.execute(
            context.domain_context,
            uow,
            progress_reporter,
            smart_list,
        )
