"""The command for hard removing a smart list."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.service.remove import (
    SmartListRemoveService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class SmartListRemoveArgs(JupiterRemoveCrownEntityArgs):
    """SmartListRemove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListRemoveUseCase(
    JupiterRemoveCrownEntityUseCase[SmartListRemoveArgs, None]
):
    """The command for removing a smart list."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SmartListRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        smart_list = await self.load_entity(
            uow, context.user.ref_id, SmartList, args.ref_id
        )

        smart_list_remove_service = SmartListRemoveService()
        await smart_list_remove_service.execute(
            context.domain_context,
            uow,
            progress_reporter,
            smart_list,
        )
