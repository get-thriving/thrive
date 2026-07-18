"""Use case for loading a smart list item."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.core.smart_lists.sub.item.service.load import (
    SmartListItemLoadResult,
    SmartListItemLoadService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import use_case_args

__all__ = [
    "SmartListItemLoadArgs",
    "SmartListItemLoadResult",
    "SmartListItemLoadUseCase",
]


@use_case_args
class SmartListItemLoadArgs(JupiterLoadCrownEntityArgs):
    """SmartListItemLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListItemLoadUseCase(
    JupiterLoadCrownEntityUseCase[SmartListItemLoadArgs, SmartListItemLoadResult]
):
    """Use case for loading a smart list item."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: SmartListItemLoadArgs,
    ) -> SmartListItemLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        await self.check_entity(
            uow,
            context.user.ref_id,
            SmartListItem,
            args.ref_id,
            allow_archived,
        )

        return await SmartListItemLoadService().do_it(
            uow,
            context.workspace.ref_id,
            args.ref_id,
            allow_archived=allow_archived,
        )
