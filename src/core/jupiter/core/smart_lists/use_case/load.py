"""Use case for loading a smart list."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.service.load import (
    SmartListLoadResult,
    SmartListLoadService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import use_case_args

__all__ = ["SmartListLoadArgs", "SmartListLoadResult", "SmartListLoadUseCase"]


@use_case_args
class SmartListLoadArgs(JupiterLoadCrownEntityArgs):
    """SmartListLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None
    allow_archived_items: bool | None
    allow_archived_tags: bool | None
    include_item_tags_and_notes: bool | None = None


@readonly_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListLoadUseCase(
    JupiterLoadCrownEntityUseCase[SmartListLoadArgs, SmartListLoadResult]
):
    """Use case for loading a smart list."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: SmartListLoadArgs,
    ) -> SmartListLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        allow_archived_items = args.allow_archived_items or False
        allow_archived_tags = args.allow_archived_tags or False
        include_item_tags_and_notes = args.include_item_tags_and_notes or False

        await self.check_entity(
            uow,
            context.user.ref_id,
            SmartList,
            args.ref_id,
            allow_archived,
        )
        smart_list = await uow.get_for(SmartList).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )

        return await SmartListLoadService().do_it(
            uow,
            context.workspace.ref_id,
            smart_list,
            allow_archived=allow_archived,
            allow_archived_items=allow_archived_items,
            allow_archived_tags=allow_archived_tags,
            include_item_tags_and_notes=include_item_tags_and_notes,
        )
