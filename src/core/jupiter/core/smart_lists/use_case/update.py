"""The command for updating a smart list."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.core.entity_icon import EntityIcon
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.smart_lists.name import SmartListName
from jupiter.core.smart_lists.root import SmartList
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SmartListUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[SmartListName]
    icon: UpdateAction[EntityIcon | None]


@mutation_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[SmartListUpdateArgs, None]
):
    """The command for updating a smart list."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SmartListUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        smart_list = await uow.get_for(SmartList).load_by_id(
            args.ref_id,
        )

        smart_list = smart_list.update(
            ctx=context.domain_context,
            name=args.name,
            icon=args.icon,
        )

        await uow.get_for(SmartList).save(smart_list)
        await progress_reporter.mark_updated(smart_list)
